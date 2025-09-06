---
theme: dashboard
title: Mapa
---

# Datacenters energy consumption map


```js
import * as L from "npm:leaflet";
import {heatLayer} from "leaflet.heat";
```

```js
const sheetId = "1TwbP_WPGH-jvvzMBZOx5LQnCknCJUH7sBkjQ1eYnDrA";
const gid = "0"; // número de full, normalment 0 pel primer
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

const energyData = fetch(url)
  .then(res => res.text())
  .then(text => {
    // La resposta ve amb "garbage" al principi i final, cal netejar-la
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    // extreiem les files
    const rows = json.table.rows;
    const headers = json.table.cols.map(c => c ? c.label : ""); // primera fila = capçaleres
    //console.log(headers);

    // convertim la resta de files a objectes
    const data = rows.map(r => {
      const obj = {};
      r.c.forEach((cell, i) => {
        obj[headers[i]] = cell ? cell.v : null;
      });
      return obj;
    });

    //console.log(data); // 👉 array d'objectes amb les capçaleres com a propietats
    return data;
  });
```


```js
import "npm:leaflet.heat";

const div = display(document.createElement("div"));
div.style = "height: 80vh";

const map = L.map(div)
  .setView([51.505, -0.09], 3);

/*L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})*/
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
})
  .addTo(map);

// Afegim un layer amb cercles
energyData.forEach(p => {
  L.circleMarker([p.lat, p.lng], {
    radius: p.power,    // el valor controla la mida
    color: "blue",
    fillColor: "blue",
    fillOpacity: 0.4
  }).bindPopup(`Valor: ${p.value} MW`).addTo(map);
});

/*
// Exemple de punts [lat, lng, intensitat opcional]
const heatData = [
  [41.3851, 2.1734, 0.5],
  [41.38, 2.17, 0.8],
  [41.39, 2.18, 0.2],
  [41.387, 2.176, 1.0]
];

// Afegim el heatmap
L.heatLayer(heatData, {
  radius: 25,   // mida de cada punt
  blur: 15,     // suavitzat
  maxZoom: 17
}).addTo(map);
//console.log(energyData);
//let energyLayer = heatLayer(energyData).addTo(map);*/
```
```js
//heatLayer = (L, require('leaflet.heat').catch(() => L.heatLayer))
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
