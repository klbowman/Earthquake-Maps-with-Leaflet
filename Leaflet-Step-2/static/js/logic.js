// URL for all earthquakes, past 30 days 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; 

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

}

 // Create markers, define markers as variable

var earthquakeMarkers = L.geoJSON( data, {
  style: styleInfo,
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`)
  }
});


// URL for plate tectonic boundaries
var boundaries_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"; 

// Retrieve plate boundary data from url

d3.json(boundaries_url).then(function(data) {
  var boundaries = L.geoJson(data, {
    color: "yellow",
    weight: 2
  })


    // Create the base layers.
// MAP LAYERS

// Satellite layer
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

// Grayscale layer
var grayscale = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});



// Topographic
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


// Create map, add tile layers and marker layer 
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [earthquakeMarkers, boundaries, googleSat]
});

// Create a baseMaps object
var baseMaps = {
  "Sattelite": googleSat,
  "Grayscale": grayscale,
  "Terrain": topo
};

// Create an overlay object for earthquake markers and plate boundaries
var overlayMaps = {
  Earthquakes: earthquakeMarkers,
  Tectonics: boundaries
}


// Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
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
});