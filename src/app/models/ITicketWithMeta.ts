import { ITicketrow } from './ITicketrow';

export interface ITicketWithMeta {
    date: Date;
    pago: number;
    ticket: Map<string, ITicketrow>
}