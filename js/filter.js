import { createMarker, markerGroup } from './map.js';
import { debounce } from './util.js';

const mapFilter = document.querySelector('.map__filters');
const housingType = mapFilter.querySelector('#housing-type');
const housingPrice = mapFilter.querySelector('#housing-price');
const housingRooms = mapFilter.querySelector('#housing-rooms');
const housingGuests = mapFilter.querySelector('#housing-guests');
const housingFeatures = mapFilter.querySelector('#housing-features');

const mapFilterElements = [
  housingType,
  housingPrice,
  housingRooms,
  housingGuests,
  housingFeatures,
];

const disabledMapFilter = () =>{
  mapFilter.classList.add('ad-form--disabled');
  mapFilterElements.forEach((adFormElement)=>{
    adFormElement.setAttribute('disabled', true);
  });
};

const activeMapFilter = () => {
  mapFilter.classList.remove('ad-form--disabled');
  mapFilterElements.forEach((adFormElement)=>{
    adFormElement.removeAttribute('disabled');
  });
};

const isType = (typeValue) => housingType.value === 'any' ||  typeValue === housingType.value;


const isPrice = (priceValue)=>{
  switch(housingPrice.value){
    case 'any':
      return true;
    case 'middle':
      return priceValue>=10000 && priceValue<50000;
    case 'low':
      return priceValue<10000;
    case 'high':
      return priceValue>=50000;
  }
};

const isRooms = (roomsValue) => housingRooms.value === 'any' || roomsValue === Number(housingRooms.value);

const isGuests = (guestsValue) => housingGuests.value === 'any' || guestsValue === Number(housingGuests.value);

const isFeature = (features)=>{
  const featuresElementsChecked = Array.from( housingFeatures.querySelectorAll('[type="checkbox"]:checked'));
  if(!features){
    return false;
  }
  return featuresElementsChecked.every((element)=> features.some((feature)=> feature === element.value));
};

const onChangeFilter = (markers) =>{
  markerGroup.clearLayers();
  markers.filter((marker)=> isType(marker.offer.type)
      && isPrice(marker.offer.price)
      && isRooms(marker.offer.rooms)
      && isGuests(marker.offer.guests)
      && isFeature(marker.offer.features))
    .slice(0, 10)
    .forEach((marker)=>createMarker(marker));
};

export {disabledMapFilter, activeMapFilter, onChangeFilter, mapFilter};
