let cuerpo = { etiqFunc: "C10ETARMUN_", columnas: ["C10ETARMUN_004", "C10ETARMUN_005", "C10ETARMUN_006"], filtro: "C10ETARMUN_001='12001'" }

var req = new XMLHttpRequest();

req.open("POST", "http://172.16.117.11/wa0/cons_catalogada", true);
//req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
req.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');


req.onreadystatechange = function () {
  if (req.readyState == 4 && req.status == 200) {
    //aqui obtienes la respuesta de tu peticion
    alert(req.responseText);
  }
}
req.send('parametros=' + JSON.stringify(cuerpo));