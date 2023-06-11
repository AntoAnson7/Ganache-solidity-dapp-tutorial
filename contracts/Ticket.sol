pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Ticket {
    struct Tickets {
        uint256 eventId;
        uint256 userId;
        bool isValid;
    }

    mapping(uint256 => Tickets) public ticketsByTicketId;
    mapping(uint256 => uint256[]) public ticketsByUserId;

    event TicketCreated(uint256 indexed ticketId, uint256 indexed eventId, uint256 indexed userId);
    event TicketInvalidated(uint256 indexed ticketId, uint256 indexed eventId, uint256 indexed userId);

    uint256 private lastTicketId;

    function createTicket(uint256 eventId, uint256 userId) external returns (uint256) {
        require(eventId > 0, "Invalid event ID");
        require(userId > 0, "Invalid user ID");

        lastTicketId++;
        require(lastTicketId <= 999999, "Maximum ticket ID limit reached");

        uint256 ticketId = generateTicketId();

        Tickets memory newTicket = Tickets({
            eventId: eventId,
            userId: userId,
            isValid: true
        });

        ticketsByTicketId[ticketId] = newTicket;
        ticketsByUserId[userId].push(ticketId);

        emit TicketCreated(ticketId, eventId, userId);

        return ticketId;
    }

    function getTicketsByUser(uint256 userId) external view returns (uint256[] memory) {
        require(userId > 0, "Invalid user ID");

        return ticketsByUserId[userId];
    }

    function invalidateTicket(uint256 ticketId) external {
        require(ticketId > 0, "Invalid ticket ID");

        Tickets storage ticket = ticketsByTicketId[ticketId];

        require(ticket.userId != 0, "Ticket does not exist");
        require(ticket.isValid, "Ticket is already invalid");

        ticket.isValid = false;

        emit TicketInvalidated(ticketId, ticket.eventId, ticket.userId);
    }

    function generateTicketId() private view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
        return randomNumber % 1000000;
    }

    function getTicketDetails(uint256 ticketId) external view returns (Tickets memory) {
    require(ticketId > 0, "Invalid ticket ID");

    return ticketsByTicketId[ticketId];
}

}
