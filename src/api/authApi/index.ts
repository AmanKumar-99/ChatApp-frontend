import axios from "axios"
import { BASE_URL } from ".."

export const registerUser = async (payload: unknown) => {
  return await axios.post(`${BASE_URL}/auth/register`, payload, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })
}

export const loginUser = async (payload: unknown) => {
  return await axios.post(`${BASE_URL}/auth/signin`, payload, {
    withCredentials: true,
  })
}

export const checkAuth = async (email: string) => {
  return await axios.get(`${BASE_URL}/auth/me?email=${email}`, {
    withCredentials: true,
  })
}
