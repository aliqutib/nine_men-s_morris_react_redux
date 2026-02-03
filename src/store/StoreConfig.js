import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Simple store factory - wraps Redux `createStore` with thunk middleware.
// Note: keep this small for clarity. For larger apps consider @reduxjs/toolkit's configureStore.
export const configureStore = (rootReducer) => {
    const middleware = [thunk];
    const store = createStore(rootReducer, applyMiddleware(...middleware));
    return store;
}