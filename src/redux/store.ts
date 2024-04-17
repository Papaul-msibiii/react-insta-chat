import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { MessagerieApi } from '../utils/api/messagerie/messagerie.api'
import { Env, currentEnv } from '../utils/http'
const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [`${MessagerieApi.reducerPath}`]
}

export const rootReducers = combineReducers({
  [MessagerieApi.reducerPath]: MessagerieApi.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducers)

const store: any = configureStore({
  reducer: {
    [MessagerieApi.reducerPath]: MessagerieApi.reducer,
    persistedReducer
  },
  devTools: Env === currentEnv
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>

export default store
