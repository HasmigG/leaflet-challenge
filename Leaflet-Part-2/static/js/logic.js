var map = L.map('map').setView([10.07, -30.0], 3);

let topo = L.layerGroup();
let street = L.layerGroup();
let earthquake = L.layerGroup();
let tectonicplates = L.layerGroup();

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';
let url2 = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(street);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(topo);

street.addTo(map);
earthquake.addTo(map);

const init = async () => {
    
    let data = await d3.json(url);
    let plates = await d3.json(url2);

    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            let depth = feature.geometry.coordinates[2]
            let mag = feature.properties.mag;
            return {
                radius: mag * 3,
                color: 'black',
                weight: 1,
                fillOpacity: 1,
                fillColor:
                    depth < 10 ? '#a3f702' :
                    depth < 30 ? '#ddf400' :
                    depth < 50 ? '#f8db12' :
                    depth < 70 ? '#fab82b' :
                    depth < 90 ? '#f9a35e' : '#f76065'
            };
        }
    }).bindPopup(function ({ feature }) {
        let depth = feature.geometry.coordinates[2]
        let mag = feature.properties.mag;
        let place = feature.properties.place;
        let time = feature.properties.time;
        let date = new Date(time).toLocaleString();

        return `
            <h4>${place}<br>
            Magnitude: ${mag}<br>
            Depth: ${depth}<br>
            ${date}`;
    }).addTo(earthquake);

    L.geoJSON(plates, {
        pointToLayer: function (feature, latlng) {
            return L.polygon(latlng);
        },
        style: function (feature) {
            return {color: 'red'};
        }
    }).bindPopup(function (layer) {
        return layer.feature.properties.description;
    }).addTo(tectonicplates);

    L.control.layers({
        "Street Map": street,
        "Topo Map": topo
    },{
        'Earthquakes': earthquake,
        'Tectonic Plates':tectonicplates
    }).addTo(map);
};

init();

let legend = L.control({ position: 'bottomright' });

legend.onAdd = () => {
    let div = L.DomUtil.create('div', 'legend');

    div.innerHTML = '<h1>Depth</h1>'

    let depth = ['-10 - 10','10 - 30','30 - 50','50 - 70','70 - 90','90+'];
    let colors = ['#a3f702','#ddf400','#f8db12','#fab82b','#f9a35e','#f76065'];

    depth.forEach((x_range, i) => div.innerHTML += `<h3><span style="padding:2px 10px;background:${colors[i]};margin-right:5px"></span> ${x_range}</h3>`);

    // div.innerHTML = `
    //     <h1>Depth</h1>
    //     <h3><span style="padding:2px 10px;background:#a3f702;margin-right:5px"></span> -10 - 10</h3>
    //     <h3><span style="padding:2px 10px;background:#ddf400;margin-right:5px"></span> 10 - 30</h3>
    //     <h3><span style="padding:2px 10px;background:#f8db12;margin-right:5px"></span> 30 - 50</h3>
    //     <h3><span style="padding:2px 10px;background:#fab82b;margin-right:5px"></span> 50 - 70</h3>
    //     <h3><span style="padding:2px 10px;background:#f9a35e;margin-right:5px"></span> 70 - 90</h3>
    //     <h3><span style="padding:2px 10px;background:#f76065;margin-right:5px"></span> 90+</h3>
    // `

    return div
};

legend.addTo(map);

