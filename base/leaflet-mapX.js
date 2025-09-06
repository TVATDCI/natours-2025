/* eslint-disable */
console.log('Leaflet client script loaded ');

const mapEl = document.getElementById('map');
if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  console.log('Locations data:', locations);

  // Initialize Leaflet map
  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false, // set to false deactivate default (top-left) zoom btns!
  });

  L.control
    .zoom({
      position: 'topright', // add new zoom btns to bottom-right
    })
    .addTo(map);

  // ==========================
  // Option for Map layer Tiles
  // ==========================
  // Light tile layer OSM basemap (OpenStreetMap by default)
  // ==========================
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   }).addTo(map);

  // switch to a dark-themed basemap:
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    className: 'leaflet-dark-theme',
  }).addTo(map);

  // ====================
  // pre-styled map tiles
  // ====================
  //   L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>',
  //     subdomains: 'abcd',
  //     maxZoom: 20,
  //   }).addTo(map);

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
      .bindPopup(`<p>${loc.description}</p>`, { autoClose: false });

    bounds.extend([lat, lng]);
  });

  // Fit map to markers
  map.fitBounds(bounds, { padding: [50, 50] });
}
// ================================================
// Implement marker logic by https://leafletjs.com/
// ================================================

// Create bounds object
//   const bounds = [];

//   // Add markers for each location
//   locations.forEach((loc) => {
//     const [lng, lat] = loc.coordinates; // Assuming schema uses [lng, lat]

//     // Create a div icon
//     const marker = L.marker([lat, lng], {
//       icon: L.divIcon({ className: 'marker', iconSize: [32, 40] }),
//     })
//       .addTo(map)
//       .bindPopup(`<p>${loc.description}</p>`, { autoClose: false })
//       .openPopup();

//     bounds.push([lat, lng]);
//   });

//   // Fit map to show all markers
//   if (bounds.length) map.fitBounds(bounds, { padding: [50, 50] });
// }
