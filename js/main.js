import './map.js';
import './form.js';
//import { renderMarkers } from './map.js';
import { debounce, showAlert} from './util.js';
import { getData } from './app.js';
import { mapFilter, onChangeFilter } from './filter.js';

getData(onChangeFilter, showAlert);
const cb = ()=> getData(onChangeFilter, showAlert);

mapFilter.addEventListener('change', debounce(cb));

