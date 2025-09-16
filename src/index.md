---
title: Mapa energético de los Data Centers
toc: false
---

<div class="hero">
  <h1>Mapa energético de los Data Centers</h1>
<!--   <h2>Dashboard del Consumo Energético de los Data centers</h2>
 --></div>

<!-- <div class="grid grid-cols-2" style="grid-auto-rows: 504px;">
  <div class="card">${
    resize((width) => Plot.plot({
      title: "Your awesomeness over time 🚀",
      subtitle: "Up and to the right!",
      width,
      y: {grid: true, label: "Awesomeness"},
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(aapl, {x: "Date", y: "Close", tip: true})
      ]
    }))
  }</div>
  <div class="card">${
    resize((width) => Plot.plot({
      title: "How big are penguins, anyway? 🐧",
      width,
      grid: true,
      x: {label: "Body mass (g)"},
      y: {label: "Flipper length (mm)"},
      color: {legend: true},
      marks: [
        Plot.linearRegressionY(penguins, {x: "body_mass_g", y: "flipper_length_mm", stroke: "species"}),
        Plot.dot(penguins, {x: "body_mass_g", y: "flipper_length_mm", stroke: "species", tip: true})
      ]
    }))
  }</div>
</div>
 -->
---

- **El rápido crecimiento de los servicios en la nube, el big data y, en particular, la inteligencia artificial (IA), está disparando la demanda eléctrica de los data centers.** La Agencia Internacional de la Energía (IEA) alerta de que este consumo representa ya una fracción significativa del total mundial y **podría duplicarse o triplicarse en la próxima década**.
- Aunque la **Directiva Europea de Eficiencia Energética** (2023) obliga a los data centers (de 500 kW como mínimo) a reportar indicadores energéticos, **los datos disponibles siguen fragmentados y poco transparentes**. Este trabajo recopila información de distintas fuentes internacionales (IEA, DataCenterMap, EMBER, Ericsson, Department of Energy, Comisión Europea) para **estimar el consumo de los data centers y visualizar los resultados mediante un dashboard interactivo desarrollado con MapLibre, Observable Framework y Plot**. 
- Aunque el propósito último de esta comunicación es la elaboración de un dashboard del consumo energético de los data centers, enmarcamos este problema desde una perspectiva más amplia. Para ello, se introducen algunos principios de **física de la información**, se examinan las principales **causas del consumo energético en los data centers** y la importancia de estos y de las **redes de transmisión de datos**, así como los requerimientos específicos que plantea la **inteligencia artificial** en el procesamiento masivo de información. Puntualmente, también se plantea la cuestión de qué escenarios energéticos pueden esperarse en el **futuro**.


Las principales **fuentes de datos** que hemos utilizado son 

- International Energy Agency (IEA): https://www.iea.org/
- Datacente.rs world map: https://datacente.rs/
- DataCenterMap: https://www.datacentermap.com/
- EMBER: https://ember-energy.org/
- U.S. Department of Energy (DOE): https://www.energy.gov/
- European Comission: https://energy.ec.europa.eu/



<!-- ## Next steps

Here are some ideas of things you could try…
 -->
<!-- <div class="grid grid-cols-4">
  <div class="card">
    Chart your own data using <a href="https://observablehq.com/framework/lib/plot"><code>Plot</code></a> and <a href="https://observablehq.com/framework/files"><code>FileAttachment</code></a>. Make it responsive using <a href="https://observablehq.com/framework/javascript#resize(render)"><code>resize</code></a>.
  </div>
  <div class="card">
    Create a <a href="https://observablehq.com/framework/project-structure">new page</a> by adding a Markdown file (<code>whatever.md</code>) to the <code>src</code> folder.
  </div>
  <div class="card">
    Add a drop-down menu using <a href="https://observablehq.com/framework/inputs/select"><code>Inputs.select</code></a> and use it to filter the data shown in a chart.
  </div>
  <div class="card">
    Write a <a href="https://observablehq.com/framework/loaders">data loader</a> that queries a local database or API, generating a data snapshot on build.
  </div>
  <div class="card">
    Import a <a href="https://observablehq.com/framework/imports">recommended library</a> from npm, such as <a href="https://observablehq.com/framework/lib/leaflet">Leaflet</a>, <a href="https://observablehq.com/framework/lib/dot">GraphViz</a>, <a href="https://observablehq.com/framework/lib/tex">TeX</a>, or <a href="https://observablehq.com/framework/lib/duckdb">DuckDB</a>.
  </div>
  <div class="card">
    Ask for help, or share your work or ideas, on our <a href="https://github.com/observablehq/framework/discussions">GitHub discussions</a>.
  </div>
  <div class="card">
    Visit <a href="https://github.com/observablehq/framework">Framework on GitHub</a> and give us a star. Or file an issue if you’ve found a bug!
  </div>
</div>
 -->
<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
