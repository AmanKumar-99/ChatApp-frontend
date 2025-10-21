import axios from "axios"
import { BASE_URL } from ".."

export const getAllUsers = async () => {
  return await axios.get(`${BASE_URL}/users`, {
    withCredentials: true,
  })
}

export const getUserDetailsById = async (userId: string) => {
  return await axios.get(`${BASE_URL}/users/${userId}`, {
    withCredentials: true,
  })
}
