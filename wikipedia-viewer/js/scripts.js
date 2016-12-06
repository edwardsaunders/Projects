//Configuration variables

var live = false;
var useProxy = true;
// Global variables

var searchStr;
var resultsToShow = 30;
var currentPage;


// API URLS
//const corsProxy = "http://cors.io/?";
const corsProxy = "http://whateverorigin.org/get?url=";
const baseURL = "https://en.wikipedia.org/w/api.php";
const wikiBaseURL = "https://en.wikipedia.org/wiki/";

// Test Response (for testing)
const testResponse = {
	"batchcomplete": "",
	"continue": {
		"sroffset": 10,
		"continue": "-||"
	},
	"query": {
		"searchinfo": {
			"totalhits": 210518
		},
		"search": [{
			"ns": 0,
			"title": "Test",
			"snippet": "<span class=\"searchmatch\">Test</span>, <span class=\"searchmatch\">TEST</span> or Tester may refer to: <span class=\"searchmatch\">Test</span> (assessment), an assessment intended to measure the respondents' knowledge or other abilities Medical <span class=\"searchmatch\">test</span>, to",
			"size": 2916,
			"wordcount": 350,
			"timestamp": "2016-08-21T07:47:08Z"
		}, {
			"ns": 0,
			"title": "Test automation",
			"snippet": "See also: Manual <span class=\"searchmatch\">testing</span> In software <span class=\"searchmatch\">testing</span>, <span class=\"searchmatch\">test</span> automation is the use of special software (separate from the software being <span class=\"searchmatch\">tested</span>) to control the execution",
			"size": 20620,
			"wordcount": 2388,
			"timestamp": "2016-12-01T20:49:10Z"
		}, {
			"ns": 0,
			"title": "Test (assessment)",
			"snippet": "(disambiguation).                A <span class=\"searchmatch\">test</span> or examination (informally, exam) is an assessment intended to measure a <span class=\"searchmatch\">test</span>-taker's knowledge, skill, aptitude",
			"size": 44043,
			"wordcount": 5422,
			"timestamp": "2016-11-29T13:29:18Z"
		}, {
			"ns": 0,
			"title": "Test card",
			"snippet": "A <span class=\"searchmatch\">test</span> card, also known as a <span class=\"searchmatch\">test</span> pattern or start-up/closedown <span class=\"searchmatch\">test</span> is a television <span class=\"searchmatch\">test</span> signal, typically broadcast at times when the transmitter is",
			"size": 10866,
			"wordcount": 1323,
			"timestamp": "2016-08-02T20:52:20Z"
		}, {
			"ns": 0,
			"title": "Pregnancy test",
			"snippet": "pregnancy <span class=\"searchmatch\">test</span> attempts to determine whether a woman is pregnant. Markers that indicate pregnancy are found in urine and blood, and pregnancy <span class=\"searchmatch\">tests</span> require",
			"size": 19869,
			"wordcount": 2353,
			"timestamp": "2016-11-11T22:01:54Z"
		}, {
			"ns": 0,
			"title": "Student's t-test",
			"snippet": "A t-<span class=\"searchmatch\">test</span> is any statistical hypothesis <span class=\"searchmatch\">test</span> in which the <span class=\"searchmatch\">test</span> statistic follows a Student's t-distribution under the null hypothesis. It can be used to",
			"size": 35642,
			"wordcount": 4676,
			"timestamp": "2016-12-02T09:06:29Z"
		}, {
			"ns": 0,
			"title": "Test cricket",
			"snippet": "<span class=\"searchmatch\">Test</span> cricket is the longest form of the sport of cricket and is considered its highest standard. <span class=\"searchmatch\">Test</span> matches are played between national representative",
			"size": 35339,
			"wordcount": 3559,
			"timestamp": "2016-12-02T12:31:59Z"
		}, {
			"ns": 0,
			"title": "Coombs test",
			"snippet": "A Coombs <span class=\"searchmatch\">test</span> (also known as Coombs' <span class=\"searchmatch\">test</span>, antiglobulin <span class=\"searchmatch\">test</span> or AGT) is either of two clinical blood <span class=\"searchmatch\">tests</span> used in immunohematology and immunology. The",
			"size": 12877,
			"wordcount": 1565,
			"timestamp": "2016-12-04T01:53:56Z"
		}, {
			"ns": 0,
			"title": "Turing test",
			"snippet": "For other uses, see Turing <span class=\"searchmatch\">test</span> (disambiguation).      The Turing <span class=\"searchmatch\">test</span> is a <span class=\"searchmatch\">test</span>, developed by Alan Turing in 1950, of a machine's ability to exhibit",
			"size": 85877,
			"wordcount": 10742,
			"timestamp": "2016-12-01T03:48:48Z"
		}, {
			"ns": 0,
			"title": "Mantoux test",
			"snippet": "The Mantoux <span class=\"searchmatch\">test</span> or Mendel-Mantoux <span class=\"searchmatch\">test</span> (also known as the Mantoux screening <span class=\"searchmatch\">test</span>, tuberculin sensitivity <span class=\"searchmatch\">test</span>, Pirquet <span class=\"searchmatch\">test</span>, or PPD <span class=\"searchmatch\">test</span> for purified",
			"size": 15870,
			"wordcount": 1975,
			"timestamp": "2016-11-30T02:40:17Z"
		}]
	}
};

