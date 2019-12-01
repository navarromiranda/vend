import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import * as moment from 'moment';
import { ITicketrow } from '../models/ITicketrow';
import { IPrinter } from '../models/printer';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  constructor(private bts: BluetoothSerial) { }

  list(): Promise<IPrinter[]> {
    return this.bts.list();
  }

  connect(printer: IPrinter) {
    return this.bts.connect(printer.address);
  }

  row(row: string) {
    return this.bts.write(row + '\n')
      .then(() => { })
      .catch(() => { })
  }

  async print(ticket: Map<string, ITicketrow>, date: Date, pago: number, uuid: string) {
    const lines = this.build(ticket, date, pago, uuid).split('\n');

    for (const line of lines) {
      await this.row(line);
    }
  }

  build(ticket: Map<string, ITicketrow>, date: Date, pago: number, uuid: string): string {
    const doc = [];
    const fecha = moment(date).format('YYYY/MM/DD HH:mm')

    doc.push(this.pad('Dulcerias N/M', 31))
    doc.push(this.pad('Francisco I. Madero 35', 31))
    doc.push('')

    const rows = Array.from(ticket.values())
      .map(({ prod, qty }) => ({
        qty,
        precio: prod.precio,
        subtotal: prod.precio * qty,
        descripcion: prod.descrip.trim()
      }))

    const piezasDecimals = rows.find(({ qty }) => !Number.isInteger(qty)) ? 2 : 0
    const precioDecimals = rows.find(({ precio }) => !Number.isInteger(precio)) ? 2 : 0
    const totalDecimals = rows.find(({ subtotal }) => !Number.isInteger(subtotal)) ? 2 : 0


    const total = rows.reduce((a, { subtotal: b }) => a + Number(b), 0).toFixed(totalDecimals);
    const piezas = rows.reduce((a, { qty: b }) => a + Number(b), 0).toFixed(piezasDecimals);

    const piezasPad = piezas.length

    const precioPad = rows.map(({ precio }) => precio.toFixed(precioDecimals).length).reduce((a, b) => a > b ? a : b, 0)
    const subtotalPad = rows.map(({ subtotal }) => subtotal.toFixed(totalDecimals).length).reduce((a, b) => a > b ? a : b, 0)

    const descripcionLength = 31 - subtotalPad - piezasPad - precioPad - 3

    const lines = rows
      .map(({ qty, precio, subtotal, descripcion }) => ({
        qty: `${qty.toFixed(piezasDecimals).padStart(piezasPad)}`,
        precio: `${precio.toFixed(precioDecimals).padStart(precioPad)}`,
        subtotal: `${subtotal.toFixed(totalDecimals).padStart(subtotalPad)}`,

        // #### ********** ###### ########
        // quedan 10 para la descripción
        descripcion: descripcion.substring(0, qty === 1 ? descripcionLength + precioPad + 1 : descripcionLength).padEnd(qty === 1 ? descripcionLength + precioPad + 1 : descripcionLength)
      }))

    for (const { qty, descripcion, precio, subtotal } of lines) {
      doc.push(`${qty} ${descripcion}${Number(qty) === 1 ? '' : ' ' + precio} ${subtotal}`)
    }

    doc.push('')
    doc.push(piezas.padStart(31, '    PIEZAS'.padEnd(31)))
    doc.push(total.padStart(31, '     TOTAL'.padEnd(31)))

    if (Number(pago) > Number(total)) {
      const PAGO = pago.toFixed(totalDecimals)
      const CAMBIO = (pago - Number(total)).toFixed(totalDecimals)

      doc.push(PAGO.padStart(31, '  EFECTIVO'.padEnd(31)))
      doc.push(CAMBIO.padStart(31, '    CAMBIO'.padEnd(31)))
    }

    doc.push('')
    doc.push(fecha.padStart(31, '     FECHA'.padEnd(31)))
    doc.push(uuid.substring(0, 18).padStart(31, '    TICKET'.padEnd(31)))

    doc.push('');
    doc.push(this.pad('Gracias por tu compra', 31));
    doc.push('\n\n');

    return doc.join('\n');
  }

  private pad = (s: string, l: number, c: string = ' ') => s.padStart((s.length + l) / 2, c).padEnd(l, c);
}
