var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var hbs = require('hbs');
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('break', function(data) {
	let i = data.indexOf("(");
	if (i < 0) {
		return new hbs.SafeString(data);
	}
	return new hbs.SafeString('<strong>' 
	+ data.substring(2,i)
	+ '</strong>'
	+ '<br/>' 
	+ data.substring(i,i+12) // Usually the phone number
	+ '<br/>' 
	+ data.substring(i + 12, data.length));
})

app.get('/', function (req, res) {
	res.redirect('/manassass/1');
});
app.get('/:place/:number', function (req, res) {
	let array = [];
	let number = req.params.number;
	let place = req.params.place;
	if (!place) place = "Manassas";
	if (!number) number = 1;
	let url = "https://www.yellowpages.com/search?search_terms=business&geo_location_terms=" + place + "%2C%20VA&page=" + number;
	request(url, function (error, response, html) {
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
	});
	
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});
