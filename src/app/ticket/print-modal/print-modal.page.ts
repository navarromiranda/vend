import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ITicketrow } from 'src/app/models/ITicketrow';
import { IPrinter } from 'src/app/models/printer';
import { PrintService } from 'src/app/services/print.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { v4 as UUID } from 'uuid';
import { tick } from '@angular/core/testing';
import { ITicketWithMeta } from 'src/app/models/ITicketWithMeta';

@Component({
  selector: 'app-print-modal',
  templateUrl: './print-modal.page.html',
  styleUrls: ['./print-modal.page.scss'],
})
export class PrintModalPage implements OnInit {

  @Input() ticket: Map<string, ITicketrow>;
  pago: number;
  printed: boolean = false;
  printer: string = localStorage.getItem('printer');
  date: Date = new Date
  constructor(
    public modalCtrl: ModalController,
    public Tickets: TicketsService,
    public Print: PrintService
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({});
  }

  clearAndBack() {
    this.Tickets.clear();
    this.modalCtrl.dismiss({ clear: true });
  }

  print() {
    const tickets = new Map<string, any>(JSON.parse(localStorage.getItem('tickets')) || [])
    const uuid = UUID()

    tickets.set(uuid, {
      date: this.date,
      pago: this.pago,
      ticket: [...this.Tickets.newTicket]
    })

    // const deepMapString = JSON.stringify([...tickets].map(t => [t[0], { ...t[1], ticket: [...t[1].ticket] }]))
    localStorage.setItem('tickets', JSON.stringify([...tickets]))

    const printer = { address: this.printer };
    this.printed = true;
    this.Print
      .connect(printer as IPrinter)
      .subscribe(() => this.Print.print(this.Tickets.newTicket, this.date, this.pago, uuid))
  }

  onPrinterSelection() {
    localStorage.setItem('printer', this.printer);
  }

}
