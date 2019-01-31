export class Clave {
    constructor(
        public articulo: string,
        public cantidad: number,
        public clave: string,
        public existencia: number,
        public precio: number,
        public unidad: string
    ) { }

}

export class Prod {
    constructor(
        public articulo: string,
        public claves: Clave[],
        public descrip: string,
        public existencia: number,
        public fav: boolean,
        public impuesto: string,
        public linea: string,
        public marca: string,
        public precio: number
    ) { }
}
