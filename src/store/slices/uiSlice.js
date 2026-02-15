import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showThreadForm: false,
    showLoginModal: false,
    showRegisterModal: false,
  },
  reducers: {
    toggleThreadForm: (state) => {
      state.showThreadForm = !state.showThreadForm
    },
    toggleLoginModal: (state) => {
      state.showLoginModal = !state.showLoginModal
    },
    toggleRegisterModal: (state) => {
      state.showRegisterModal = !state.showRegisterModal
    },
    setShowThreadForm: (state, action) => {
      state.showThreadForm = action.payload
    },
    setShowLoginModal: (state, action) => {
      state.showLoginModal = action.payload
    },
    setShowRegisterModal: (state, action) => {
      state.showRegisterModal = action.payload
    },
  },
})

export const {
  toggleThreadForm,
  toggleLoginModal,
  toggleRegisterModal,
  setShowThreadForm,
  setShowLoginModal,
  setShowRegisterModal,
} = uiSlice.actions
export default uiSlice.reducer
