function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // store geoJSON
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// perform a GET request to the query URL
d3.json(link).then((data) => {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features);
});

function createMap(earthquakes) {
    // assign the different mapbox styles
    const satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    const grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    const outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });

    const baseMap = {
        'Satellite': satellite,
        'Grayscale': grayscale,
        'Outdoors': outdoors
    };

    const overlayMap = {
        Earthquakes: earthquakes
    };

    const myMap = L.map('map', {
        center: [36.7126875, -120.476189],
        zoom: 4,
        layers: [outdoors, earthquakes]
    });

    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    // function to assign colors for legend and markers
    function getColor(d) {
        return d > 5 ? '#f06b6b' :
            d > 4 ? '#f0936b' :
            d > 3 ? '#f3ba4e' :
            d > 2 ? '#f3db4c' :
            d > 1 ? '#e1f34c' :
                    '#b7f34d';
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap) {
        const div = L.DomUtil.create('div', 'info legend')
        const magnitudes = [0, 1, 2, 3, 4, 5]
        const labels = []

        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div
    };
    legend.addTo(myMap);

}

function createFeatures(eqdata) {
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Date: ' + new Date(feature.properties.time) + '</h4><h4>Magnitude: ' + feature.properties.mag + '</h4><h4>USGS Event Page: <a href=' + feature.properties.url + " target='_blank'>Click here</a></h4>", {maxWidth: 400})
    }

    const layerToMap = L.geoJSON(eqdata, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let radius = feature.properties.mag * 4.5;

            if (feature.properties.mag > 5) {
                fillcolor = '#f06b6b';
            }
            else if (feature.properties.mag >= 4) {
                fillcolor = '#f0936b';
            }
            else if (feature.properties.mag >= 3) {
                fillcolor = '#f3ba4e';
            }
            else if (feature.properties.mag >= 2) {
                fillcolor = '#f3db4c';
            }
            else if (feature.properties.mag >= 1) {
                fillcolor = '#e1f34c';
            }
            else  fillcolor = '#b7f34d';

            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 1,
                weight: 1
            });
        }
    });
    createMap(layerToMap);
}