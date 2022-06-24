//Array com as informações
var data = [];
var date =[];

(function(){
    
  // Inicia o firebase Firebase
  var config = {
    apiKey: "AIzaSyBuT9pG6FeP1NZrCqKshrBgnIi2opLL1dc",
    authDomain: "controle-de-umidade-do-s-feba1.firebaseapp.com",
    databaseURL: "https://controle-de-umidade-do-s-feba1-default-rtdb.firebaseio.com",
    projectId: "controle-de-umidade-do-s-feba1",
    storageBucket: "controle-de-umidade-do-s-feba1.appspot.com",
    messagingSenderId: "561517772377",
    appId: "1:561517772377:web:88b07827344fda561cfb48",
    measurementId: "G-YLNL036P1N"
  };
  firebase.initializeApp(config);

  var db = firebase.database();

  // Cria os listeners dos dados no firebase
  var umidRef = db.ref('dados');

  // Registra as funções que atualizam os gráficos e dados atuais
  umidRef.on('value', onNewData('currentUmid', 'umidLineChart' , 'Umidade', '%'));

})();

//Formatar Data
function adicionaZero(numero){
  if (numero <= 9) 
      return "0" + numero;
  else
      return numero; 
}

// Retorna uma função que de acordo com as mudanças dos dados
// Atualiza o valor atual do elemento, com a metrica passada 
// e monta o gráfico com os dados e descrição do tipo de dados
function onNewData(currentValueEl, chartEl, label, metric){
  return function(snapshot){
    var readings = snapshot.val();
    if(readings){
        var currentData;
        var currentValue;
        var currentDate;
        for(var key in readings){
          currentData = readings[key];
          currentData = currentData.split(";");
          currentDate = new Date(currentData[0] * 1000);
          currentDate = (currentDate.getHours() + "h - " + adicionaZero(currentDate.getDate().toString()) + "/" + (adicionaZero(currentDate.getMonth()+1).toString()));
          currentValue = currentData[1];
          data.push(currentValue);
          date.push(currentDate);
        }
        document.getElementById(currentValueEl).innerText = currentValue + ' ' + metric;
        document.getElementById("currentDate").innerText = 'Medição realizada em:\n'+ currentDate;
        buildLineChart(chartEl, label, data, date);
    }
  }
}

// Constroi um gráfico de linha no elemento com a descrição e os dados passados
function buildLineChart(el, label, data, date){
  var elNode = document.getElementById(el);
  new Chart(elNode, {
    type: 'line',
    data: {
        labels: date,
        datasets: [{
            label: "",
            data: data,
            borderWidth: 1,
            fill: false,
            spanGaps: false,
            lineTension: 0.1,
            backgroundColor: "#013d04",
            borderColor: "#013d04"
        }]
    }
  });
}

//Gerar pdf
function gerarPdf(){
  let tamanho = data.length;
  let janela = window.open('', '','width=800,heigth=600');
  janela.document.write('<html><head><title>Relatório</title></head>');
  janela.document.write('<body>=================');
  janela.document.write('<table><tr><td>Data e Hora - </td><td>Umidade</td></tr></table>');
  janela.document.write('=================<table>');
  for(let i=0; i<tamanho; i++){
    janela.document.write('<tr><td>');
    janela.document.write(date[i], ' =>');
    janela.document.write('</td><td>');
    janela.document.write(data[i],'%');
    janela.document.write('</td></tr>');
  }
  janela.document.write('</table></body></html>');
  janela.document.close();
  janela.print();
}

//Chama função quando o botão é clicado
botao2.addEventListener("onclick", gerarPdf)

