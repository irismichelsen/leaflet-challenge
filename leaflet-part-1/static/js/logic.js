// Store our API endpoint as queryUrl.
//let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
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

