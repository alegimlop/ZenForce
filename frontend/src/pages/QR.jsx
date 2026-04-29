import { QRCodeSVG } from 'qrcode.react'
import './QR.css'

function QR() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if (!usuario) return (
        <div className="page-container">
            <p className="aviso-login">Debes iniciar sesión para ver tu QR.</p>
        </div>
    )

    const qrData = JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    })

    return (
        <div className="page-container qr-container">
            <h1>Mi Carnet de Socio</h1>
            <p className="qr-subtitulo">Muestra este código en recepción para acceder al gimnasio</p>

            <div className="card qr-card">
                <div className="qr-logo">ZenForce</div>
                <div className="qr-code">
                    <QRCodeSVG value={qrData} size={200} />
                </div>
                <div className="qr-info">
                    <p className="qr-nombre">{usuario.nombre}</p>
                    <p className="qr-email">{usuario.email}</p>
                    <span className={`qr-rol ${usuario.rol === 'admin' ? 'admin' : ''}`}>
                        {usuario.rol === 'admin' ? 'Administrador' : 'Socio'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default QR
