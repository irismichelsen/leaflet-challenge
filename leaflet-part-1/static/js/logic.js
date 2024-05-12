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

