var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var hbs = require('hbs');
var path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('break', function(data) {
	let i = data.indexOf("(");
	if (i < 0) {
		return new hbs.SafeString(data);
	}
	let pattern = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
	//console.log(pattern.exec(data));
	//console.log(data);
	console.log(pattern.exec(data));
	if (pattern.test(data) === true) {
		number = pattern.exec(data);
	} else {
		number = data.substring(i, i+14);
	}

	return new hbs.SafeString('<strong>'
	+ data.substring(4,i)
	+ '</strong>'
	+ '<br/>'
	+ '<span class="number">'
	+ number //data.substring(i,i+12) // Usually the phone number
	+ '</span>'
	+ '<br/>'
	+ data.substring(i + 14, data.length));
})

app.get('/', function (req, res) {
	res.redirect('/manassass/3');
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

app.post('/city', (req, res) => {
	let city = req.body.city;
	let page = req.body.page;
	res.redirect(`${city}/${page}`);
});

app.listen(port, function() {
	console.log("Listening on port 3000");
});
