---
title: Heatmap amb Leaflet
---

```js
import * as L from "npm:leaflet";

const mapDiv = display(document.createElement("div"));
mapDiv.style = "height: 80vh";

const map = L.map(mapDiv).setView([41.3851, 2.1734], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Array de punts amb lat, lng i un valor
const points = [
  { lat: 41.3851, lng: 2.1734, value: 10 },
  { lat: 41.39,   lng: 2.18,   value: 20 },
  { lat: 41.38,   lng: 2.17,   value: 5  }
];

// Afegim un layer amb cercles
points.forEach(p => {
  L.circleMarker([p.lat, p.lng], {
    radius: p.value,    // el valor controla la mida
    color: "blue",
    fillColor: "blue",
    fillOpacity: 0.4
  }).bindPopup(`Valor: ${p.value}`).addTo(map);
});

```