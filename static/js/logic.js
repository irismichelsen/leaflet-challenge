// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// Define a structure to use for the color gradient and depths
let depthColorBins = [
  {
    color: "#a7ef07",
    maxDepth: 2,
    label: "-10-2"
  },
  {
    color: "#e1f915",
    maxDepth: 10,
    label: "2-5"
  },
  {
    color: "#f5db06",
    maxDepth: 30,
    label: "5-10"
  },
  {
    color: "#f19206",
    maxDepth: 60,
    label: "10-30"
  },
  {
    color: "#f35044",
    maxDepth: 90,
    label: "30-60"
  },
  {
    color: "#b8170c",
    maxDepth: 1000,
    label: "100+"
  },
];

// GeoJSON format is a standard format for location information
// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
    
 // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

// Create a function to determine color based on value passed in
// There are 10 different colors and 
function getMarkerColor(value)
{

  // Initialize color to max depth
  let color = depthColorBins[5].color;

  //console.log(value, depthColorBins.length);

  // Now check value passed to get correct color
  for (let i=0; i < depthColorBins.length; i++) 
  {
    if (value < depthColorBins[i].maxDepth)
    {
      color = depthColorBins[i].color;
      // Exit the loop because we have a match
      break;
    }
  }

  // if all else fails (haha), return last color
  console.log(color);
  return color;
};

// Create the earthquake features to map
function createFeatures(earthquakeData) 
{
  // Create a marker for each earthquake in the data
  console.log(earthquakeData);

  // Inialize the array to hold earthquake markers
  let earthquakeMarkers = [];

  // Just want to get a feel for depth
  let maxDepth = 0;
  let minDepth = 0;

  for (let i=0; i < earthquakeData.length; i++) 
  {
    let earthquake = earthquakeData[i];

    // Set the marker size based on magnitude
    let markerRadius = earthquake.properties.mag * 10000;

    // Set the maker color based on depth, which is the 3rd entry in coordinates
    //console.log("Depth: ", earthquake.geometry.coordinates[2]);
    let depth = earthquake.geometry.coordinates[2];
    if (depth > maxDepth) {
      maxDepth = depth;
    }
    else if (depth < minDepth)
    {
      minDepth = depth;
    }

    //console.log(colorScale);
    let markerColor = getMarkerColor(depth);
    //console.log(markerColor);
    
    let earthquakeMarker = 
      L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],
        {
          color: "black",
          weight: 0.50,
          fillColor: markerColor,
          fillOpacity: 0.75,
          radius: markerRadius
        })
      .bindPopup(`<h3>${earthquake.properties.place}</h3>
      <hr><p>Magnitude: ${earthquake.properties.mag}</p>
      <hr><p>Depth: ${earthquake.geometry.coordinates[2]}</p>
      <hr><p>${new Date(earthquake.properties.time)}</p>`);

    // Add the marker to the bikeMarkers array;
    earthquakeMarkers.push(earthquakeMarker)
  }

  console.log ("Max depth: ", maxDepth, "Min depth: ", minDepth );

  // Pass the earthquake data to a createMap() function.
  createMap(L.layerGroup(earthquakeMarkers));
}

// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlays object.
  let overlayMaps = {
    "Earthquake events": earthquakes
  };

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend.
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend'),
        labels = [];

    // Title the legend
    let legendTitle = "<h3>Depth (meters)</h3>"
    // Generate a label with a colored square for each item
    for (let i = 0; i < depthColorBins.length; i++) {
        labels.push(
            '<i style="background:' + depthColorBins[i].color + ';width:18px;height:18px;float:left;margin-right:8px;"></i> ' +
            depthColorBins[i].label);
    }

    div.innerHTML = legendTitle + labels.join('<br>');
    return div;
};

  legend.addTo(myMap);
 
};