alert('Welcome to the Tacoma Public Restroom Routing Survey! Tap the middle button on the left and then tap again at the location of the restroom you\'re reporting to open a survey where you can provide details on the restroom for the future benefit of yourself and others when it comes to locating a restroom that suits one\'s needs.')

var map = L.map('map', {
  maxBounds : [[47.45396776157878, -122.63860441671564], [47.09334144436703, -122.29401946898379]],
  minZoom : 12
}).setView([47.2528769, -122.4442906], 12);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t5MHp1NHNoMDY3dDJ3cGRtNXdraDFiaSJ9.GS7A10SiyfuUiKee_X5N_A'
}).addTo(map);

//Initializes the layer into which features are drawn
var drawnItems = L.featureGroup().addTo(map);

var cartoData = L.layerGroup().addTo(map);
// change the url below by replacing YourUsername with your Carto username
var url = "https://lafishergis.carto.com/api/v2/sql";
var urlGeoJSON = url + "?format=GeoJSON&q=";
// change the Query below by replacing lab_7_name with your table name
var sqlQuery = "SELECT * FROM lafisher_l7_restrooms";

function addPopup(feature, layer) {
    layer.bindPopup(
        "<b>" + 'Restroom Type: ' + feature.properties.restroomtype + "</b><br>" +
        'Restroom Gender: ' + feature.properties.gendersurveyed + "</b><br>" +
        'Price in $: ' + feature.properties.entryprice + "</b><br>" +
        'Out of Order: ' + feature.properties.outoforder + "</b><br>" +
        'Toilet Count: ' + feature.properties.toiletcount + "</b><br>" +
        'Sinks: ' + feature.properties.sinks + "</b><br>" +
        'Urinals: ' + feature.properties.urinals + "</b><br>" +
        'Diaper Change: ' + feature.properties.diaperchangestation + "</b><br>" +
        'Showers: ' + feature.properties.showers + "</b><br>" +
        'ADA Compliance: ' + feature.properties.ada + "</b><br>" +
        'Relevant Damage: ' + feature.properties.damages + "</b><br>" +
        'Relevant Messes: ' + feature.properties.messes + "</b><br>" +
        'Relevant Shortages: ' + feature.properties.supplyshortages + "</b><br>" +
        'Last Updated: ' + feature.properties.updatedate
    );
}

fetch(urlGeoJSON + sqlQuery)
    .then(function(response) {
    return response.json();
    })
    .then(function(data) {
        L.geoJSON(data, {onEachFeature: addPopup}).addTo(cartoData);
    });

