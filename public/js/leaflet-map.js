/* eslint-disable */
console.log('Leaflet client script loaded ');

const mapEl = document.getElementById('map');
if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  console.log('Locations data:', locations);

  // ==========================
  // Define basemap layers FIRST
  // ==========================
  const light = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  );

  const dark = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors',
      className: 'leaflet-dark-theme',
    },
  );

  // ==========================
  // Initialize Leaflet map
  // ==========================
  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
    layers: [light], // ✅ works now
  });

  L.control
    .zoom({
      position: 'topright', // add new zoom btns to top-right
    })
    .addTo(map);

  // ==========================
  // Basemap switcher
  // ==========================
  const baseMaps = { Light: light, Dark: dark };
  L.control.layers(baseMaps).addTo(map);

  // =============================================
  // Implement Leaflet marker (DOM + CSS approach)
  // =============================================
  // Bounds object (same concept as Mapbox LatLngBounds)
  const bounds = L.latLngBounds();

  // Loop locations from GeoJSON  ([lng, lat]). It will be flipped for leaflet
  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates;

    // Create DOM element
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker using Leaflet's `L.marker` with a DivIcon wrapper
    // Flipping lng, lat to leaflet way (l.marker) ([lat, lng])
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        html: el, // pass DOM element here
        className: '', // keep Leaflet from adding extra classes
        iconSize: [32, 40],
        iconAnchor: [16, 40],
      }),
    })
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
      });

    bounds.extend([lat, lng]);
  });

  // Fit map to markers
  map.fitBounds(bounds, { padding: [50, 50] });
}
