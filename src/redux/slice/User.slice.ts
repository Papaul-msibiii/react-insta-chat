/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '../../../example/src/utils/api/user/user.type'
import { AppLocalStorage, AppStorage } from '../../../example/src/utils/storage'

const initialState = AppStorage.getItem<AuthState>('user', {
  user: undefined,
  token: undefined
})
export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onSetUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload
      AppStorage.setItem('user', state)
    },
    onSetToken: (state, action: PayloadAction<AuthState['token']>) => {
      state.token = action.payload
      AppStorage.setItem('token', state.token)
    },
    onSetUserToken: (state, action: PayloadAction<AuthState>) => {
      console.log('user', action)
      state.user = action.payload.user
      state.token = action.payload.token
      AppStorage.setItem('user', state)
    },
    onlogout: (state) => {
      state.user = null
      state.token = null
      AppStorage.setItem('user', state)
      AppStorage.clear()
      AppLocalStorage.removeItem('remember_me')
    },
    onSetUserTokenOnLocalStorage: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      AppLocalStorage.setItem('user', state)
    }
  }
})

export const {
  onSetUser,
  onSetUserToken,
  onSetToken,
  onlogout,
  onSetUserTokenOnLocalStorage
} = UserSlice.actions
export default UserSlice.reducer
