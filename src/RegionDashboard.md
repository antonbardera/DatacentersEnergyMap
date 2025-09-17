---
theme: dashboard
title: Mapa
---

# Análisis por regiones

```js
const consumptionRegion = FileAttachment("./data/consumptionRegionYear.json").json();
```
```js
import {timeline} from "./components/timeline.js";
```

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
import * as Inputs from "@observablehq/inputs"
const selectedRegion = view(Inputs.select(new Map([
    ["Europa","EUR"], 
    ["Asia-Pacifico","ASP"], 
    ["Norte America","NAM"],
    ["Centro y Sud America","CSA"], 
    ["Africa","AFR"], 
    ["Oriente Medio","MID"]
    ]), 
  {
    label: "Escoje la región:",
    value: "EUR"
  }
))
```

```js
  const regionViews = {
    EUR: { center: [10, 50], zoom: 0.6 },
    ASP: { center: [100, 0], zoom: 1 },
    NAM: { center: [-100, 40], zoom: 0.8 },
    CSA: { center: [-70, 0], zoom: 1 },
    AFR: { center: [20, 0], zoom: 1 },
    MID: { center: [50, 40], zoom: 1 },
  };
  const view = regionViews[selectedRegion];
  if (view) {
    map.flyTo({
      center: view.center,
      zoom: view.zoom,
      speed: 0.8,     // animació suau
      curve: 1.2
    });
  }

  const accum_power = energyData.filter(d=>d.region === selectedRegion).reduce((acc, d) => acc + d.power, 0);
  const num_datacenters = energyData.filter(d=>d.region === selectedRegion).length;
  const cons_future = consumptionRegion.find(d=>d.region === selectedRegion && d.year === 2030);
  const cons_now = consumptionRegion.find(d=>d.region === selectedRegion && d.year === 2025);
  const increase = 100.0*(cons_future.energy_consumption - cons_now.energy_consumption)/cons_now.energy_consumption;
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
const mapdiv = display(document.createElement("div"));
mapdiv.style.height = "45vh";
```

```js
const map = new window.maplibregl.Map({
  container: mapdiv,
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

map.on('style.load', () => {
    map.setProjection({
        type: 'globe',
    });
});

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
      "heatmap-radius": 30,
      "heatmap-opacity": 0.8
    }
  });
});
```

<div class="grid grid-cols-4">
  <div class="card grid-colspan-2 grid-rowspan-2" style="margin:0px;padding:0px;overflow:hidden">
    ${mapdiv}
  </div>
  
  <div class="card">
     ${resize((width) => timeline(consumptionRegion.filter(d=> d.region === selectedRegion),{width}))}
     <span class="nota">Según el informe de la IEA</span>
  </div>
  <div class="card">
    <div class="numbercontainer">
      <span class="bignumber">+${increase.toFixed(0)}</span>
      <span class="units">%</span><br/>
      <span class="secondarytext"> consumo energético de los data centers de la región en los próximos 5 años</span>
    </div>
  </div>
  <div class="card">
    <div class="numbercontainer">
      <span class="bignumber">${(accum_power/1000).toFixed(1)}</span>
      <span class="units">MW</span><br/>
      <span class="secondarytext">de potencia contratada en los data centers de nuestra base de datos</span>
    </div>
  </div>
  <div class="card">
    <div class="numbercontainer">
      <span class="bignumber">${num_datacenters}</span>
      <span class="units"></span>data centers<br/>
      <span class="secondarytext">en nuestra base de datos</span>
    </div>
  </div>
</div>


<style>

/* Aplica a tot el document */
/* body {
  font-family: 'Helvetica Neue', 'Inter', 'Segoe UI', Arial, sans-serif;
} */

/* Estil pel <select> */
select {
  appearance: none;            /* amaga l’estil nadiu del navegador */
  background-color: #f9fafb;   /* gris clar modern */
  border: 1px solid #d1d5db;   /* gris suau */
  border-radius: 0.5rem;       /* cantonades arrodonides */
  padding: 0.5rem 2rem 0.5rem 0.75rem; /* espaiat còmode */
  font-size: 1rem;
  color: #111827;              /* text gris fosc */
  font-family: 'Helvetica Neue', 'Inter', 'Segoe UI', Arial, sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.5;
  margin-left:5px;
}

/* Icona de desplegable (personalitzada amb gradient) */
/*select {
  background-image: linear-gradient(45deg, transparent 50%, #6b7280 50%),
                    linear-gradient(135deg, #6b7280 50%, transparent 50%);
  background-position: right 0.75rem top 50%, right 0.5rem top 50%;
  background-size: 0.6rem 0.6rem;
  background-repeat: no-repeat;
}*/

/* Hover */
select:hover {
  border-color: #9ca3af;
  background-color: #f3f4f6;
}

/* Focus (quan fas clic) */
select:focus {
  outline: none;
  border-color: #482475;       /* blau/violeta modern */
  box-shadow: 0 0 0 3px #c7d2fe;
}

.card{
  font-family: 'Helvetica Neue', 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size:12px;
  color:"blue";
}

.nota{
  font-family: 'Helvetica Neue', 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size:10px;
  color:"gray";
}

.numbercontainer{
  padding:10px;
  padding-left: 30px
}

.bignumber{
  font-family: 'Helvetica Neue', 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size:60px;
  color:#482475;
}

.units{
  font-family: 'Helvetica Neue', 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size:18px;
  color:"gray";
}
.nota{
  font-family: 'Helvetica Neue', 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size:10px;
  color:"gray";
}
</style>

