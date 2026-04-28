import axios from 'axios'

const API = 'http://localhost:3000/api/usuarios'



export const loginService = async (email, password) => {
    const response = await axios.post(`${API}/login`, { email, password })
    return response.data
}

export const registroService = async (nombre, email, password) => {
    const response = await axios.post(`${API}/registro`, { nombre, email, password })
    return response.data
}