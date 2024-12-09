
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketSale {

    uint public ticketCounter; // Total number of tickets
    uint public serviceFee = 0.1 ether; // Service fee for ticket returns
    
    // Ticket structure
    struct Ticket {
        address owner;
        bool isPurchased;
        bool isSwapPending;
    }
    
    // Mapping from ticket ID to ticket details
    mapping(uint => Ticket) public tickets;
    
    // Event declarations
    event TicketPurchased(uint ticketID, address purchaser);
    event TicketSwapOffered(uint ticketID, address offerer);
    event TicketSwapAccepted(uint ticketID, address acceptor);
    event TicketReturned(uint ticketID, address returner, uint refundAmount);
    
    // Function to purchase a ticket
    function purchaseTicket() public payable {
        // Ensure that the payment is sufficient for a ticket (e.g., 1 Ether)
        require(msg.value == 0.0000001 ether, "Ticket price is 0.000001 ether.");

        // Increment the ticket counter to get a new ticket ID
        ticketCounter++;

        // Create a new ticket for the sender
        tickets[ticketCounter] = Ticket({
            owner: msg.sender,
            isPurchased: true,
            isSwapPending: false
        });

        // Emit the event for purchasing the ticket
        emit TicketPurchased(ticketCounter, msg.sender);
    }

    // Function to offer a ticket swap
    function offerSwap(uint ticketID) public {
        // Ensure the ticket exists and belongs to the caller
        require(tickets[ticketID].isPurchased, "Ticket not purchased.");
        require(tickets[ticketID].owner == msg.sender, "You don't own this ticket.");
        require(!tickets[ticketID].isSwapPending, "Swap already pending.");

        // Mark the ticket as having a pending swap
        tickets[ticketID].isSwapPending = true;

        // Emit event for offering a swap
        emit TicketSwapOffered(ticketID, msg.sender);
    }

    // Function to accept a swap offer
    function acceptSwap(uint ticketID) public {
        // Ensure the swap offer is pending for the ticket
        require(tickets[ticketID].isSwapPending, "No swap offer for this ticket.");

        // Ensure the sender is not the owner of the ticket
        address previousOwner = tickets[ticketID].owner;
        require(previousOwner != msg.sender, "You cannot swap with yourself.");

        // Transfer the ticket ownership to the new owner
        tickets[ticketID].owner = msg.sender;

        // Mark the swap as complete
        tickets[ticketID].isSwapPending = false;

        // Emit event for accepting the swap
        emit TicketSwapAccepted(ticketID, msg.sender);
    }

    // Function to return a ticket and get a refund
    function returnTicket(uint ticketID) public {
        // Ensure the caller owns the ticket
        require(tickets[ticketID].owner == msg.sender, "You don't own this ticket.");
        require(tickets[ticketID].isPurchased, "Ticket not purchased.");
        
        // Calculate the refund amount (ticket price - service fee)
        uint refundAmount = 1 ether - serviceFee;

        // Mark the ticket as returned
        tickets[ticketID].isPurchased = false;

        // Refund the caller minus the service fee
        payable(msg.sender).transfer(refundAmount);

        // Emit event for returning the ticket
        emit TicketReturned(ticketID, msg.sender, refundAmount);
    }

    // Function to get ticket information (for frontend interaction)
    function getTicketInfo(uint ticketID) public view returns (address, bool, bool) {
        Ticket memory ticket = tickets[ticketID];
        return (ticket.owner, ticket.isPurchased, ticket.isSwapPending);
    }

    // Function to get ticket ID for a specific wallet address
    function getTicketByAddress(address user) public view returns (uint[] memory) {
        uint[] memory ownedTickets = new uint[](ticketCounter);
        uint count = 0;
        
        // Loop through all tickets and check if the user owns any of them
        for (uint i = 1; i <= ticketCounter; i++) {
            if (tickets[i].owner == user) {
                ownedTickets[count] = i;
                count++;
            }
        }

        // Resize the array to the actual count of tickets owned by the user
        uint[] memory result = new uint[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = ownedTickets[i];
        }
        return result;
    }
}