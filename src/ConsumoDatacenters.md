---
title: Consumo eléctrico de los data centers
---

# Consumo eléctrico de los data centers

En esta sección se presentan datos actualizados sobre el consumo eléctrico global de los data centers, destacando tendencias recientes y previsiones futuras tanto a nivel mundial como regional.

- La IEA estima que los data centers consumieron entre 240-340 TWh en 2022, lo que representa aproximadamente 1-1,3 % del consumo eléctrico final mundial. Esta cifra excluye la energía utilizada para la minería de criptomonedas, que se estimó en unos 110 TWh en 2022.
- Las redes de transmisión de datos (fijas y móviles) consumieron en conjunto unos 260-360 TWh en 2022, es decir, alrededor de 1-1,5 % del consumo global. 
- El conjunto del sector TIC (data centers + redes + dispositivos de usuario) se estima que representa alrededor del 4 % del consumo eléctrico mundial (excluyendo la energía incorporada en la fabricación) 
- En resumen: 
 - data centers: 1-1,3%
 - redes de comunicación: 1-1,5%
 - dispositivos locales (smartphones, ordenadores, etc.): 2-2,6%

```js
const consumption = FileAttachment("./data/consumptionTypeYear.json").json();
```

```js
// Gràfic apilat amb Plot
Plot.plot({
  width: 600,
  height: 300,
  y: { label: "TWh" },
  x: { label: "Year", tickFormat: d => d.toString() },
  color: {
    legend: true,
    scheme: "category10" // o pots definir els teus colors
  },
  marks: [
    Plot.areaY(consumption, {
      x: "year",
      y: "energy",
      fill: "type",
      order: "appearance",
      sort: { fill: "ascending" },
      curve: "catmull-rom",
      stack: true
    }),
    Plot.ruleY([0]) // línia de base
  ]
})
```


- IEA-4e (https://www.iea-4e.org/edna/tasks/energy-efficiency-of-data-centres/): Eficiencia energética de los data centers
 - Hasta la fecha, la mayoría de los esfuerzos políticos se han centrado en la energía utilizada para la refrigeración y la iluminación dentro de los centros de datos, así como en el uso de energías renovables y la exportación de calor residual. Desarrollar políticas para abordar el uso energético de las TIC es más difícil. Falta disponer de métricas adecuadas, faltan los datos necesarios para establecerlas, y el entorno de los centros de datos es muy complejo y altamente dinámico.

- EMBER (https://ember-energy.org/latest-insights/grids-for-data-centres-ambitious-grid-planning-can-win-europes-ai-race/grids-for-data-centres/): Europa se enfrenta a un aumento de la demanda eléctrica por parte de los centros de datos
 - Los centros de datos ya están teniendo un impacto en la demanda de electricidad en Europa, especialmente en los principales mercados. Se estima que los centros de datos europeos consumieron 96 TWh de electricidad en 2024, lo que equivale al 3% de la demanda total de electricidad de la región. Entre los principales mercados de centros de datos, esta cifra osciló entre el 2% de la demanda nacional de electricidad en Francia, el 4% en Alemania y el Reino Unido, hasta el 7% en los Países Bajos y el 19% en Irlanda. Su impacto localizado es aún más significativo. En 2023, los centros de datos consumieron entre el 33% y el 42% de toda la electricidad en Amsterdam, London y Frankfurt, y casi el 80% en Dublin.
 - Se espera que la demanda de electricidad de los centros de datos en Europa aumente hasta los 168 TWh en 2030 y los 236 TWh en 2035, lo que representa un incremento de casi el 150% en apenas diez años. Algunos mercados prevén un crecimiento enorme y rápido. En Suecia, Noruega y Dinamarca, se espera que el consumo eléctrico de los centros de datos se triplique ya para 2030. Se proyecta que esta tendencia continúe y se extienda a otros países en los siguientes cinco años, con previsiones de que Austria, Grecia, Finlandia, Hungría, Italia, Portugal y Eslovaquia vean aumentar el consumo de los centros de datos entre tres y cinco veces de aquí a 2035 en comparación con 2024.

 

- DOE (https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers): Informe del Lawrence Berkeley National Laboratory (https://escholarship.org/uc/item/32d6m0d1)
 - El informe concluye que en EE. UU. los centros de datos consumieron alrededor del 4,4 % de la electricidad total en 2023 y que se espera que consuman aproximadamente entre 6,7 y 12 % de la electricidad total en 2028. El informe indica que el uso total de electricidad de los centros de datos aumentó de 58 TWh en 2014 a 176 TWh en 2023 y estima un incremento hasta entre 325 y 580 TWh para 2028.

 


 
