🌟 Plataforma de Donaciones Económicas — Ágape

Una plataforma web diseñada para conectar donantes con campañas reales y transparentes. Permite a usuarios y organizaciones publicar campañas solidarias y recibir aportes económicos de manera segura y accesible.

📌 Introducción

    Ágape es una plataforma de donaciones económicas desarrollada con un enfoque en:

        Transparencia en las transacciones

        Accesibilidad para donantes y organizaciones

        Experiencia de usuario simple y clara

        Impacto social real a través de campañas verificadas

🎯 Objetivos

    Facilitar la conexión entre donantes y campañas solidarias.

    Ofrecer una interfaz intuitiva y fácil de usar.

    Garantizar seguridad y transparencia en cada aporte.

    Fomentar la participación social mediante una comunidad solidaria.

🛠️ Tecnologías Utilizadas

    Área	Tecnologías
    Frontend	React, Vite, CSS
    Backend	NestJS, TypeORM
    Base de Datos	PostgreSQL (Supabase)
    Integraciones	Mercado Pago, Google OAuth

🚀 Funcionalidades Principales

    �� Usuarios y Roles

        Usuarios: Registrarse, explorar campañas, crear campañas y donar.

        Organizaciones: Creación, gestión y promoción de campañas.

        Administradores: Moderación, verificación de campañas y control de transacciones.

    ⚙️ Funciones Generales

        Registro y autenticación de usuarios.

        Creación, edición y eliminación de campañas.

        Donaciones y visualización de campañas activas.

        Historial de donaciones.

📁 Secciones del Sitio
    🏠 Home

        Campañas destacadas y recientes.

        Categorías: dinero, ropa, alimentos, insumos médicos, etc.

        Ranking de campañas más exitosas.

    �� Página de Campaña

        Título, imagen, descripción y meta.

        Progreso de recaudación.

        Botón para donar.

    �� Perfil del Usuario / Campaña

        Usuarios: datos personales + historial de donaciones.

        Campañas: datos + historial de aportes recibidos.

    �� Contacto

        Formulario para comunicarse con el equipo administrador.

🗄️ Base de Datos
    Entidades Principales

        Usuario

        Campaña

        Donación

📌 Estructura de Tablas
    🧍 Usuario

        id

        nombre

        apellido

        email

        contraseña

      �� Campaña

        id

        nombre

        desc

        tipo

        objetivo

        recaudado

        fecha_inicio

        activo

        id_fk (usuario creador)

      �� Donación

        id

        fecha

        monto

        id_fk1 (usuario donante)

        id_fk2 (campaña)


🔮 Futuras Mejoras — Ágape v2.0

    Mercado Pago Connect: Conexión mediante OAuth 2.0 para dispersión automática y cobro en tiempo real.

    Más Pasarelas de Pago: Nuevos métodos de pago para más flexibilidad.

    Gestión Multimedia: Carga de imágenes personalizadas por campaña.

    Interacción Social: Comentarios y reacciones en tiempo real.

    Multi-Campaña: Un usuario podrá administrar múltiples causas.



🧩 Instrucciones para Correr el Proyecto Localmente

    �� Requisitos Previos

      Node.js v18+

      Base de datos: PostgreSQL o MySQL

      npm (incluido con Node)

🖥️ Frontend (Cliente)

    �� Clonar repositorio
        git clone <url_frontend>
        cd <nombre_carpeta>
        npm install

    ⚙️ Variables de Entorno

        Crear un archivo .env en la raíz:

        VITE_API_URL=http://localhost:3000
        VITE_GOOGLE_CLIENT_ID=tu_google_client_id

    ▶️ Iniciar aplicación
      npm run dev

    La app estará disponible en:
    �� http://localhost:5173

🛠️ Backend (Servidor)

    �� Clonar repositorio
        git clone <url_backend>
        cd <nombre_carpeta>
        npm install

    ⚙️ Variables de Entorno

      Crear un archivo .env:

      DB_HOST=localhost
      DB_PORT=5432
      DB_USERNAME=root
      DB_PASSWORD=tu_password
      DB_DATABASE=tu_db

      JWT_SECRET=tu_secreto_super_seguro
      GOOGLE_CLIENT_ID=tu_google_client_id
      GOOGLE_CLIENT_SECRET=tu_google_secret

      MERCADOPAGO_ACCESS_TOKEN=tu_token_de_prueba

    ▶️ Iniciar servidor
      npm run start:dev
S
    El backend correrá en:
    👉 http://localhost:3000
