var map = L.map('map').setView([10.07, -30.0], 3);
// var map = L.map('map').setView([10, -30.09], 3);

let street = L.layerGroup();
let topo = L.layerGroup();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(street);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }).addTo(topo);

street.addTo(map);
L.control.layers({
    "Street Map": street,
    "Topo Map": topo
}).addTo(map);

const init = async () => {
    let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

    let data = await d3.json(url);



    L.geoJSON(data, {
        style: function (feature) {
            return {color: feature.properties.color};
        }
    }).bindPopup(function (layer) {
        return layer.feature.properties.description;
    }).addTo(map);
};

init();

let legend = L.control({position:'bottomright'});

legend.onAdd = () => {
    let div = L.DomUtil.create('div', 'legend');

    div.innerHTML = `
        <h1>Depth</h1>
        <h3><span style="padding:2px 10px;background:#a3f702;margin-right:5px"></span> -10 - 10</h3>
        <h3><span style="padding:2px 10px;background:#ddf400;margin-right:5px"></span> 10 - 30</h3>
        <h3><span style="padding:2px 10px;background:#f8db12;margin-right:5px"></span> 30 - 50</h3>
        <h3><span style="padding:2px 10px;background:#fab82b;margin-right:5px"></span> 50 - 70</h3>
        <h3><span style="padding:2px 10px;background:#f9a35e;margin-right:5px"></span> 70 - 90</h3>
        <h3><span style="padding:2px 10px;background:#f76065;margin-right:5px"></span> 90+</h3>
    `

    return div
};

legend.addTo(map);

