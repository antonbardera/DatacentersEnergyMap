---
theme: dashboard
title: Mapa
---

# Datacenters energy consumption map


```js
const sheetId = "1TwbP_WPGH-jvvzMBZOx5LQnCknCJUH7sBkjQ1eYnDrA";
const gid = "0"; // número de full, normalment 0 pel primer
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

const energyData = await fetch(url)
  .then(res => res.text())
  .then(text => {
    // La resposta ve amb "garbage" al principi i final, cal netejar-la
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    // extreiem les files
    const rows = json.table.rows;
    const headers = json.table.cols.map(c => c ? c.label : ""); // primera fila = capçaleres

    // convertim la resta de files a objectes
    const data = rows.map(r => {
      const obj = {};
      r.c.forEach((cell, i) => {
        obj[headers[i]] = cell ? cell.v : null;
      });
      return obj;
    });

    const maxPower = Math.max(...data.map(d=>d.power));
    const normdata = data.map(d => ({
      ...d,
      norm_power : 2.0 * d.power / maxPower
    }))
    return normdata;
  });
  //console.log(energyData);
```


```js
// Load Maplibre CSS
const maplibreCSS = document.createElement("link");
maplibreCSS.rel = "stylesheet";
maplibreCSS.href = "https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.css";
document.head.appendChild(maplibreCSS);

// Load Maplibre JS
await import("https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.js");
```


```js

// Create map container
const div = display(document.createElement("div"));
div.style.height = "80vh";

const map = new window.maplibregl.Map({
  container: div,
  style: {
    version: 8,
    sources: {
      cartoLight: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
          'contributors &copy; <a href="https://www.carto.com/">CARTO</a>'
      }
    },
    layers: [
      {
        id: "carto-light",
        type: "raster",
        source: "cartoLight",
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  center: [2.1734, 41.3851], // [lng, lat]
  zoom: 2
});


/*const pointsArray = [
  [3.1734, 42.3851, 0.5],
  [2.1734, 41.3851, 0.5],
  [2.17, 41.38, 0.8]
];*/

//console.log(energyData);

//console.log(energyData.map((d) => ([+d.lng, +d.lat, +d.norm_power])));
/*    layers: [
      {
        id: "osm-layer",
        type: "raster",
        source: "osm",
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: "heatmap-layer",
        type: "heatmap",
        source: "points",
        maxzoom: 8, // només visible a zoom baixos
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "value"], 0, 0, 20, 1],
          "heatmap-intensity": 1,
          "heatmap-radius": 25,
          "heatmap-opacity": 0.8
        }
      },
      {
        id: "circle-layer",
        type: "circle",
        source: "points",
        minzoom: 8, // només visible a zoom alts
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["get", "value"], 0, 4, 20, 12],
          "circle-color": "blue",
          "circle-opacity": 0.6,
          "circle-stroke-color": "white",
          "circle-stroke-width": 1
        }
      }
    ]
  },*/


// Example GeoJSON data
const geojson = {
  type: "FeatureCollection",
  features: energyData.map((d) => ([+d.lat, +d.lng, +d.norm_power, +d.power])).map(([lat,lng,value, power]) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { value, power }
  })
  )
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
    maxzoom: 8, // només visible a zoom baixos
    paint: {
      // Adjust these for your needs
      "heatmap-color": [ //Viridis colorscale
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(68,1,84,0)",   // transparent
        0.1, "#482475",         // violeta-blavós
        0.2, "#414487",         // morat fosc
        0.4, "#2a788e",         // blau
        0.6, "#22a884",         // verd
        0.8, "#7ad151",         // verd
        1.0, "#fde725"          // groc
      ],
      "heatmap-weight": ["get", "value"],
      "heatmap-intensity": 1,
      "heatmap-radius": 50,
      "heatmap-opacity": 0.8
    }
  });

  map.addLayer({
    id: "circle-layer",
    type: "circle",
    source: "points",
    minzoom: 6, // només visible a zoom alts
    paint: {
      "circle-radius": 5,//["interpolate", ["linear"], ["get", "value"], 0, 4, 20, 12],
      "circle-color": "#482475",
      "circle-opacity": 0.6,
      "circle-stroke-color": "white",
      "circle-stroke-width": 1
    }
  });
});

// Crea el popup però sense mostrar-lo encara
const popup = new window.maplibregl.Popup({
  closeButton: false,
  closeOnClick: false
});

// Quan el ratolí passa per sobre un cercle
map.on("mousemove", "circle-layer", (e) => {
  map.getCanvas().style.cursor = "pointer"; // canvia el cursor

  // Agafem la primera feature
  const feature = e.features[0];

  // Contingut del tooltip (pots personalitzar-ho)
  const html = `
    <strong>Power:</strong> ${feature.properties.power} KW<br>
  `;

  // Mostrem el popup
  popup
    .setLngLat(e.lngLat)
    .setHTML(html)
    .addTo(map);
});

// Quan el ratolí surt del cercle
map.on("mouseleave", "circle-layer", () => {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

// Return the map container for display
div
```


