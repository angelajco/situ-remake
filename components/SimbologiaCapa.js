

class RangoSimb {

	constructor(tipo, Min, Max, color, leyenda, borde, grosor) {
		if (borde === undefined) {
			this.colorBorde = "#000000";
			this.anchoBorde = 1;
			
		} else {
			this.colorBorde = borde;
			this.anchoBorde = grosor;

		}
		this.valorMin = Min;
		this.valorMax = Max;
		this.tipo = tipo; //tipo=0 el rango es  para valores unicos  tipo = 1  se utiliza min y maximo
		this.leyenda = leyenda;
		this.colorFill = color;
		this.fillOpacity = 0.7;
	}

	filaHtml(i) {
		
		return `<tr><td id='${i}'>${this.valorMin}</td><td id='${i + 1}'>${this.valorMax}</td><td ><input id='${i + 2}' value='${this.leyenda}'/></td><td style="background-color: ${this.colorFill};width: 25px;"><input id='${i + 3}' value='${this.colorFill}' type='color'></input></td><td><input type="hidden" id='${i + 4}' value='${this.colorBorde}'/></td><td ><input type="hidden" id='${i + 5}' value='${this.anchoBorde}'/></td></tr>`;
	}

	filaHtml1(i) {

		return `<tr><td id='${i}'>${this.valorMin}</td><td id='${i + 1}'>${this.valorMax}</td><td id='${i + 2}'>${this.leyenda}</td><td id='${i + 3}' style="background-color: ${this.colorFill}; width: 25px;"></td></tr>`;
	}

	filaHtmlSim(aux) {
		if (aux == 0) {
			//no usamos maximo
			return `<tr><td style="background-color: ${this.colorFill};width: 25px;"></td><td style="width: 150px;">${this.leyenda}</td></tr>`;
		} else {
			//usamos ambos valores
			return `<tr><td style="background-color: ${this.colorFill}; width: 25px;"></td><td style="width: 150px;">${this.leyenda}</td><td>${this.valorMin}</td><td>${this.valorMax}</td></tr>`;
		}

	}
	salidaJson() {
		let salida = {};
		salida.colorFill = this.colorFill;
		salida.colorBorde = this.colorBorde;
		salida.anchoBorde = this.anchoBorde;
		return salida;
	}

	salidaDefault() {
		let salida = {}
		salida.colorFill = ' #000000';
		salida.colorBorde = '#000000';
		salida.tipo = 'default';
		salida.anchoBorde = 1;
		salida.fillOpacity = 1;
		return salida;
	}

}


class simbologiaCapa {


	constructor() {
		this.rangos = [];
		this.simDefault = {}

	}

	agregaRango(tipo, valorMin, valorMax, color, leyenda) {
		let nuevo = new RangoSimb(tipo, valorMin, valorMax, color, leyenda);
		this.rangos.push(nuevo);
	}
	agregaRango(tipo, valorMin, valorMax, color, leyenda, borde, grosor) {
		let nuevo = new RangoSimb(tipo, valorMin, valorMax, color, leyenda, borde, grosor);
		this.rangos.push(nuevo);
	}

	tablahtml(aux) {
		//aux == 0 manda tabla sin edicion aux ==1 manda tabla para edicion a

		if (aux == 0) {
			let salida = `<table id='tablaE' class="table-wrapper-scroll-y my-custom-scrollbar"><tr><th>Minimo</th><th>Maximo</th><th>Leyenda</th><th>Color</th><tr>`;
			for (let i = 0; i < this.rangos.length; i++) {
				salida += this.rangos[i].filaHtml1(i);
			}
			salida += `</table>`;
			return salida;
		} else {
			//mando esto para edicion
			let aux1 = 0;
			let salida = `<table id='tablaE' class="table-wrapper-scroll-y my-custom-scrollbar"><tr><th>Minimo</th><th>Maximo</th><th>Leyenda</th><th>Color</th><th></th><th></th><tr>`;
			for (let i = 0; i < this.rangos.length; i++) {
				salida += this.rangos[i].filaHtml(aux1);
				aux1 = aux1 + 6;
			}
			salida += `</table>`;
			return salida;
		}

	}

	tablaSimbologia() {
		if (this.rangos[0].valorMax != 0) {
			//manda tabla con minimo y maximo
			let salida = `<table class="table table-wrapper-scroll-y my-custom-scrollbar"><tr><th>Color</th><th>Leyenda</th><th>Valor Minimo</th><th>Valor Maximo</th><tr>`;

			for (let i = 0; i < this.rangos.length; i++) {
				salida += this.rangos[i].filaHtmlSim(1);
			}
			salida += `</table>`;
			return salida;



		} else {
			//solo manda color y leyenda
			let salida = `<table class="table table-wrapper-scroll-y my-custom-scrollbar"><tr><th>Color</th><th>Leyenda</th><tr>`;

			for (let i = 0; i < this.rangos.length; i++) {
				salida += this.rangos[i].filaHtmlSim(0);
			}
			salida += `</table>`;
			return salida;

		}
	}


	cambiaMinimo(rango, valor) {
		this.rangos[rango].valorMin = valor;
	}

	cambiaMaximo(rango, valor) {

	}

	getSimbologia(valor) {
		//console.log(valor);
		let i = 0;
		do {
			if (this.rangos[i].tipo == 0) {
				//verificar que el valor == valor min del rango 
				if (valor == this.rangos[i].valorMin) {
					return this.rangos[i].salidaJson();
				} else {
					if (valor >= this.rangos[i].valorMin && valor <= this.rangos[i].valorMax) {
						return this.rangos[i].salidaJson();
					} else {
						i++;
					}
				}
			} else {
				if (valor == this.rangos[i].valorMin) {
					return this.rangos[i].salidaJson();
				} else {
					i++;
				}
			}
		} while (i < this.rangos.length);

		return this.rangos[0].salidaDefault();
	}





	generaCuantiles(numDivisiones, arreglo, colores, leyenda, borde, grosor) {
		let longRango = Math.ceil(arreglo.length / numDivisiones);
		let cont1 = 0, cont2 = 1, div = 1;
		let simbologia = new simbologiaCapa();
		//console.log(longRango);

		arreglo.sort(function (a, b) {
			return a - b;
		});
		let valorMin = arreglo[0], valorMaximo = 0;

		for (let i = 1; i < arreglo.length; i++) {
			if (arreglo[i] != null) {
				if (cont2 < longRango || arreglo[i] == valorMin) {
					valorMaximo = arreglo[i];
					cont2++;
				} else {
					simbologia.agregaRango(0, Math.round(valorMin), Math.round(valorMaximo), colores[cont1], (leyenda + div), borde, grosor);
					cont2 = 1;
					valorMin = arreglo[i];
					valorMaximo = valorMin;
					cont1++;
					div++;
				}
			} else {

			}

		}

		simbologia.agregaRango(0, Math.round(valorMin), Math.round(valorMaximo), colores[cont1], (leyenda + div), borde, grosor);

		return simbologia;

	}

}//termina la clase

export default simbologiaCapa;