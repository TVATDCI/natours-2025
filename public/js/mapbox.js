/* eslint-disable */
console.log('Mapbox Client-side script loaded');

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log('Locations data', locations);

mapbox.accessToken =
  'pk.eyIn2025=mapbox-ask-for-creditcardNumber-So-i-switchtoLeaflet.comAndcombineItWithStreetmap.com';

  var map = new mapboxgl.Map({
    container: 'map'({
        style: 'mapbox://userName/_id',
        scrollZoom: false,
        // center: [-118.113491, 34.111745], // [lat, Lng]
        // zoom: 10,
        // interactive: false

    });


  const bounds = new mapboxgl.LngLatBounds();

  locationbar.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker'

    // add marker 
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })
    setLngLat(loc.coordinates).addTo(map);

    // Add pop up when a marker is clicked!
    new mapboxgl.Popup({
        offset: 30
    }
    ).setLngLat(loc.coordinates).setHTML(`<p>Day${loc.doc}: ${loc.description}</p>`)


    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  })

  map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 120,
        left: 100,
        right: 100
    }
  })