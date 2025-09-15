---
theme: dashboard
title: Consum d'energia en els DataCenters
toc: false
---

```js
import maplibregl from "npm:maplibre-gl";

// Create map container
const div = display(document.createElement("div"));
div.style.height = "80vh";

// Initialize Maplibre map
const map = new maplibregl.Map({
  container: div,
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [2.1734, 41.3851],
  zoom: 10
});

// Example array data
const pointsArray = [
  [2.1734, 41.3851, 0.5],
  [2.17, 41.38, 0.8]
];

// Convert array to GeoJSON
const geojson = {
  type: "FeatureCollection",
  features: pointsArray.map(([lng, lat, value]) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { value }
  }))
};

map.on("load", () => {
  map.addSource("points", {
    type: "geojson",
    data: geojson
  });

  map.addLayer({
    id: "heatmap-layer",
    type: "heatmap",
    source: "points",
    paint: {
      "heatmap-weight": ["get", "value"],
      "heatmap-intensity": 1,
      "heatmap-radius": 30,
      "heatmap-opacity": 0.8
    }
  });
});

div
```