//Defines the rules for what can be drawn
new L.Control.Draw({
    draw : {
        polygon : false,
        polyline : false,
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

//Defines rules for spawning the popup from a created feature
function createFormPopup() {
  var popupContent =
      '<form>' +
        '<h3>Restroom Characteristics</h3><br>' +
        '<label for="restCat">Type of restroom structure:</label><br>' +
                  '<select id="restCat" name="restCat">' +
                     '<option value="unknown">Unknown</option>' +
                     '<option value="portable">Port-O-John</option>' +
                     '<option value="latrine">Latrine or outhouse</option>' +
                     '<option value="building">Permanent structure with indoor plumbing</option>' +
                  '</select><br>' +
        '<label for="genderCat">Gender accessibility of restroom surveyed:</label><br>' +
                  '<select id="genderCat" name="genderCat">' +
                      '<option value="unknown">Unknown</option>' +
                      '<option value="allGender">All genders</option>' +
                      '<option value="women">Women</option>' +
                      '<option value="men">Men</option>' +
                  '</select><br>' +
        'Price of Admission (USD): ' + '<input type="number" id="price"><br>' +
        '<label for="outCat">Is the restroom out of order?:</label><br>' +
                  '<select id="outCat" name="outCat">' +
                      '<option value="unknown">Unknown</option>' +
                      '<option value="no">No</option>' +
                      '<option value="yes">Yes</option>' +
                  '</select><br>' +
        'Number of Toilets/Urinals: ' + '<input type="number" id="noToilets"><br>' +
        '<label for="sinkCat">Does the bathroom have sinks?:</label><br>' +
                  '<select id="sinkCat" name="sinkCat">' +
                      '<option value="unknown">Unknown</option>' +
                      '<option value="no">No</option>' +
                      '<option value="yes">Yes</option>' +
                  '</select><br>' +
        '<label for="uriCat">Does the bathroom have urinals?:</label><br>' +
                  '<select id="uriCat" name="uriCat">' +
                      '<option value="unknown">Unknown</option>' +
                      '<option value="no">No</option>' +
                      '<option value="yes">Yes</option>' +
                  '</select><br>' +
        '<label for="diaCat">Does the bathroom have diaper change stations?:</label><br>' +
                  '<select id="diaCat" name="diaCat">' +
                    '<option value="unknown">Unknown</option>' +
                    '<option value="no">No</option>' +
                    '<option value="yes">Yes</option>' +
                  '</select><br>' +
        '<label for="shoCat">Does the bathroom have showers?:</label><br>' +
                  '<select id="shoCat" name="shoCat">' +
                    '<option value="unknown">Unknown</option>' +
                    '<option value="no">No</option>' +
                    '<option value="yes">Yes</option>' +
                  '</select><br>' +
        '<label for="adaCat">Does the bathroom have showers?:</label><br>' +
                  '<select id="adaCat" name="adaCat">' +
                    '<option value="unknown">Unknown</option>' +
                    '<option value="no">No</option>' +
                    '<option value="yes">Yes</option>' +
                  '</select><br>' +
        'Items in Need of Repair: ' + '<input type="text" name="damage" id="damage"><br>' +
        'Items in Need of Cleaning: ' + '<input type="text" name="mess" id="mess"><br>' +
        'Items in Need of Restocking: ' + '<input type="text" name="shortage" id="shortage"><br>' +
        'Date Updated: ' + '<input type="date" name="date" id="date"><br>' +
        '<input type="button" value="Submit" id="submit">' +
      '</form>'
    drawnItems.bindPopup(popupContent, {maxHeight: 650, minWidth:400}).openPopup();
}

//Spawns data entry popup when a feature is drawn.
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});


//Prints inputted data into console after turning it into variables
function setData(e) {
    if(e.target && e.target.id == "submit") {
      //I have no idea why, but the extra function call and console.log lines are the only thing that can make the full list actually get printed.
        var restroomType = document.getElementById('restCat').value;
        var gender = document.getElementById('genderCat').value;
        var entryPrice = document.getElementById("price").value;
        var outOfOrder = document.getElementById("outCat").value;
        var noToilets = document.getElementById("noToilets").value;
        var sinks = document.getElementById("sinkCat").value;
        var urinals = document.getElementById("uriCat").value;
        var diaperChange = document.getElementById("diaCat").value;
        var showers = document.getElementById("shoCat").value;
        var americanDA = document.getElementById("adaCat").value;
        var damages = document.getElementById("damage").value;
        var messes = document.getElementById("mess").value;
        var shortages = document.getElementById("shortage").value;
        var upDate = document.getElementById("date").value;
        // For each drawn layer
        drawnItems.eachLayer(function(layer) {

    			// Create SQL expression to insert layer
                var drawing = JSON.stringify(layer.toGeoJSON().geometry);
                var sql =
                    "INSERT INTO lafisher_l7_restrooms (the_geom, restroomtype, gendersurveyed, entryprice, outoforder, toiletcount, sinks, urinals, diaperchangestation, showers, ada, damages, messes, supplyshortages, updatedate) " +
                    "VALUES (ST_SetSRID(ST_GeomFromGeoJSON('" +
                    drawing + "'), 4326), '" +
                    restroomType + "', '" +
                    gender + "', '" +
                    entryPrice + "', '" +
                    outOfOrder + "', '" +
                    noToilets + "', '" +
                    sinks + "', '" +
                    urinals + "', '" +
                    diaperChange + "', '" +
                    showers + "', '" +
                    americanDA + "', '" +
                    damages + "', '" +
                    messes + "', '" +
                    shortages + "', '" +
                    upDate + "')";
                console.log(sql);

                // Send the data
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "q=" + encodeURI(sql)
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    console.log("Data saved:", data);
                })
                .catch(function(error) {
                    console.log("Problem saving the data:", error);
                });

            // Transfer submitted drawing to the CARTO layer
            //so it persists on the map without you having to refresh the page
            var newData = layer.toGeoJSON();
            newData.properties.restroomType = restroomType;
            newData.properties.gender = gender;
            newData.properties.entryPrice = entryPrice;
            newData.properties.outOfOrder = outOfOrder;
            newData.properties.noToilets = noToilets;
            newData.properties.sinks = sinks;
            newData.properties.urinals = urinals;
            newData.properties.diaperChange = diaperChange;
            newData.properties.showers = showers;
            newData.properties.americanDA = americanDA;
            newData.properties.damages = damages;
            newData.properties.messes = messes;
            newData.properties.shortages = shortages;
            newData.properties.upDate = upDate;
            L.geoJSON(newData, {onEachFeature: addPopup}).addTo(cartoData);

        });
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
    }
}

//renders the submit button functional
document.addEventListener("click", setData);

//Ensures that the popup will only be present when geometry is not being modified or deleted
map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});
