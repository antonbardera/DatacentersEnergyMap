import * as Plot from "npm:@observablehq/plot";

export function timeline(data, {width, height} = {}) {
  return Plot.plot({
    width,
    height: height || 160,
    marginTop: 30,
    x: {nice: true, label: null, tickFormat: ""},
    y: {grid: true, label: "Consumo de energía (TWh)"},
    marks: [
      Plot.ruleX([2025], {stroke: "black", strokeWidth: 1, strokeDasharray: "5,5"}),
      Plot.lineX(data, {x: "year", y: "energy_consumption", stroke:"#482475",strokeWidth: 1.5, curve: "catmull-rom"}),
      Plot.ruleY([0]),
      //Plot.text(data, {x: "year", y: "energy_consumption", text: "energy_consumption", lineAnchor: "bottom", dy: -10, lineWidth: 10, fontSize: 12})
    ]
  });
}
