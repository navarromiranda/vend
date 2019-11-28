import { Component, OnInit, Input } from '@angular/core';
import { ITicketrow } from 'src/app/models/ITicketrow';
import { ModalController } from '@ionic/angular';
import { TicketsService } from 'src/app/services/tickets.service';
import { PrintService } from 'src/app/services/print.service';
import { IPrinter } from 'src/app/models/printer';

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
      .subscribe(() => this.Print.print(this.Tickets.newTicket))
  }

  onPrinterSelection() {
    localStorage.setItem('printer', this.printer);
  }

}
