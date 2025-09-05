/* eslint-disable */
console.log('Leaflet client script loaded ');

const mapEl = document.getElementById('map');
if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  console.log('Locations data:', locations);

  // Initialize Leaflet map
  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false, // deactivate default (top-left) zoom btns!
  });

  L.control
    .zoom({
      position: 'bottomright', // add new zoom btns to bottom-right
    })
    .addTo(map);

  // Add tile layer (OpenStreetMap by default)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Create bounds object
  const bounds = [];

  // Add markers for each location
  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates; // Assuming your schema uses [lng, lat]
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<p>${loc.description}</p>`, { autoClose: false })
      .openPopup();

    bounds.push([lat, lng]);
  });

  // Fit map to show all markers
  if (bounds.length) map.fitBounds(bounds, { padding: [50, 50] });
}
