import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'
import '../styles/inicio.css'

function Inicio() {
    const [membresias, setMembresias] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${API_URL}/suscripciones`)
            .then(res => setMembresias(res.data))
    }, [])

    return (
        <div className="contenedor-inicio">

            <div className="hero-inicio">
                <p className="eslogan-hero">El gimnasio que te lleva al límite</p>
                <h1 className="titulo-hero">ZENFORCE</h1>
                <button className="boton-cta-hero" onClick={() => navigate('/registro')}>
                    Únete ahora →
                </button>
            </div>

            <div className="seccion-funciones">
                <h2 className="titulo-seccion">¿Qué puedes hacer aquí?</h2>
                <div className="lista-funciones">
                    <div className="item-funcion">
                        <span className="numero-funcion">01</span>
                        <div className="texto-funcion">
                            <h3>Clases</h3>
                            <p>Consulta todas las clases disponibles, elige la que más te guste e inscríbete en segundos.</p>
                        </div>
                    </div>
                    <div className="item-funcion">
                        <span className="numero-funcion">02</span>
                        <div className="texto-funcion">
                            <h3>Foro</h3>
                            <p>Comparte experiencias, resuelve dudas y conecta con otros socios de ZenForce.</p>
                        </div>
                    </div>
                    <div className="item-funcion">
                        <span className="numero-funcion">03</span>
                        <div className="texto-funcion">
                            <h3>Mi carnet</h3>
                            <p>Accede a tu código QR personal y úsalo para entrar al gimnasio de forma rápida.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="seccion-membresias-inicio">
                <div className="cabecera-seccion-membresias">
                    <h2>Nuestras membresías</h2>
                    <p className="subtitulo-seccion">Elige el plan que mejor se adapte a ti.</p>
                </div>
                <div className="cuadricula-membresias">
                    {membresias.map(m => (
                        <div key={m.id} className="tarjeta-membresia">
                            <h3>{m.nombre}</h3>
                            <p className="precio-membresia">{m.precio}€<span>/mes</span></p>
                            <p className="duracion-membresia">{m.duracion_dias} días</p>
                            {m.descripcion && <p className="descripcion-membresia">{m.descripcion}</p>}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Inicio
