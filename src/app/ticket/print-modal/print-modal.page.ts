import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ITicketrow } from 'src/app/models/ITicketrow';
import { IPrinter } from 'src/app/models/printer';
import { PrintService } from 'src/app/services/print.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { v4 as uuid } from 'uuid';

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
    const printer = { address: this.printer };
    this.printed = true;
    this.Print
      .connect(printer as IPrinter)
      .subscribe(() => this.Print.print(this.Tickets.newTicket, this.date, this.pago, uuid()))
  }

  onPrinterSelection() {
    localStorage.setItem('printer', this.printer);
  }

}
