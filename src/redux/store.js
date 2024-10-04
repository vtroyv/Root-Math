import { configureStore , combineReducers,} from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './usersSlice';
import learnReducer from './learnSlice';

import authReducer from './authSlice'


const rootReducer = combineReducers({user: userReducer,  auth: authReducer, [learnReducer.reducerPath]: learnReducer.reducer})

const persistConfig = {
    key: 'root',
    storage,
  }


  const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [learnReducer.middleware],
      },
      thunk: {
        extraArgument: {
          learnApi: learnReducer,
        },
      },
     }).concat(learnReducer.middleware)
})

export const persistor = persistStore(store);

