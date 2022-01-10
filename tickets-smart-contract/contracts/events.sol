// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Events is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    event TicketsOver(uint256 eventId);
    event EventCreated(uint256 eventId);

    constructor() ERC721("SU event system", "SUE") {}

    struct Event {
        uint256 fundsCollected;
        uint256 ticketPrice;
        uint256 availableTickets;
        address eventCreator;
    }

    Event[] public events;

    mapping(address => uint256[]) creatorToEvents;
    mapping(uint256 => uint256) public ticketToEvent;

    function createEvent(uint256 numberOfTickets, uint256 pricePerTicket)
        external
    {
        events.push(Event(0, pricePerTicket, numberOfTickets, msg.sender));
        uint256 eventId = events.length - 1;

        creatorToEvents[msg.sender].push(eventId);
        emit EventCreated(eventId);
    }

    function buyTicket(uint256 eventId) external payable {
        require(events.length > eventId, "Not existing eventId");
        require(events[eventId].availableTickets > 0, "Tickets not available");
        require(
            msg.value >= events[eventId].ticketPrice,
            "Ticket price is larger"
        );
        events[eventId].availableTickets--;
        events[eventId].fundsCollected += msg.value;
        uint256 ticketId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        ticketToEvent[ticketId] = eventId;
        _mint(msg.sender, ticketId);

        if (events[eventId].availableTickets == 0) {
            emit TicketsOver(eventId);
        }
    }

    function withdrawFunds() external {
        uint256 sum = 0;
        for (uint256 i = 0; i < creatorToEvents[msg.sender].length; i++) {
            sum += events[creatorToEvents[msg.sender][i]].fundsCollected;
            events[creatorToEvents[msg.sender][i]].fundsCollected = 0;
        }
        (bool success, ) = msg.sender.call{value: sum}("");
        require(success, "Transfer failed.");
    }

    function verifyTicketOwner(
        uint256 eventId,
        string memory _message,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external view returns (bool) {
        address signerAddress = ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n",
                    uint2str(bytes(_message).length),
                    _message
                )
            ),
            v,
            r,
            s
        );

        for (uint256 i = 0; i < _tokenIdTracker.current(); i++) {
            if (ticketToEvent[i] == eventId && ownerOf(i) == signerAddress) {
                return true;
            }
        }

        return false;
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
