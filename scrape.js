var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var hbs = require('hbs');
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('break', function(data)) {

}

app.get('/', function (req, res) {
	let array = [];
	request('https://www.yellowpages.com/search?search_terms=business&geo_location_terms=Manassas%2C%20VA', function (error, response, html) {
	if (!error && response.statusCode == 200) {
		var $ = cheerio.load(html);
		$('div.info').each(function (i, element) {
			if ($(this).text().includes("Website") === false) {
				array.push($(this).text());
			}
		});
	}
	res.render('index', {
		list: array
	});
	console.log(array);
	});
	
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});
