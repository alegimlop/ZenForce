import { QRCodeSVG } from 'qrcode.react'
import './QR.css'

function QR() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if (!usuario) return (
        <div className="contenedor-pagina">
            <p className="aviso-sesion">Debes iniciar sesión para ver tu QR.</p>
        </div>
    )

    const qrData = JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
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
                    <p className="nombre-socio">{usuario.nombre}</p>
                    <p className="email-socio">{usuario.email}</p>
                    <span className={`rol-socio ${usuario.rol === 'admin' ? 'administrador' : ''}`}>
                        {usuario.rol === 'admin' ? 'Administrador' : 'Socio'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default QR
