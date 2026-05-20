import { QRCodeSVG } from 'qrcode.react'
import '../styles/QR.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

function QR() {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'))
    const [perfil, setPerfil] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (usuarioLocal) {
            axios.get(`${API_URL}/perfil/${usuarioLocal.id}`)
                .then(res => setPerfil(res.data))
        }
    }, [])

    if (!usuarioLocal) return (
        <div className="contenedor-pagina">
            <p className="aviso-sesion">Debes iniciar sesión para ver tu QR.</p>
        </div>
    )

    if (!perfil) return (
        <div className="contenedor-pagina">
            <p className="aviso-sesion">Cargando...</p>
        </div>
    )

    if (!perfil.membresia) return (
        <div className="contenedor-pagina contenedor-qr">
            <div className="tarjeta-sin-membresia">
                <h1>Mi Carnet de Socio</h1>
                <span className="icono-sin-membresia">🔒</span>
                <p className="texto-sin-membresia">Para obtener tu carnet necesitas una suscripción activa.</p>
                <button className="boton-ver-membresias" onClick={() => navigate('/membresias')}>Ver membresías</button>
            </div>
        </div>
    )

    const qrData = JSON.stringify({
        id: perfil.id,
        nombre: perfil.nombre,
        email: perfil.email,
        rol: usuarioLocal.rol
    })

    return (
        <div className="contenedor-pagina contenedor-qr">
            <h1>Mi Carnet de Socio</h1>
            <p className="subtitulo-qr">Muestra este código en recepción para acceder al gimnasio</p>

            <div className="tarjeta-qr">
                <div className="logo-qr">ZenForce</div>
                <div className="codigo-qr">
                    <QRCodeSVG value={qrData} size={200} />
                </div>
                <div className="info-qr">
                    <p className="nombre-socio">{perfil.nombre}</p>
                    <p className="email-socio">{perfil.email}</p>
                    <span className={`rol-socio ${usuarioLocal.rol === 'admin' ? 'administrador' : ''}`}>
                        {usuarioLocal.rol === 'admin' ? 'Administrador' : 'Socio'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default QR