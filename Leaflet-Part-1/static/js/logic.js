var map = L.map('map').setView([10.07, -30.0], 3);
// var map = L.map('map').setView([10, -30.09], 3);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([40.07, 45.04]).addTo(map)
    .bindPopup(`<h2>Armenia</h2> 
        <h4>The oldest piece of leather footwear in the world known to contemporary researchers
         was found in 2008 from a cave in Armenia.</h4>`)
    .openPopup();

const init = async () => {
    let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

    let {features} = await d3.json(url);


    // console.log(features[0]);
    // console.log(features[0].geometry);
    // console.log(features[0].id,features[0].geometry.coordinates);
    // console.log(features[0].geometry.coordinates);



    features.forEach(({
        id,
        properties:{mag,place,time},
        geometry:{coordinates: [lng,lat,depth]}
    }) => {

        L.circleMarker([lat,lng], {
            color: 'black',
            weight: 1,
            radius: mag*3,
            fillOpacity: 1,
            fillColor: 
                depth<10 ? '#a3f702' : 
                depth<30 ? '#ddf400' : 
                depth<50 ? '#f8db12' : 
                depth<70 ? '#fab82b' :
                depth<90 ? '#f9a35e': '#f76065'

        }).addTo(map)
            .bindPopup(`
                <h4>${place}<br>
                Magnitude: ${mag}<br>
                Depth: ${depth}<br>
                ${new Date(time).toLocaleString()}`
            )

    });
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

