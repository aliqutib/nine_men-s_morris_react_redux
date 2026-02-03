import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Redux Essentials
import { Provider }  from 'react-redux';
import { configureStore } from './store/StoreConfig';
import { rootReducer } from './reducers/rootReducer';

const store = configureStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

