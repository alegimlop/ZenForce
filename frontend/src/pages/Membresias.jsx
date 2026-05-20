import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../config'

function Membresias() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const [membresias, setMembresias] = useState([])
    const [seleccionada, setSeleccionada] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [form, setForm] = useState({
        titular: '', numero: '', caducidad: '', cvv: ''
    })

    useEffect(() => {
        axios.get(`${API_URL}/suscripciones`)
            .then(res => setMembresias(res.data))
    }, [])

    const handleSeleccionar = (membresia) => {
        setSeleccionada(membresia)
        setMensaje('')
        setForm({ titular: '', numero: '', caducidad: '', cvv: '' })
    }

    const handlePago = async (e) => {
        e.preventDefault()

        const numeroLimpio = form.numero.replace(/\s/g, '')
        if (numeroLimpio.length !== 16 || isNaN(numeroLimpio)) {
            alert('Número de tarjeta no válido')
            return
        }

        const caducidadRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
        if (!caducidadRegex.test(form.caducidad)) {
            alert('Formato de fecha incorrecto, usa MM/AA')
            return
        }

        const [mes, anio] = form.caducidad.split('/')
        const ahora = new Date()
        const expiracion = new Date(2000 + parseInt(anio), parseInt(mes))
        if (expiracion <= ahora) {
            alert('La tarjeta ha caducado')
            return
        }

        if (form.cvv.length !== 3 || isNaN(form.cvv)) {
            alert('CVV no válido')
            return
        }

        if (form.titular.trim().length < 3) {
            alert('Introduce el nombre del titular')
            return
        }

        try {
            const perfilRes = await axios.get(`${API_URL}/perfil/${usuario.id}`)
            if (perfilRes.data.membresia) {
                alert('Ya tienes una suscripción activa. Cancélala desde tu perfil para cambiarla.')
                setSeleccionada(null)
                return
            }

            const fechaInicio = new Date().toISOString().split('T')[0]
            const fechaFin = new Date(Date.now() + seleccionada.duracion_dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

            await axios.post(`${API_URL}/suscripciones/asignar`, {
                usuario_id: usuario.id,
                membresia_id: seleccionada.id,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            })

            alert('¡Pago realizado! Ya eres socio de ZenForce.')
            setSeleccionada(null)
        } catch {
            alert('Algo ha ido mal, inténtalo de nuevo.')
        }
    }

    return (
        <div>
            <h1>Membresías</h1>
            <p>Elige el plan que mejor se adapte a ti y empieza a entrenar hoy.</p>

            {mensaje && <p>{mensaje}</p>}

            <div>
                {membresias.map(m => (
                    <div key={m.id}>
                        <h2>{m.nombre}</h2>
                        <p>{m.precio}€/mes</p>
                        <p>{m.duracion_dias} días</p>
                        {m.descripcion && <p>{m.descripcion}</p>}
                        <button onClick={() => handleSeleccionar(m)}>Seleccionar</button>
                    </div>
                ))}
            </div>

            {seleccionada && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div>
                        <h2>Pago — {seleccionada.nombre}</h2>
                        <p>Total: <strong>{seleccionada.precio}€</strong></p>
                        <form onSubmit={handlePago}>
                            <label>Titular de la tarjeta</label>
                            <input type="text" value={form.titular} onChange={e => setForm({ ...form, titular: e.target.value })} required />
                            <label>Número de tarjeta</label>
                            <input type="text" maxLength={16} value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} required />
                            <label>Caducidad</label>
                            <input type="text" placeholder="MM/AA" maxLength={5} value={form.caducidad} onChange={e => setForm({ ...form, caducidad: e.target.value })} required />
                            <label>CVV</label>
                            <input type="text" maxLength={3} value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value })} required />
                            <div>
                                <button type="submit">Pagar</button>
                                <button type="button" onClick={() => setSeleccionada(null)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Membresias