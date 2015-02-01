var requests = [];
var favorites = {};
var results = {};
var checkedLanguages = [];
var table;
var tableFavorites;

function startUp() {
    table = document.getElementById("results");
    tableFavorites = document.getElementById("favorites");
    favorites = JSON.parse(localStorage.getItem("favorites"));
    if(!favorites) {
        favorites = {};
    }
    else {
        generate_table("favorites", favorites);
    }
}

function HulkSmash() {
    
}

function searchOptions() {
    checkedLanguages = [];
    results = {};
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
        //thisRequest.open('GET', 'http://savvyg.me/CS_290/cs290-assignment3/Part%202/gists' + (i + 1) + '.json');
        thisRequest.open('GET', 'https://api.github.com/gists?page=' + (i + 1));
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
                    //console.log("it worked");
                    gists = JSON.parse(requests[k].req.response);
                    addRows(filterArray(gists), "results", results);
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
        if (checkedLanguages.indexOf(l) > -1 || checkedLanguages.length == 0) {
            //console.log(l);
            if (!favorites.hasOwnProperty(gists[k]['id'])) {
                newGists[gists[k]['id']] = {
                    description: gists[k].description,
                    url: gists[k].html_url
                };
            }
        }
    }
    return newGists;
}

function addRows(inArray, tableId, outArray) {
    //console.log(gists);
    var row;
    var id;
    for (id in inArray) {
        outArray[id] = inArray[id];
    }
    generate_table(tableId, outArray);

}

function favorite(gistId) {
    favorites[gistId] = results[gistId];
    delete results[gistId];
    generate_table("results", results);
    console.log(favorites);
    generate_table("favorites", favorites);
    saveFavorites();
}

function generate_table(tableId, data) {

    var tblBody = document.getElementById(tableId);
    //var tblBody = document.createElement("tbody");

    tblBody.innerHTML = "";
    console.log(data);
    for (var id in data) {
        var row = tblBody.insertRow();
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        cell1.innerHTML = ("<a href=" + data[id].url + ">" + id + " - " + data[id].description + "</a>");
        if (tableId == "results") {
            cell2.innerHTML = ("<button onclick=favorite('" + id + "')>Favorite</button>");
        }
        else if (tableId == "favorites") {
            cell2.innerHTML = ("<button onclick=deleteFavorite('" + id + "')>Remove</button>");
        }
        row.appendChild(cell1);
        row.appendChild(cell2);
    }
    if (row)
    {
        tblBody.appendChild(row);
    }
}

function deleteFavorite(gistId) {
    delete favorites[gistId];
    saveFavorites();
    generate_table("favorites", favorites);
}

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites))
}
