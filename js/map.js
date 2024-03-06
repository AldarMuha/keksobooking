import { disabledPage, activePage } from './access_page.js';
import { address } from './form.js';
import { createAd } from './ad.js';

disabledPage();

const map = L.map('map-canvas')
  .on('load', activePage)
  .setView({
    lat: 35.68950,
    lng: 139.69171,
  }, 13);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const pinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (point)=>{
  const marker = L.marker(
    {
      lat: point.location.lat,
      lng: point.location.lng,
    },
    {
      icon: pinIcon,
    },
  );
  marker
    .addTo(markerGroup)
    .bindPopup(createAd(point));
};
/*
const renderMarkers = (points)=>{
  const markers = points.slice(0, 10);
  markers.forEach((marker) => {
    createMarker(marker);
  });
};
*/
const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: 35.68950,
    lng: 139.69171,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

//address.setAttribute('disabled', true);
mainPinMarker.addTo(map);
let latLngAddress;
mainPinMarker.on('moveend', (evt)=>{
  latLngAddress = evt.target.getLatLng();
  address.value = `${latLngAddress.lat.toFixed(5)} , ${latLngAddress.lng.toFixed(5)}`;
});

document.addEventListener('keydown', (evt)=>{
  if(evt.key==='Escape'){
    markerGroup.closePopup();
  }
});

export {/*renderMarkers, */mainPinMarker, map, createMarker, markerGroup};

