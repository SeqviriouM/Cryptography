
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

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
	var action = req.body['actions']; // необходимое действие(шифрование/дешифрование)
	var keyword = req.body['keyword0'] || false; // ключево слово 1
	var result="";

	if (method !== "caesar" && method !== "pleifera") {
		var help_keyword = keyword;
		var length1 = Math.floor((value.length - keyword.length) / keyword.length);
		var length2 = value.length % keyword.length;

		for (var i=0; i<length1; i++) {
			keyword += help_keyword;
		}

		for (var j=0; j<length2; j++) {
			keyword += help_keyword[j];
		}
	}

	console.log("Исходное слово/\предложение: ");
	console.log(value);
	console.log("\n");

	console.log("Ключевое слово: ");
	console.log(keyword);
	console.log("\n");

	switch(method) {
		case "caesar":
			if (action === "encryption") {
				result = Caesar(value, keyword);
				console.log("Результат: " + result);
			} else if (action === "decryption") {
				result = deCaesar(value, keyword);
				console.log("Результат: " + result);
			} else {
				console.log("Вы забыли выбрать что надо сделать)");
			}
			break;
		
		case "gronsfeld":
			if (action === "encryption") {
				result = Gronsfeld(value, keyword);
				console.log("Результат: " + result);
			} else if (action === "decryption") {
				result = deGronsfeld(value, keyword);
				console.log("Результат: " + result);
			} else {
				console.log("Вы забыли выбрать что надо сделать)");
			}
			break;
		
		case "gamma":
			if (action === "encryption") {
				result = Gamma(value, keyword);
				console.log("Результат: " + result);
			} else if (action === "decryption") {
				result = deGamma(value, keyword);
				console.log("Результат: " + result);
			} else {
				console.log("Вы забыли выбрать что надо сделать)");
			}
			break;

			case "pleifera":
			if (action === "encryption") {
				result = Pleifera(value, keyword);
				console.log("Результат: " + result);
			} else if (action === "decryption") {
				result = dePleifera(value, keyword);
				console.log("Результат: " + result);
			} else {
				console.log("Вы забыли выбрать что надо сделать)");
			}
			break;
	}
	
	res.render("result", {
		result: result,
		value: value
	});	

})

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});

/*

Шифрование и Расшиврование

*/

// Шифр Цезаря
function Caesar(value, keyword) {
	var result = "";

	// преобразуем строку в число
	keyword *= 1;

	for (var i=0; i < value.length; i++) {
		result += String.fromCharCode(value.charCodeAt(i)*1 + keyword);
	}

	return result;
}

// Расшифровка шифра Цезаря
function deCaesar(value, keyword) {
	var result = "";

	// преобразуем строку в число
	keyword *= 1;

	for (var i=0; i < value.length; i++) {
		result += String.fromCharCode(value.charCodeAt(i)*1 - keyword);
	}

	return result;
}

// Шифр Грондсфельда
function Gronsfeld(value, keyword) {
	var result = "";

	for (var i=0; i < value.length; i++) {
		result += String.fromCharCode(value.charCodeAt(i)*1 + keyword[i]*1);
	}

	return result;

}

// Расшифровка шифра Гронсфельда
function deGronsfeld(value, keyword) {
	var result = "";

	for (var i=0; i < value.length; i++) {
		result += String.fromCharCode(value.charCodeAt(i)*1 - keyword[i]*1);
	}

	return result;

}

// Шифр Гаммирования
function Gamma(value, keyword) {
	var result = "";

	for (var i=0; i < value.length; i++) {
		result += String.fromCharCode((value.charCodeAt(i)*1 ^ keyword.charCodeAt(i)));
	}

	return result;
}

// Расшифровка Гаммирования
function deGamma(value, keyword) {
	var result = "";

	for (var i=0; i < value.length; i++) {
		result += String.fromCharCode(value.charCodeAt(i)*1 ^ keyword.charCodeAt(i));
	}

	return result;
}

// Шифр Плейфера(при вызове его для зашифрованного слова происходит его расшифровка)
function Pleifera(value, keyword) {
	var keyword_matr = [];
	var help_mas = [];
	var alphabet = "abcdefghiklmnopqrstuvwxyz";
	var result = "";
	var help_str = "";
	var k = 0;
	var n = 0;
	var l = 0;

	// Генерация алфавитного квадрата 5*5
	for (var i=0; i<25; i++) {
		if (k > 4) {
			keyword_matr.push(help_mas);
			help_mas = [];
			k=0;
			l++;
		}

		if (i < keyword.length) {
			help_mas.push(keyword[i]);
			keyword_matr[keyword[i]] = {};
			keyword_matr[keyword[i]].i = l;
			keyword_matr[keyword[i]].j = k;
		} else {
			while (keyword.indexOf(alphabet[n]) !== -1) {
				n++;
			}
			help_mas.push(alphabet[n]);
			keyword_matr[alphabet[n]] = {};
			keyword_matr[alphabet[n]].i = l;
			keyword_matr[alphabet[n]].j = k;
			n++;
		}

		k++;
		
	}
	keyword_matr.push(help_mas);

	// Проверка на четность длины шифруемого слова. Если длина нечетная, то добавляем в конец символ A
	if (value.length % 2 !== 0) {
		value += 'a';
	}

	k=0;
	n=0;

	// Разделение строки на биграммы (сочетания по 2 буквы) и выполнение преобразования	
	for (var i=0; i < value.length/2; i++) {
		 help_str = value.substr(k,2);
		 k += 2;

		 console.log("Рассматриваемая биграмма: ");
		 console.log(help_str);
		 console.log("\n");

		 // Если две буквы лежат в одной строке, то сдвигаем каждую букву на столбец вправо
		 if (keyword_matr[help_str[0]].i === keyword_matr[help_str[1]].i)
		 {
		 		result += keyword_matr[keyword_matr[help_str[0]].i][(++keyword_matr[help_str[0]].j)%5];
		 		result += keyword_matr[keyword_matr[help_str[1]].i][(++keyword_matr[help_str[1]].j)%5];
		 		continue;
		 }
		 
		 // Если две буквы лежат в одном столбце, то сдвигаем каждую букву на столбец вниз
		 if (keyword_matr[help_str[0]].j === keyword_matr[help_str[1]].j)
		 {
		 		result += keyword_matr[(++keyword_matr[help_str[0]].i)%5][keyword_matr[help_str[0]].j];
		 		result += keyword_matr[(++keyword_matr[help_str[1]].i)%5][keyword_matr[help_str[1]].j];
		 		continue;
		 }

		 // Если две буквы лежат в разных строках и столбцах, то берем буквы из углов прямоугольника, образованного рассматриваемыми буквами
		 result += keyword_matr[keyword_matr[help_str[1]].i][keyword_matr[help_str[0]].j];
		 result += keyword_matr[keyword_matr[help_str[0]].i][keyword_matr[help_str[1]].j];
		 
	}

	return result;
}
