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

  // Add tile layer (OpenStreetMap by default)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // switch to a dark-themed basemap:
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    className: 'leaflet-dark-theme',
  }).addTo(map);

  // ore-styled map tiles
  //   L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>',
  //     subdomains: 'abcd',
  //     maxZoom: 20,
  //   }).addTo(map);

  // Custom icon
  //   const customIcon = L.icon({
  //     iconUrl: '/img/pin.png',
  //     iconSize: [32, 32],
  //     iconAnchor: [16, 32],
  //     popupAnchor: [0, -32],
  //   });

  // Create bounds object
  const bounds = [];

  // Add markers for each location
  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates; // Assuming schema uses [lng, lat]

    // Create a div icon
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({ className: 'marker', iconSize: [32, 40] }),
    })
      .addTo(map)
      .bindPopup(`<p>${loc.description}</p>`, { autoClose: false })
      .openPopup();

    bounds.push([lat, lng]);
  });

  // Fit map to show all markers
  if (bounds.length) map.fitBounds(bounds, { padding: [50, 50] });
}
