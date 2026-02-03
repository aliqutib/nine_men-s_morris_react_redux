import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Redux Essentials
//import { Provider }  from 'react-redux';
//import { reduxStore } from './store/StoreConfig';
//import { rootReducer } from './reducers/rootReducer';

//const store = reduxStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

