import { ticketSchema } from "../models/schema/ticket.schema.js";
import { CommonMDBRepository } from "./commonMDB.repository.js";

export class TicketRepository extends CommonMDBRepository {
    constructor() {
      super("tickets", ticketSchema);
    }
}