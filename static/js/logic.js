// Create a map object.
let myMap = L.map("map", {
    center: [39.859, -106.304],
    zoom: 5
  });

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// save url link to a variable
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//request geojson data from the link above
d3.json(link).then(function(data) {
  //create bubble markers with variable colors and size
  function bubbles(feature) {
    return {
      radius: bSize(feature.properties.mag),
      fillColor: bColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.5,
      color: "black",
      opacity: 1,
      weight: 0.4
    };
  }
  //define bubble colors by earthquake severity: from green to red (red = severe)
  function bColor(depth) {
    switch (true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "orangered";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "gold";
      case depth > 10:
        return "yellow";
      default:
        return "lightgreen";
    };
  }
  //define bubble size by earthquake magnitude
  function bSize(mag) {
    if (mag === 0) {
      return 1
    }
    return mag * 4;
  }

  // Add earthquake data to the map
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: bubbles,
    // Activate pop-up data when circles are clicked
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
    }
  }).addTo(myMap);

  // Add the legend with colors to correlate with depth
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < depth.length; i++) {
  div.innerHTML +=
  '<i style="background:' + bColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
  };
  legend.addTo(myMap)
});
