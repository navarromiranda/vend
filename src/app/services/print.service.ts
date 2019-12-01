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
    const fecha = moment(date).format('YYYY/MM/DD HH:mm')

    await this.row(this.pad('Dulcerias N/M', 31))
    await this.row(this.pad('Francisco I. Madero 35', 31))
    await this.row('\n\n')

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
      await this.row(`${qty} ${descripcion}${Number(qty) === 1 ? '' : ' ' + precio} ${subtotal}`)
    }

    await this.row('')
    await this.row(piezas.padStart(31, '    PIEZAS'.padEnd(31)))
    await this.row(total.padStart(31, '     TOTAL'.padEnd(31)))

    if (Number(pago) > Number(total)) {
      const PAGO = pago.toFixed(totalDecimals)
      const CAMBIO = (pago - Number(total)).toFixed(totalDecimals)

      await this.row(PAGO.padStart(31, '  EFECTIVO'.padEnd(31)))
      await this.row(CAMBIO.padStart(31, '    CAMBIO'.padEnd(31)))
    }

    await this.row('')
    await this.row(fecha.padStart(31, '     FECHA'.padEnd(31)))
    await this.row(uuid.substring(0, 18).padStart(31, '    TICKET'.padEnd(31)))

    await this.row('\n\n');
    await this.row('Gracias por tu compra');
    await this.row('\n\n');
  }

  private pad = (s: string, l: number, c: string = ' ') => s.padStart((s.length + l) / 2, c).padEnd(l, c);
}
