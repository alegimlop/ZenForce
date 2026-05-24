# ZenForce

ZenForce es una aplicación web para la gestión de un gimnasio. Cuenta con un sistema de registro e inicio de sesión, gestión de membresías con formulario de pago, calendario de clases con inscripción, foro comunitario con publicaciones, comentarios y likes, acceso al gimnasio mediante código QR y un panel de administración completo para gestionar usuarios, clases, membresías y el foro.

## Tecnologías utilizadas

### Frontend
- **React + Vite** — librería principal para construir la interfaz de usuario
- **React Router DOM** — navegación entre páginas
- **Axios** — peticiones HTTP a la API
- **qrcode.react** — generación del código QR del carnet de socio
- **Google Translate** — widget de traducción al inglés

### Backend
- **Node.js + Express** — servidor y API REST
- **MySQL2** — driver de Node.js que permite conectar el backend con la base de datos MySQL alojada en Railway
- **bcrypt** — encriptación de contraseñas

### Base de datos
- **MySQL en Railway** — base de datos en la nube

## Funcionalidades

### Usuario
- Registro e inicio de sesión
- Perfil personal con edición de datos y cambio de contraseña
- Eliminar cuenta
- Contratación de membresías con formulario de pago simulado
- Cancelar suscripción
- Calendario de clases con inscripción y cancelación
- Código QR personal para acceso al gimnasio
- Foro con publicaciones, comentarios y likes
- Filtros en el foro: todos, mis posts, mis likes, mis comentarios
- Traducción al inglés

### Administrador
- Panel de administración con dashboard
- Gestión completa de usuarios
- Gestión completa de clases
- Gestión de membresías y suscripciones
- Gestión del foro

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/alegimlop/ZenForce.git
cd ZenForce
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:
DB_HOST=kodama.proxy.rlwy.net
DB_USER=root
DB_PASSWORD=spJoMMXlkDeiNMlrVvolqMZcWEcISliP
DB_NAME=railway
DB_PORT=46089
PORT=3000
JWT_SECRET=zenforce_secret_key

### 3. Configurar el frontend

```bash
cd frontend
npm install
```

Crea un archivo `src/config.js` con el siguiente contenido:

```javascript
const API_URL = 'http://localhost:3000/api'

export default API_URL
```

## Lanzar la aplicación

**Backend:**
```bash
cd backend
node index.js
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Abre el navegador en `http://localhost:5173`