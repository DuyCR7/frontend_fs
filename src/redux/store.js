import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./admin/slices/userSlice";
import customerReducer from "./customer/slices/customerSlice";
import chatReducer from "./customer/slices/chatSlice"
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Cấu hình persist
const userPersistConfig = {
    key: 'user',
    storage,
};

// Áp dụng persistReducer cho userReducer
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const customerPersistConfig = {
    key: 'customer',
    storage,
}
const persistedCustomerReducer = persistReducer(customerPersistConfig, customerReducer);

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        customer: persistedCustomerReducer,
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store);