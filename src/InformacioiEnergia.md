---
title: Heatmap amb Leaflet
---

```js
// Load Maplibre CSS
const maplibreCSS = document.createElement("link");
maplibreCSS.rel = "stylesheet";
maplibreCSS.href = "https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.css";
document.head.appendChild(maplibreCSS);

// Load Maplibre JS
await import("https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.js");

// Create map container
const div = display(document.createElement("div"));
div.style.height = "80vh";

// Initialize Maplibre map
const map = new window.maplibregl.Map({
  container: div,
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // free demo style
  center: [2.1734, 41.3851], // [lng, lat]
  zoom: 2
});

map.on('style.load', () => {
    map.setProjection({
        type: 'globe',
    });
});

const pointsArray = [
  [3.1734, 42.3851, 0.5],
  [2.1734, 41.3851, 0.5],
  [2.17, 41.38, 0.8]
];

// Example GeoJSON data
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
      // Adjust these for your needs
      "heatmap-weight": ["get", "value"],
      "heatmap-intensity": 1,
      "heatmap-radius": 30,
      "heatmap-opacity": 0.8
    }
  });
});

// Return the map container for display
div

```

