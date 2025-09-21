/* eslint-disable */
import 'leaflet/dist/leaflet.css';

const mapEl = document.getElementById('map');
if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  // console.log('Locations data:', locations);

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

  // =======================
  // Initialize Leaflet map
  // =======================
  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
    layers: [light],
  });

  L.control
    .zoom({
      position: 'topright',
    })
    .addTo(map);

  // =================
  // Basemap switcher
  // =================
  const baseMaps = { Light: light, Dark: dark };
  L.control.layers(baseMaps).addTo(map);

  // =============================================
  // Implement Leaflet marker (DOM + CSS approach)
  // =============================================
  const bounds = L.latLngBounds();

  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates;

    // Create DOM element
    const el = document.createElement('div');
    el.className = 'marker';

    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        html: el,
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

  map.fitBounds(bounds, { padding: [50, 50] });
}
