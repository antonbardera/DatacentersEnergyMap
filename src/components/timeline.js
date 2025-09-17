import * as Plot from "npm:@observablehq/plot";

export function timeline(data, {width, height} = {}) {
  return Plot.plot({
    width,
    height: height || 160,
    marginTop: 30,
    x: {nice: true, label: "Año", tickFormat: ""},
    y: {grid: true, label: "Consumo de energía (TWh)"},
    marks: [
      Plot.ruleX([2025], {stroke: "black", strokeWidth: 1.5, strokeDasharray: "5,5"}),
      Plot.areaY(data, { x: "year", y: "energy_consumption", fill: "#482475", opacity: 0.6}),
      Plot.lineX(data, {x: "year", y: "energy_consumption", stroke:"#482475",strokeWidth: 1.5, curve: "catmull-rom", tip: true}),
      Plot.ruleY([0]),
    ]
  });
}
