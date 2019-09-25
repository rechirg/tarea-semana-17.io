
var EarthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


var TectonicPlatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(EarthquakeLink, function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag +
                "</h3><hr><h4>Date & Time: " + new Date(feature.properties.time) + "</h4>");
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.properties.mag),
                    fillOpacity: .7,
                    stroke: true,
                    color: "black",
                    weight: .5
                })
        }      
    });
    createMap(earthquakes)
}

function createMap(earthquakes) {

    var streetsatellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-satellite",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var contrastmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.high-contrast",
        accessToken: API_KEY
    });

    var piratesmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.pirates",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Satelite Map": streetsatellitemap,
        "Dark Map": darkmap,
        "High Contrast": contrastmap,
        "Pirates Map": piratesmap
    };

    var tectonicPlates = new L.LayerGroup();

    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    var myMap = L.map("map", {

        center: [30,0],
        zoom: 2,
        layers: [streetsatellitemap, earthquakes, tectonicPlates]
    });


    
    d3.json(TectonicPlatesLink, function (plateData) {
    
        L.geoJson(plateData, {
            color: "red",
            weight: 3.5
        })
        .addTo(tectonicPlates);
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        grades.forEach((value, index) => {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[index] + 1) + '"></i> ' +
            grades[index] + (grades[index + 1] ? '&ndash;' + grades[index + 1] + '<br>' : '+');
        })
        return div;
    };

    legend.addTo(myMap);
}

function getColor(d) {
    return d > 5 ? '#F30' :
            d > 4 ? '#F60' :
            d > 3 ? '#F90' :
            d > 2 ? '#FC0' :
            d > 1 ? '#FF0' :
                    '#9F3';
}

function getRadius(value) {
    return value * 40000
}
