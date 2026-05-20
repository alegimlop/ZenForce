import { useState } from 'react'
import heroBg from '../assets/banner.png'
import imgEsfuerzo from '../assets/esfuerzo.png'
import imgComunidad from '../assets/comunidad.png'
import imgEquilibrio from '../assets/equilibrio.png'
import imgExcelencia from '../assets/excelencia.png'
import '../styles/SobreNosotros.css'

const valores = [
    { titulo: 'Esfuerzo', texto: 'Cada repetición cuenta. El progreso llega con constancia y dedicación diaria.', imagen: imgEsfuerzo },
    { titulo: 'Comunidad', texto: 'Somos una familia. Aquí todos se apoyan, desde el primer día hasta el último récord.', imagen: imgComunidad },
    { titulo: 'Equilibrio', texto: 'Cuerpo y mente van de la mano. Entrenamos fuerte, pero también respetamos el descanso.', imagen: imgEquilibrio },
    { titulo: 'Excelencia', texto: 'Instalaciones de primer nivel, entrenadores certificados y programas actualizados.', imagen: imgExcelencia },
]

function SobreNosotros() {
    const [valorAbierto, setValorAbierto] = useState(null)

    const toggleValor = (index) => {
        setValorAbierto(valorAbierto === index ? null : index)
    }

    return (
        <div className="contenedor-sobre-nosotros">

            <div className="banner-principal" style={{ backgroundImage: `url(${heroBg})` }}>
                <div className="overlay-banner">
                    <h1>SOBRE <span className="resalte">NOSOTROS</span></h1>
                    <p>Más que un gimnasio. Un estilo de vida.</p>
                </div>
            </div>

            <div className="contenido-pagina">

                <div className="seccion-fundadores">
                    <h2>LOS <span className="resalte">FUNDADORES</span></h2>
                    <div className="cuadricula-fundadores">
                        <div className="tarjeta-fundador">
                            <h3>Cristian</h3>
                            <p>Cristian empezó a entrenar con 16 años sin saber que aquello cambiaría su vida. Lo que comenzó como una afición se convirtió en una vocación. Años después, con la formación y la experiencia necesarias, decidió que era hora de crear algo propio: un lugar donde la gente se sintiese como él se sintió la primera vez que pisó un gimnasio.</p>
                        </div>
                        <div className="tarjeta-fundador">
                            <h3>Alejandro</h3>
                            <p>Alejandro llegó al gimnasio de joven buscando ganar confianza en sí mismo. Allí conoció a Cristian, y entre serie y serie nació una amistad que duraría para siempre. Con una cabeza muy orientada a los negocios y una pasión igual de grande por el deporte, fue el complemento perfecto para dar vida a ZenForce.</p>
                        </div>
                    </div>
                    <p className="nota-fundadores">Dos amigos, un sueño compartido y muchas horas de trabajo.</p>
                </div>

                <div className="seccion-cifras">
                    <div className="cifra">
                        <span className="numero">+800</span>
                        <span className="etiqueta-cifra">Socios activos</span>
                    </div>
                    <div className="cifra">
                        <span className="numero">15</span>
                        <span className="etiqueta-cifra">Entrenadores titulados</span>
                    </div>
                    <div className="cifra">
                        <span className="numero">+30</span>
                        <span className="etiqueta-cifra">Clases semanales</span>
                    </div>
                    <div className="cifra">
                        <span className="numero">7</span>
                        <span className="etiqueta-cifra">Años de experiencia</span>
                    </div>
                </div>

                <div className="seccion-valores">
                    <h2>NUESTROS <span className="resalte">VALORES</span></h2>
                    <div className="cuadricula-valores">
                        {valores.map((valor, index) => (
                            <div
                                key={index}
                                className={`tarjeta-valor ${valorAbierto === index ? 'abierta' : ''}`}
                                onClick={() => toggleValor(index)}
                            >
                                {valorAbierto === index ? (
                                    <>
                                        <h3>{valor.titulo}</h3>
                                        <p>{valor.texto}</p>
                                    </>
                                ) : (
                                    <img src={valor.imagen} alt={valor.titulo} className="imagen-valor" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="seccion-horarios">
                    <h2>HORARIOS</h2>
                    <div className="tabla-horarios">
                        <div className="fila-horario cabecera-horario">
                            <span>Día</span>
                            <span>Apertura</span>
                            <span>Cierre</span>
                        </div>
                        <div className="fila-horario">
                            <span>Lunes — Viernes</span>
                            <span>07:00</span>
                            <span>23:00</span>
                        </div>
                        <div className="fila-horario">
                            <span>Sábado</span>
                            <span>08:00</span>
                            <span>21:00</span>
                        </div>
                        <div className="fila-horario">
                            <span>Domingo</span>
                            <span>09:00</span>
                            <span>15:00</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SobreNosotros
