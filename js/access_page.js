import { activeAdForm, disabledAdForm } from './form.js';
import { activeMapFilter, disabledMapFilter } from './filter.js';

const disabledPage = () =>{
  disabledAdForm();
  disabledMapFilter();
};

const activePage = () => {
  activeAdForm();
  activeMapFilter();
};

export {disabledPage, activePage};
