/* public/js/leaflet-map.js */
console.log('Leaflet client script loaded ✅');

// 1) Grab the map element and read locations from data-attribute
// const mapEl = document.getElementById('map');
// if (!mapEl) {
//   console.warn('No #map element found on this page.');
//   // Nothing to do on pages without a map
// } else {
//   let locations = [];
//   try {
//     locations = JSON.parse(mapEl.dataset.locations || '[]');
//   } catch (err) {
//     console.error('Failed to parse data-locations JSON:', err);
//   }

//   if (!locations.length) {
//     console.warn('No locations provided for the map.');
//   }

//   // 2) Initialize Leaflet map
//   const map = L.map('map', {
//     scrollWheelZoom: false, // similar to Mapbox scrollZoom: false
//   });

//   // 3) Add a free OpenStreetMap tile layer (no token needed)
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
//   }).addTo(map);

//   // 4) Plot markers and fit bounds
//   // IMPORTANT: Leaflet expects [lat, lng] but your data is [lng, lat]
//   const bounds = L.latLngBounds();

//   locations.forEach((loc) => {
//     const [lng, lat] = loc.coordinates; // your DB format is [lng, lat]
//     const position = [lat, lng]; // swap for Leaflet

//     L.marker(position)
//       .addTo(map)
//       .bindPopup(
//         loc.day
//           ? `<p>Day ${loc.day}: ${loc.description || ''}</p>`
//           : `<p>${loc.description || 'Tour location'}</p>`,
//       );

//     bounds.extend(position);
//   });

//   // If we had at least one location, fit the bounds
//   if (locations.length) {
//     map.fitBounds(bounds, { padding: [80, 80] }); // [y, x] padding in px
//   } else {
//     // Fallback center if no locations
//     map.setView([0, 0], 2);
//   }
// }
