import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { IPrinter } from '../models/printer';
import { ITicketrow } from '../models/ITicketrow';


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

  async print(ticket: Map<string, ITicketrow>, date: Date, pago: number) {
    const fecha = date.toLocaleString('es-MX').replace(/-/gi, '/').substring(0, 16)
    await this.row(`${fecha}  Dulcerias N/M`)
    await this.row('')

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

    // ____                 __________
    // ####     TOTALES     #######.##
    const TOTALPad = 31 - piezasPad - total.length;
    const TOTAL = this.pad('TOTALES', TOTALPad)

    await this.row(''.padEnd(piezasPad, '_') + ''.padEnd(TOTALPad) + ''.padEnd(total.length, '_'));
    await this.row(`${piezas.padStart(piezasPad)}${TOTAL}${total}`);

    if (Number(pago) > Number(total)) {
      const PAGO = pago.toFixed(totalDecimals)
      const CAMBIO = (pago - Number(total)).toFixed(totalDecimals)

      const cambioPad = Math.max(PAGO.length, CAMBIO.length)

      const TUPAGO = this.pad('TU PAGO:', 31 - cambioPad)
      const TUCAMBIO = this.pad(' CAMBIO:', 31 - cambioPad)

      await this.row('');
      await this.row(TUPAGO + PAGO.padStart(cambioPad));
      await this.row(TUCAMBIO + CAMBIO.padStart(cambioPad));
    }

    await this.row('\n\n');
  }

  private pad = (s, l, c = ' ') => s.padStart((s.length + l) / 2, c).padEnd(l, c);
}
