

class RangoSimb {

	constructor(tipo, Min, Max, color, leyenda) {
		this.valorMin = Min;
		this.valorMax = Max;
		this.tipo = tipo; //tipo=0 el rango es  para valores unicos  tipo = 1  se utiliza min y maximo
		this.leyenda = leyenda;
		this.colorFill = color;
		this.colorBorde = '#000000';
		this.anchoBorde = 1;
		this.fillOpacity = 0.7;
	}

	filaHtml() {
		return `<tr><td>${this.valorMin}</td><td>${this.valorMax}</td><td><input value='${this.leyenda}'/></td><td style="background-color: ${this.colorFill}">${this.colorFill}</td></tr>`;
	}

	filaHtml1() {
		return `<tr><td>${this.valorMin}</td><td>${this.valorMax}</td><td>${this.leyenda}</td><td style="background-color: ${this.colorFill}">${this.colorFill}</td></tr>`;
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

	tablahtml(aux) {
		//aux == 0 manda tabla sin edicion aux ==1 manda tabla para edicion a
		let salida = `<table class="table table-bordered"><tr><th>Minimo</th><th>Maximo</th><th>Leyenda</th><th>Color</th><tr>`;
		if (aux == 0) {
			for (let i = 0; i < this.rangos.length; i++) {
				salida += this.rangos[i].filaHtml1();
			}
			salida += `</table>`;
			return salida;
		} else {
			for (let i = 0; i < this.rangos.length; i++) {
				salida += this.rangos[i].filaHtml();
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





	generaCuantiles(numDivisiones, arreglo, colores, leyenda) {
		let longRango = Math.ceil(arreglo.length / numDivisiones);
		let cont1 = 0, cont2 = 1, div = 1;
		let simbologia = new simbologiaCapa();

		arreglo.sort(function (a, b) {
			return a - b;
		});
		let valorMin = arreglo[0], valorMaximo = 0;

		for (let i = 1; i < arreglo.length; i++) {
			if (cont2 < longRango || arreglo[i] == valorMin) {
				valorMaximo = arreglo[i];
				cont2++;
			} else {
				simbologia.agregaRango(0, valorMin, valorMaximo, colores[cont1], (leyenda + div));
				cont2 = 1;
				valorMin = arreglo[i];
				valorMaximo = valorMin;
				cont1++;
				div++;
			}
		}

		simbologia.agregaRango(0, valorMin, valorMaximo, colores[cont1], (leyenda + div));

		return simbologia;

	}

}//termina la clase

export default simbologiaCapa;