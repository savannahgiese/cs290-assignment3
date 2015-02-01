var requests = [];
var favorites = [];
var checkedLanguages = [];

function searchOptions() {

    var tempLang = document.getElementsByClassName("language");
    var e = document.getElementById("pageCount");
    var pageCount = e.options[e.selectedIndex].value;

    for (var j = 0; j < tempLang.length; j++) {
        if (tempLang[j].checked) {
            checkedLanguages.push(tempLang[j].value);
        }
    }

    var thisRequest;
    for (var i = 0; i < pageCount; i++) {
        thisRequest = new XMLHttpRequest();
        requests.push({
            req: thisRequest,
            done: false
        });
        if (!thisRequest) {
            console.log(i + " didn't work :(");
            return false;
        }
        thisRequest.onreadystatechange = processAjax;
        thisRequest.open('GET', 'http://savvyg.me/CS_290/cs290-assignment3/Part%202/gists' + (i + 1) + '.json');
        //thisRequest.open('GET', 'https://api.github.com/gists?page=' + i);
        thisRequest.send();
    }

    //console.log("blah blah is" + checkedLanguages);
    //console.log("count is " + pageCount);
}

function processAjax() {
    var gists = [];
    for (var k = 0; k < requests.length; k++) {
        if (requests[k].done == false) {
            if (requests[k].req.readyState === 4) {
                if (requests[k].req.status === 200) {
                    console.log("it worked");
                    gists = JSON.parse(requests[k].req.response);
                    addRows(filterArray(gists));
                    requests[k].done = true;
                }
                else {
                    console.log('There was a problem with the request.');
                }
            }
        }
    }
}

function filterArray(gists) {
    var files;
    var l;
    var newGists = [];
    for (var k = 0; k < gists.length; k++) {
        files = gists[k].files;
        l = files[Object.keys(files)[0]].language;
        //console.log(l);
        if (checkedLanguages.indexOf(l) > -1) {
            console.log(l);
            if (favorites.indexOf(gists[k].url) < 0) {
                newGists.push(gists[k]);
            }
        }
    }
    return newGists;
}

function addRows(gists) {
    console.log(gists);
    var table = document.getElementById("results");
    var row;
    
    for (var i = 0; i < gists.length; i++) {
        row = table.insertRow();
        row.innerHTML = "<td><a href=" + gists[i].html_url + ">" + gists[i].id + " - " + gists[i].description + "</a></td><td>"+"<td>";
    }
}
