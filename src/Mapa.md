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

// Create map container
const div = display(document.createElement("div"));
div.style.height = "80vh";

// Initialize Maplibre map
/*const map = new window.maplibregl.Map({
  container: div,
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // free demo style
  center: [2.1734, 41.3851], // [lng, lat]
  zoom: 2
});*/

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
  features: energyData.map((d) => ([+d.lat, +d.lng, +d.norm_power])).map(([lat,lng,value]) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { value }
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
      "heatmap-radius": 70,
      "heatmap-opacity": 0.8
    }
  });
});

// Return the map container for display
div
```


### Sputnik 1 (1957)

This was the first artificial satellite. Launched by the Soviet Union, it marked the beginning of the space age.

### Apollo 11 (1969)

The historic Apollo 11 mission, led by NASA, marked the first successful human landing on the Moon. Astronauts Neil Armstrong and Buzz Aldrin became the first humans to set foot on the lunar surface.

### Viking 1 and 2 (1975)

NASA’s Viking program successfully launched two spacecraft, Viking 1 and Viking 2, to Mars. These missions were the first to successfully land and operate on the Martian surface, conducting experiments to search for signs of life.

### Space Shuttle Columbia (1981)

The first orbital space shuttle mission, STS-1, launched the Space Shuttle Columbia on April 12, 1981. The shuttle program revolutionized space travel, providing a reusable spacecraft for a variety of missions.

### Hubble Space Telescope (1990)

The Hubble Space Telescope has provided unparalleled images and data, revolutionizing our understanding of the universe and contributing to countless astronomical discoveries.

### International Space Station (ISS) construction (1998—2011)

The ISS, a collaborative effort involving multiple space agencies, began construction with the launch of its first module, Zarya, in 1998. Over the following years, various modules were added, making the ISS a symbol of international cooperation in space exploration.

## Commercial spaceflight

After the Space Shuttle program, a new era emerged with a shift towards commercial spaceflight.

Private companies like Blue Origin, founded by Jeff Bezos in 2000, and SpaceX, founded by Elon Musk in 2002, entered the scene. These companies focused on developing reusable rocket technologies, significantly reducing launch costs.

SpaceX, in particular, achieved milestones like the first privately developed spacecraft to reach orbit (Dragon in 2010) and the first privately funded spacecraft to dock with the ISS (Dragon in 2012).

## Recent launch activity

The proliferation of commercial space companies has driven a surge in global launch activity within the last few years.

SpaceX’s Falcon 9 and Falcon Heavy, along with other vehicles from companies like Rocket Lab, have become workhorses for deploying satellites, conducting scientific missions, and ferrying crew to the ISS.

The advent of small satellite constellations, such as Starlink by SpaceX, has further fueled this increase in launches. The push for lunar exploration has added momentum to launch activities, with initiatives like NASA’s Artemis program and plans for crewed missions to the Moon and Mars.

## Looking forward

As technology continues to advance and global interest in space exploration grows, the future promises even more exciting developments in the realm of rocket launches and space travel.

Exploration will not only be limited to the Moon or Mars, but extend to other parts of our solar system such as Jupiter and Saturn’s moons, and beyond.
