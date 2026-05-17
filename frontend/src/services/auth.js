import axios from 'axios'
import API_URL from '../config'
const API = `${API_URL}/usuarios`

export const loginService = async (email, password) => {
    const response = await axios.post(`${API}/login`, { email, password })
    return response.data
}

export const registroService = async (nombre, email, password) => {
    const response = await axios.post(`${API}/registro`, { nombre, email, password })
    return response.data
}