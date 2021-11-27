// URL for all earthquakes, past 30 days 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; 

// Create map.
 var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

// Create the base layers.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Perform a GET request to the URL
d3.json(url).then(function (data) {
  console.log(data);

  function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 0.8,
    fillColor: Markercolor(feature.geometry.coordinates[2]),
    color: "#000000",
    radius: Markersize(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };

}
  // Function to determine marker color
  function Markercolor(depth) {
    var color = ""

    if (depth > -10 && depth < 10) {
      color = "#ffffb2";
    }
    else if (depth >= 10 && depth <30) {
      color = "#fecc5c";
    }
    else if (depth >= 30 && depth <50) {
      color = "#fd8d3c";
    }
    else if (depth >= 50 && depth < 70) {
      color = "#f03b20";
    }
    else {
      color = "#bd0026";
    }
    return color
  }
    
  // Function to determine marker size

  function Markersize(mag) {
    return mag * 1.5;
  } 



  // Create markers

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },

    // Marker style & popup
    style: styleInfo,
    onEachFeature: function(feature,layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
}).addTo(myMap);

// Create legend 

var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70],
        labels = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20","#bd0026"];

        div.innerHTML += '<b>Earthquake Depth (km)</b><br>' 

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + labels[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
  

});