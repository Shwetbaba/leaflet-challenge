// LEVEL II
// USGS GeoJSON = http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

Earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

Plate_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Function to create map
function earthQuakeMap() {
    
    // Create the tile layer that will be the background of our map
    var darkView = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,<a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 10,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var streetView = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,<a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 10,
        zoomOffset: -1,
        id: "streets-v11",
        accessToken: API_KEY
    });  
    
    var satelliteView = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,<a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 10,
        zoomOffset: -1,
        id: "satellite-v9",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        Street: streetView,
        Dark: darkView,
        Satellite: satelliteView
    };

    // Creating geoJson layer containing features array from plates data
    var platePloygons = new L.LayerGroup();

    d3.json(Plate_url, function (data) {
        L.geoJSON(data, {
            style: plateStyle

        }).addTo(platePloygons)
    });

    // Creating geoJson layer containing features array from earthquake data
    var earthquakes = new L.LayerGroup();

    d3.json(Earthquake_url, function (data) {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, markerStyle(feature));
            },

        // call pop-up for each feature
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h1>Magnitude: " + feature.properties.mag+ "</h1> <hr> <h2>" + feature.properties.place + "</h2>");
            }
        }).addTo(earthquakes);
    });

    // create overylay layer that can be toggled
    var overylayMaps = {
        "Tectonic Plates": platePloygons,
        Earthquakes: earthquakes
        };

        // Create map
        var earthQuakeMap = L.map("map", {
            center: [0, 0],
            zoom: 3,
            worldCopyJump: true,
            layers: [satelliteView, earthquakes, platePloygons]
        });

    // Pass map layers into layer control and add the layer control to the map
    L.control.layers(baseMaps, overylayMaps, {collapsed:false}).addTo(earthQuakeMap);
    
    // call legend function
    mapLegend(earthQuakeMap);

};

// Function for creating legend
function mapLegend (map) {
    colors = ["brown", "purple", "blue", "green", "orange", "red"];

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var categories = ['<1', '1 to <2', '2 to <3', '3 to <4', '4 to <5', '>5'];
        var labels = [];

        div.innerHTML += '<strong> Magnitude </strong> <br>'

        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
               '<i style="background:' + colors[i] + '"></i>' +
               categories[i] + '<br>';
        };
        return div;
    };
    legend.addTo(map);
};

function markerStyle(feature) {
    return{
        fillColor: markerColor(feature.properties.mag),
        ratius: getRadius(feature.properties.mag),
        weight: 2,
        Opacity: 1,
        color: markerColor(feature.properties.mag),
        fillOpacity: 0.8
    };
};

function plateStyle (feature) {
  return {
      fillColor: null,
      color: "grey",
      fillOpacity: 0
  };
};


function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }


function markerColor(magnitude) {
    if (magnitude<1) {
        return "springgreen"}
    else if (magnitude<2) {
        return "greenyellow"}
    else if (magnitude<3) {
        return "gold"}
    else if (magnitude < 4) {
        return "orange"}
    else if (magnitude < 5) {
        return "darkorange"}
    else if (magnitude >= 5) {
        return "orangered"}
    else {
        return "black"}    
    };

earthQuakeMap();