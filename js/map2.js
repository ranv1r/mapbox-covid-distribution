mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4, 
    center: [-103, 37] 
});

const grades = [1, 40000, 80000, 160000, 320000, 640000],
    colors = ['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000'],
    radii = [1, 8, 16, 32, 64, 128];
opacity = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]


map.on('load', () => { 

    map.addSource('cases', {
        type: 'geojson',
        data: 'assets/us-covid-2020-cases.geojson'
    });
    console.log([...grades.keys()].map((i) => ([{
        zoom: 4,
        value: grades[i]
    }, radii[i]])))
    map.addLayer({
            'id': 'cases-point',
            'type': 'circle',
            'source': 'cases',
            'minzoom': 3,
            'paint': {
                'circle-radius': {
                    'property': 'cases',
                    'stops': [...grades.keys()].map(i => ([{
                        zoom: 4,
                        value: grades[i]
                    }, radii[i]]))
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [...grades.keys()].map(i => ([grades[i], colors[i]]))
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': {
                    'property': 'cases',
                    'stops': [...grades.keys()].map(i => ([grades[i], opacity[i]]))
                }
            }
        },
        'waterway-label'
    );

    let popup;
    map.on('mouseenter', 'cases-point', (event) => {
        popup = new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}<br>` + `<strong>County:</strong> ${event.features[0].properties.county}<br>` + `<strong>State:</strong> ${event.features[0].properties.state}`)
            .addTo(map);
    });
    map.on('mouseleave', 'cases-point', ()=> {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

});



const legend = document.getElementById('legend');


var labels = ['<strong>Cases</strong>'],
    vbreak;

for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];

    dot_radii = radii[i];
    labels.push(
        '<p class="break" style="padding-left:0px;"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; opacity:' + opacity[i] + ' "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">  ' + vbreak +
        '</span></p>');

}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NYTimes</a></p>';

legend.innerHTML = labels.join('') + source;