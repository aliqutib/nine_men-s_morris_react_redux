import { applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';


// Simple store factory - wraps Redux `createStore` with thunk middleware.
// Note: keep this small for clarity. For larger apps consider @reduxjs/toolkit's configureStore.
export const reduxStore = (rootReducer) => {
    const middleware = [thunk];
    const store = configureStore(rootReducer, applyMiddleware(...middleware));
    return store;
}