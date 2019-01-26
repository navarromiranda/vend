export class Clave {
    constructor(
        public clave: string,
        public articulo: string,
        public cantidad: number,
        public unidad: string,
        public existencia: number,
        public precio: number
    ) { }

}

export class Prod {
    constructor(
        public articulo: string,
        public descrip: string,
        public impuesto: string,
        public existencia: number,
        public linea: string,
        public marca: string,
        public precio: number,
        public claves: Clave[]
    ) { }
}

export const prods = <Prod[]>[];