//Configuration function to change resultsPerPage - not implemented
function setResultsToShow(n){
  resultsToShow = n;
}

//Function to add paraneters to URL as using CORS proxy causes problems form ajax's data parameter.
function addParam(base, param) {
	var retStr = base;
	var keys = Object.keys(param);
	for (var i = 0; i < keys.length; i++) {
		if (i === 0) {
			retStr += '?';
		} else {
			retStr += '&';
		}
		retStr += keys[i] + '=' + param[keys[i]];
	}
	console.log(retStr);
	return retStr;
}
// Function makes srsearch call to API and returns results as JSON
function searchWikipedia(srchStr, pageToShow) {
	currentPage = pageToShow;
	searchString = srchStr;
	var url = (useProxy?corsProxy+baseURL:baseURL);
	$.ajax({
		url: addParam(url, {
			action: 'query',
			list: 'search',
			utf8: 1,
			format: 'json',
			srsearch: searchString,
			srlimit: resultsToShow,
			sroffset: resultsToShow * (pageToShow - 1)
		}),
		type: 'get',
		dataType: 'JSON',
		success: function(response, status, json) {
			console.log('ajax success');
			parseResponse(response, status, json);
		},
		error: function(xhr) {
			if (live === true) {
				window.alert('failed');
			} else {
				console.log('function hit');
				parseResponse(testResponse, '', '');
			}
		},
		timeout: 3000
	})
}

function parseResponse(response, status, json) {
	var results = response.query.search;
	var hits = response.query.searchinfo.totalhits;
	clearResults();
	clearGoToPage();
	displayResults(results, hits);
}
// Test function and placeholder for converting results to html
function testSearch(results) {
	for (var i = 0; i < results.length; i++) {
		result = results[i];
		document.append('<h>' + result.title + '</h>');
		document.append('<p>' + result.snippet + '</p>');
	}
}

// Add a single results to html

function newResult(title, content, index) {
  $("#results-container").append("<li id='result-"+index+"' class='search-result  result'><h class='result-title  result'>"+title+"</h><p class='result-body result'>"+content+"...</p><a class='result-link result'>Link</a></li>");
	}

function clearResults() {
	$('#results-container').empty();
}

function clearGoToPage(){
	$('#page-index').empty();
}

function displayResults(results, hits) {
	for (var i = 0; i < results.length; i++) {
		result = results[i];
		newResult(result.title, result.snippet, i);
	}
	console.log('hello');
	for (var i = 1; i < Math.max(11,2+(hits%resultsToShow)); i++) {
		$('#page-index').append("<li class='horizontal-list'><button id='go-to-page" + i + "' class='go-to-page' onclick='goToPage("+i+")'>" + i + "</button></li>");
	}
	$('#go-to-page'+currentPage).addClass('current-page');
	$('#go-to-page'+currentPage).attr('disabled', true);
}

function goToPage	(pageNumber) {
	searchWikipedia(searchStr, pageNumber);
}

$("#search-button").autocomplete({
    source: function(request, response) {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});

// Function to attach to searchbutton
function searchButton(){
	searchWikipedia($('#search-value').val(),1);
};
