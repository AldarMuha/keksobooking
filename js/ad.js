const adTemplate = document
  .querySelector('#card')
  .content.querySelector('.popup');

const getType = (types) =>{
  switch(types){
    case 'flat':
      return 'Квартира';
    case 'bungalow':
      return 'Бунгало ';
    case 'house':
      return 'Дом ';
    case 'palace':
      return 'Дворец';
    case 'hotel':
      return 'Отель ';
    default:
      return 'Не указали';
  }
};

const renderFeatures = (element, features) => {
  const featureList = element.querySelector('.popup__features');
  featureList.innerHTML = '';

  if(!features){
    featureList.classList.add('hidden');
  }
  else{
    features.forEach((feature)=>{
      const featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature');
      featureElement.classList.add(`popup__feature--${feature}`);
      featureList.append(featureElement);
    });
  }
};

const renderPhotos = (element, photos) => {
  const photoList = element.querySelector('.popup__photos');
  photoList.innerHTML = '';

  if(!photos){
    photoList.classList.add('hidden');
  }
  else{
    photos.forEach((photo)=>{
      const photoElement = document.createElement('div');
      photoElement.innerHTML = '<div><img src="" class="popup__photo" width="45" height="40" alt="Фотография жилья"></div>';
      photoElement.querySelector('.popup__photo').src = photo;
      photoList.append(photoElement);
    });
  }
};

const createAd = (data) => {
  const adElement = adTemplate.cloneNode(true);
  const {author, offer} = data;

  const title = adElement.querySelector('.popup__title');
  if(offer.title) {title.content = offer.title;}
  else {title.classList.add('hidden');}

  const address = adElement.querySelector('.popup__text--address');
  if(offer.address) {address.textContent = offer.address;}
  else {address.classList.add('hidden');}

  const price = adElement.querySelector('.popup__text--price');
  if(offer.price) {price.textContent = `${offer.price}₽/ночь`;}
  else {price.classList.add('hidden');}

  const type = adElement.querySelector('.popup__type');
  if(offer.type) {type.textContent = getType(offer.type);}
  else {type.classList.add('hidden');}

  const guestsRooms = adElement.querySelector('.popup__text--capacity');
  if(offer.rooms && offer.guests) {guestsRooms.textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;}
  else {guestsRooms.classList.add('hidden');}

  const time = adElement.querySelector('.popup__text--time');
  if(offer.checkin && offer.checkout) {time.textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;}
  else {time.classList.add('hidden');}

  renderFeatures(adElement, offer.features);

  const description = adElement.querySelector('.popup__description');
  if(offer.description) {description.textContent = offer.description;}
  else {description.classList.add('hidden');}

  renderPhotos(adElement, offer.photos);

  const avatar = adElement.querySelector('.popup__avatar');
  avatar.src = author.avatar;

  return adElement;
};

export {createAd};
