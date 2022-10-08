Earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function earthQuakeMap() {

    var myMap= L.map("map", {
        center: [0, 0],
        zoom: 3,
        worldCopyJump: true
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 10,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    // Creating geojson layer
    d3.json(Earthquake_url, function (data) {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, markerStyle(feature));
            },

        // Pop-up for each feature
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h1>Magnitude: " + feature.properties.mag+ "</h1> <hr> <h2>" + feature.properties.place + "</h2>");
            }

        }).addTo(myMap);
    
    mapLegend(myMap);

    });        
    
};



function mapLegend(map) {

    colors = ["brown", "purple", "blue", "green", "orange", "red"];

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
                    categories = ['<1', '1 to <2', '2 to <3', '3 to <4', '4 to <5', '>5'],
                    labels = [];

        div.innerHTML += '<strong> Magnitude </strong> <br>'

        // Loop through intensity to generate label 
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
        ratius: 3*feature.properties.mag,
        weight: 2,
        Opacity: 1,
        color: markerColor(feature.properties.mag),
        fillOpacity: 0.8
    };
};



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