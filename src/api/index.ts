import { logout, setAccessToken } from "@/store/slices/authSlice"
import { store } from "@/store/store"
import axios from "axios"

export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:9000/api"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send refresh token cookies for refresh.
})

// attach access token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token && config.headers)
    config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh control
let isRefreshing = false
let queue: {
  resolve: (value?) => void
  reject: (err?) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  queue.forEach((p) => {
    if (error) p.reject(error)
    else {
      if (token) p.config.headers.Authorization = `Bearer ${token}`
      p.resolve(api(p.config))
    }
  })
  queue = []
}

// Response interceptor: on 401 try refresh (simple approach)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (!original) return Promise.reject(err)

    const status = err.response?.status
    // 401 and not retry yet
    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        // queue the request while we refresh
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, config: original })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        // Call refresh endpoint directly (cookie sent because withCredentials true)
        const refreshResp = await axios.get(
          `${api.defaults.baseURL}/auth/me`,
          {
            withCredentials: true,
          }
        )

        const newToken = refreshResp.data?.token ?? null

        // update Redux store
        store.dispatch(setAccessToken(newToken))

        processQueue(null, newToken)

        // attach token to original and retry
        if (newToken) original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // clear auth (logout)
        store.dispatch(logout())
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  }
)

export default api
