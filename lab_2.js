
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var threat; // получение кол-ва угроз
var vulnerability=[]; // получение кол-ва уязвимостей на каждую угрозу
var mas=[]; // содержит перечисление всех угроз и уязвимостей

app.set('port',3000);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // использование js, css, картинок.

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'ejs');

app.get('/',function(req, res) {
	res.render("index");
})

app.post('/action', function(req, res) {
	
	var method = req.body['options']; // название метода
	var value= req.body['sentence']; // строка для шифрования
	var keyword_1 = req.body['keyword0'] || false; // ключево слово 1
	var keyword_2 = req.body['keyword1'] || false; // ключевое слово 2
	var dop_str="";	// содержит необходимое кол-во звездочек, которые надо добавить к предложению, чтобы его длина стала кратна 5
	var result="";

	// Если длина шифруемого слова не кратна 5, то добавляем необходимое кол-во *
	if (value.length % 5 != 0) {
		value += Array(6-value.length % 5).join("*"); 

	}

	switch(method) {
		
		case "magic": 
			break;

		case "single":
			result = singlePermulation(value, keyword_1);
			console.log("Результат: " + result);
			break;

		case "twice":
			result = twicePermulation(value, keyword_1, keyword_2);
			console.log("Результат: " + result);
			break;
	}

	res.render("result", {
		method: method,
		value: value
	});	

})

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});

/* 

Функции шифрования

*/

// Одиночная перестановка
function singlePermulation(value, keyword) {
	var result = "";
	var matr = [];
	var help_mas=[];
	var help_matr=[];
	var k = 0;
	var n = 0;

	if (keyword) {
		help_mas.push(keyword[0]);
	}

	for (var i=0; i<value.length; i++) {
		if (k > 4) {
			matr.push(help_mas);
			n++;
			help_mas = [];
			k=0;
			if (keyword) {
				help_mas.push(keyword[n]);	
			}
		}
		help_mas.push(value[i]);
		k++;
	}	
	

	console.log("Искомая матрица: \n");
	matr.push(help_mas);
	console.log(matr);
	console.log("\n");

	//Сортируем массив
	matr.sort();
	console.log("Отсортированная матрица: \n");
	console.log(matr);
	console.log("\n");

	var length = (keyword) ? 6 : 5;

	for (var i= (keyword) ? 1 : 0; i< length; i++) {
		for (var j=0; j<matr.length ; j++)
			result += matr[j][i];
	}  

	return result;
}

// Двойная перестановка
function twicePermulation(value, keyword1, keyword2) {
	var result = "";
	var matr = [];
	var help_mas=[];
	var help_matr=[];
	var k = 0;
	var n = 0;
	var help_str="";

	if (keyword1) {
		help_mas.push(keyword1[0]);
	}

	for (var i=0; i<value.length; i++) {
		if (k > 4) {
			matr.push(help_mas);
			n++;
			help_mas = [];
			k=0;
			if (keyword1) {
				help_mas.push(keyword1[n]);	
			}
		}
		help_mas.push(value[i]);
		k++;
	}		
	matr.push(help_mas);

	console.log("Искомая матрица: \n");
	console.log(matr);
	console.log("\n");
	
	//Сортируем массив
	matr.sort();
	console.log("Отсортированная матрица по строкам: \n");
	console.log(matr);
	console.log("\n");

	if (keyword1) {
		for (var i=0; i<matr.length; i++) {
			matr[i].splice(0,1);
		}	

		console.log("Отсортированная матрица по строкам без ключевого слова: \n");
		console.log(matr);
		console.log("\n");
		
	}
	
	help_mas = [];

	// Добавляем ключевое слово в каждый столбец
	if (keyword2) {
		for (var j=0; j<5; j++) {
			help_mas.push(keyword2[j]);
		}
		matr.unshift(help_mas);

		console.log("Матрица с ключевым словом по столбцам: \n");
		console.log(matr);
		console.log("\n");
	
	}
	
	// Копируем матрицу для дальнейшей ее сортировки
	for (var i=0; i<matr.length; i++) {
		help_matr.push(matr[i].slice());	
	}

	// Сортируем столбцы
	help_matr[0].sort();
	
	k=0;
			
	for (var i=0; i< 5; i++) {
		k = matr[0].indexOf(help_matr[0][i]);
		for (var j=1; j<matr.length ;j++) {
			help_matr[j][i] = matr[j][k];
		}
		delete matr[0][k];		
	}

	console.log("Отсортированная матрица по столбцам: \n");
	console.log(help_matr);
	console.log("\n");

	for (var i=0; i< 5; i++) {
		for (var j=0; j<help_matr.length ;j++)
			result += help_matr[j][i];
	}  

	return result;
	console.log(result);
}