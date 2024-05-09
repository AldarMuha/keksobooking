import { sendData } from './app.js';
import { mainPinMarker } from './map.js';
import { map } from './map.js';

const FILE_TYPES = ['jpeg', 'jpg', 'png'];
const avatarPreview = document.querySelector('.ad-form-header__preview  img');
const photoPreview = document.querySelector('.ad-form__photo');
const avatarFile = document.querySelector('#avatar');
const photoFile = document.querySelector('#images');

const adForm = document.querySelector('.ad-form');
const submitButton = adForm.querySelector('.ad-form__submit');
const resetButton = adForm.querySelector('.ad-form__reset');

const avatar = adForm.querySelector('#avatar');
const title = adForm.querySelector('#title');
const address = adForm.querySelector('#address');
const time = adForm.querySelector('.ad-form__element--time');
const features = adForm.querySelector('.features');
const description = adForm.querySelector('#description');
const images = adForm.querySelector('#images');
const roomsField = adForm.querySelector('#room_number');
const capacityField = adForm.querySelector('#capacity');

const isValidType = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((it) => fileName.endsWith(it));
};

const onAvatarInputChange = () => {
  const file = avatarFile.files[0];

  if (file && isValidType(file)) {
    avatarPreview.src = URL.createObjectURL(file);
  }
};

const onPhotoInputChange = () => {
  const file = photoFile.files[0];

  if (file && isValidType(file)) {
    photoPreview.innerHTML = `<img src="${URL.createObjectURL(file)}" width="70" height="70">`;
  }
};

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'ad-form__element--error',
}, false);

function validateTitle(value) {
  return value.length >= 30 && value.length <= 100;
}

pristine.addValidator(
  title,
  validateTitle,
  'От 30 до 100 символов',
);

const roomsOption = {
  '1': '1',
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': '0',
};

function validateRooms() {
  return roomsOption[roomsField.value].includes(capacityField.value);
}

function getRoomsErrorMessage() {
  switch (roomsField.value) {
    case '1':
      return '1 комната только для 1 гостя';
    case '2':
      return '2 комнаты для 1 или 2 гостей';
    case '3':
      return '3 комнаты для 1, для 2 или 3 гостей';
    case '100':
      return '100 комнат не для гостей';
  }
}

pristine.addValidator(
  roomsField,
  validateRooms,
  getRoomsErrorMessage,
);

pristine.addValidator(
  capacityField,
  validateRooms,
  getRoomsErrorMessage,
);


const type = adForm.querySelector('#type');
const price = adForm.querySelector('#price');

const sliderElement = adForm.querySelector('.ad-form__slider');

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 100000,
  },
  start: 0,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

sliderElement.noUiSlider.on('update', () => {
  price.value = sliderElement.noUiSlider.get();
});

const minPrice = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000,
};

function validatePriceType(value) {
  return value.length && value >= minPrice[type.value] && value <= 100000;
}

function getPriceErrorMessage() {
  if (price.value <= 100000) {
    switch (type.value) {
      case 'bungalow':
        return 'Для Бунгало минимальная цена 0';
      case 'flat':
        return 'Для Квартиры мнимальная цена 1000';
      case 'hotel':
        return 'Для Гостиницы минимальная цена 3000';
      case 'house':
        return 'Для Дома минимальная цена 5000';
      case 'palace':
        return 'Для Дворца минимальная цена 10 000';
    }
  }
  else {
    return 'Максимальная цена 100 000';
  }
}

pristine.addValidator(
  price,
  validatePriceType,
  getPriceErrorMessage,
);

const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');

timeIn.addEventListener('change', () => {
  timeOut.value = timeIn.value;
});

timeOut.addEventListener('change', () => {
  timeIn.value = timeOut.value;
});

const adFormElements = [
  avatar,
  title,
  address,
  type,
  price,
  time,
  roomsField,
  capacityField,
  features,
  description,
  images,
  submitButton,
  resetButton,
];

const disabledAdForm = () => {
  adForm.classList.add('ad-form--disabled');
  adFormElements.forEach((adFormElement) => {
    adFormElement.setAttribute('disabled', true);
  });
};

const activeAdForm = () => {
  adForm.classList.remove('ad-form--disabled');
  adFormElements.forEach((adFormElement) => {
    adFormElement.removeAttribute('disabled');
  });
};

const onSuccess = () => {
  const successTemplate = document.querySelector('#success')
    .content.querySelector('.success');
  const successElement = successTemplate.cloneNode(true);

  document.body.append(successElement);

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      successElement.remove();
    }
  });

  document.addEventListener('click', () => successElement.remove());
};

const onError = () => {
  const errorTemplate = document.querySelector('#error')
    .content.querySelector('.error');
  const errorElement = errorTemplate.cloneNode(true);
  const errorButton = errorElement.querySelector('.error__button');

  document.body.append(errorElement);

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      errorElement.remove();
    }
  });

  document.addEventListener('click', () => errorElement.remove());

  errorButton.addEventListener('click', () => errorElement.remove());
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  pristine.validate();
  const isValid = pristine.validate();
  if (isValid) {
    sendData(
      () => {
        onSuccess();
        pristine.reset();
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 100000,
          },
          start: 0,
        });

        mainPinMarker.setLatLng({
          lat: 35.68950,
          lng: 139.69171,
        });
        map.closePopup();
        adForm.reset();
        avatarPreview.src = 'img/muffin-grey.svg';
        photoPreview.innerHTML = '';
        //submitButton.setAttribute('disabled', true);
      },
      onError,
      new FormData(evt.target),
    );
  }
};

const onResetClick = () => {
  pristine.reset();
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: 0,
      max: 100000,
    },
    start: 0,
  });

  mainPinMarker.setLatLng({
    lat: 35.68950,
    lng: 139.69171,
  });
  map.closePopup();
  adForm.reset();
  avatarPreview.src = 'img/muffin-grey.svg';
  photoPreview.innerHTML = '';
};

adForm.addEventListener('submit', onFormSubmit);
resetButton.addEventListener('click', onResetClick);
avatarFile.addEventListener('change', onAvatarInputChange);
photoFile.addEventListener('change', onPhotoInputChange);

export { disabledAdForm, activeAdForm, address };
