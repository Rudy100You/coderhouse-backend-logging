import { TicketRepository } from "../dao/repository/ticket.repository.js";

const ticketRepository = new TicketRepository()

class TicketService {
    
    createTicket = async(amount,purchaser)=>{
        await ticketRepository.create({amount,purchaser})
    }

}
export default new TicketService();