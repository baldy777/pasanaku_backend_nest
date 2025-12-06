# pasanaku-backend

API REST para gestionar grupos de pasanaku, turnos, aportes y usuarios.

# Descripción del proyecto

Este proyecto es un backend desarrollado con NestJS que usa una arquitectura por capas donde se dividen por modulos. Permite gestionar usuarios, grupos, turnos, aportes, invitaciones y verificacion por correo electrónico.
Usa MySQL como base de datos, JWT para autenticación y TypeORM como ORM.

# Nota

Para ingresar como administrador, configurar en archivo con ruta:

pasanaku_backend_nest\src\database\seedUsuarios\seedUsuario.ts

- datos por defecto para login

correo = somartorrencial@gmail.com (cambiar a consideracion personal)

contraseña = unicornio3000 (cambiar a consideracion personal)

# Tecnologías principales

- Backend

- NestJS — v11.0.10

- Node.js / TypeScript

- NestJS REST API

- Estructura modular (modules/, controllers/, services/, repositories/, entities/)

- TypeORM

- Nodemailer (para envío de correos)

- Autenticación

- JWT (JSON Web Tokens)

- Guards, Strategies y Decorators personalizados

- Base de datos en MySQL

# Instalación

1. Clonar el repositorio

git clone https://github.com/tuusuario/pasanaku-backend.git

ingresar a la carpeta

cd pasanaku-backend

- este comando abre en vs code si lo tiene instalado y si no lo tiene, instalar de la sigueinte ruta https://code.visualstudio.com/

code .

2. Instalar dependencias

pnpm install

# Variables de entorno

Crear un archivo .env en la raíz del proyecto o copiar el .env.example:

MYSQL_HOST=localhost
MYSQL_DATABASE=nombre_base_de_datos
MYSQL_USER=nombre_usuario
MYSQL_PASSWORD=contraseña_base_de_datos
MYSQL_PORT=3306

JWT_SECRETO=contraseña_jwt

EMAIL_USUARIO=correo_de_institucion
EMAIL_PASSWORD=clave_otorgada_por_google
SERVICIO=gmail

# Ejecución del proyecto

Desarrollo (con recarga automática)

pnpm run setup

# Base de datos

Migraciones y sincronización (automática por TypeORM)

La configuración se administra desde app.module.ts.

Base de datos utilizada:

Motor: MySQL
