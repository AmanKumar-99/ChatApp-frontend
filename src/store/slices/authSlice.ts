import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  email: string
  status: "online" | "away" | "offline"
  profilePicUrl?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null // Access token
  isLoading: boolean
}

const token = sessionStorage.getItem("token")

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: token || null, // Access token
  isLoading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string | null }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
    },
    loginEnd: (state) => {
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const {
  setAccessToken,
  loginStart,
  loginSuccess,
  loginEnd,
  logout,
} = authSlice.actions
export default authSlice.reducer
