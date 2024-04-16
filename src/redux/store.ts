import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { UserSlice } from './slice/User.slice'
import storage from 'redux-persist/lib/storage'
import {
  persistReducer
  //   FLUSH,
  //   REHYDRATE,
  //   PAUSE,
  //   PERSIST,
  //   PURGE,
  //   REGISTER
} from 'redux-persist'
import { UserApi } from '../../example/src/utils/api/user/user.api'
import { Env, currentEnv } from '../../example/src/utils/http'
import { AuthApi } from '../../example/src/utils/api/auth/auth.api'
import { MessagerieApi } from '../../example/src/utils/api/messagerie/messagerie.api'
import { MedecinApi } from '../../example/src/utils/api/medecin/medecin.api'
const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [
    `${UserSlice.name}`,
    `${UserApi.reducerPath}`,
    `${AuthApi.reducerPath}`,
    `${MessagerieApi.reducerPath}`,
    `${MedecinApi.reducerPath}`
  ]
}

export const rootReducers = combineReducers({
  [AuthApi.reducerPath]: AuthApi.reducer,
  [UserSlice.name]: UserSlice.reducer,
  [UserApi.reducerPath]: UserApi.reducer,
  [MessagerieApi.reducerPath]: MessagerieApi.reducer,
  [MedecinApi.reducerPath]: MedecinApi.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducers)

const store: any = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UserSlice.name]: UserSlice.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [MessagerieApi.reducerPath]: MessagerieApi.reducer,
    [MedecinApi.reducerPath]: MedecinApi.reducer,
    persistedReducer
  },
  devTools: Env === currentEnv
  //   middleware: (getDefaultMiddleware) => [
  //     ...getDefaultMiddleware({
  //       serializableCheck: {
  //         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
  //       }
  //     }),
  //     AuthApi.middleware,
  //     UserApi.middleware,
  //     MessagerieApi.middleware,
  //     MedecinApi.middleware,
  //   ]
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>

export default store
