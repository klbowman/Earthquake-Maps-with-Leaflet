// URL for all earthquakes, past 30 days 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; 


// MAP LAYERS

// Satellite layer
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});



  // Grayscale layer
var grayscale = L.tileLayer('https://maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png', {
attribution: '&copy; 2021 &middot; <a href="https://maps.omniscale.com/">Omniscale</a> ' +
'&middot; Map data: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

  // Topographic
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


// Create a baseMaps object
var baseMaps = {
  "Satellite": googleSat,
  "Grayscale": grayscale,
  "Outdoors": topo
};

// Create layer groups

// let earthquakes = new L.LayerGroup();
// let boundaries = new L.LayerGroup();

// Define overlays 
var overlayMaps = {
  Earthquakes: earthquakes,
  Tectonic_Plates: boundaries,
};

// Create map
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [googleSat, grayscale, topo]
});

// Create a layer control, pass in baseMaps and overlayMaps, add layer control to map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
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

  var earthquakes = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },

    // Marker style & popup
    style: styleInfo,
    onEachFeature: function(feature,layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    // add earthquake markers to earthquakes layer instaed of map
}).addTo(myMap);









// URL for plate tectonic boundaries
var boundaries_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"; 

// Retrieve data from url

d3.json(boundaries_url).then(function(data) {
  var boundaries = L.geoJson(data, {
    color: "yellow",
    weight: 2
  }).addTo(myMap);
});


// Create legend 

var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70],
        labels = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20","#bd0026"];

        div.innerHTML += '<b>Earthquake Depth</b><br>' 

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