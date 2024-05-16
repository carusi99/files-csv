# Files CSV

Este proyecto presenta una API RESTful que simula un ámbito de trabajo para el ingreso de datos de usuarios , permitiendo a un "admin", insertar los usuarios desde un archivo csv. La API maneja diferentes operaciones basadas en la autenticación y la autorización del usuario.

## Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Endpoints](#endpoints)
5. [Ejemplos de Solicitudes](#ejemplos-de-solicitudes)
6. [Autenticación](#Autenticación)
7. [Contribuciones](#contribuciones)
8. [Licencia](#licencia)

## Requisitos

Es necesario tener Node.js, npm, y PostgreSQL instalados en tu entorno de desarrollo.

### dependencias utilizadas 

    "bcrypt": "^5.1.1",
    "csv": "^6.3.9",
    "csv-parse": "^5.5.6",
    "dotenv": "^16.3.1",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.5",
    "umzug": "^3.8.0",
    "vitest": "^1.6.0",
    "zod": "^3.23.4"


## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/carusi99/files-csv.git
cd red-social-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura la conexión a la base de datos en el archivo .env, se muestra un ejemplo en el archivo .env.example .
4. Ejecuta un reset de las migraciones con umzug:

```bash
npm run db:reset
```

5. Inicia el servidor:

```bash
npm run dev
```

## Configuración

Para configurar correctamente tu entorno de desarrollo, necesitarás crear un archivo `.env` en la raíz del proyecto y establecer las siguientes variables de entorno.

### ejemplo:

```plaintext
# Contenido del archivo .env

# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_NAME=mi_base_de_datos
DB_PORT=5432
DB_USER=mi_usuario
DB_PASSWORD=mi_contraseña
DB_ADMIN_DATABASE=mi_database_admin

# Configuración del token JWT
JWT_SECRET=mi_secreto
COST_FACTOR=10
```

Asegúrate de proporcionar valores específicos para cada variable según los requisitos de tu aplicación.

## Estructura del proyecto

La aplicación sigue una arquitectura de tres capas:

- **Routers:** Define las rutas y maneja las solicitudes HTTP.
- **Servicios:** Contiene la lógica de negocio y se comunica con la capa de acceso a datos.
- **Acceso a Datos:** Gestiona las interacciones con la base de datos PostgreSQL utilizando pg.

## Endpoints

#### POST /signup (Crear Cuenta)

- **Descripción**: Permite a un nuevo usuario registrarse en la plataforma.
- **Body**:  `name`, `password`, `email`, `role` - Campos requeridos para el registro.
- **Respuesta**: Crea una nueva cuenta y devuelve la información del usuario registrado.

#### POST /login (Iniciar Sesión)

- **Descripción**: Permite a un usuario existente iniciar sesión.
- **Body**: `password`, `email` - Credenciales requeridas para el inicio de sesión.
- **Respuesta**: Inicia sesión y devuelve un token JWT.

### Gestión de ingreso de usuarios

#### POST / upload (Archivo CSV)

- **Descripción**: Permite a un usuario autenticado y autorizado con el rol de admin, ingresar usuarios a la base de datos.
- **Respuesta**: Se muestran los usuarios ingresados correctamente que se incorporan a la base de datos y los que no ingresan por errores al traspasarlos.

## Ejemplos de solicitudes

#### Registro y Autenticación de Usuarios

##### POST /signup (Crear Cuenta)

- **Descripción**: Permite a un nuevo usuario registrarse en la plataforma.
- **Body**:
  - `name`, `password`, `email`, `role`  : Campos requeridos para el registro.
- **Respuesta**:
  - `201 Created`: usuario registrado exitosamente.
  - `400 Bad Request`: Si falta información o el formato es incorrecto.
  - **Ejemplo de Respuesta**:
```json
  {
  "ok": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 9,
    "name": "viviana",
    "email": "viviana@gmail.com",
    "role": "admin"
  }
}
```

##### POST /login (Iniciar Sesión)

- **Descripción**: Permite a un usuario existente iniciar sesión.
- **Body**:
  -  `password`, `email`: Credenciales requeridas para el inicio de sesión.
- **Respuesta**:
  - `200 OK`: Sesión iniciada, retorna token JWT.
  - `401 Unauthorized`: Credenciales incorrectas.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5..."
      }
    }
    ```

#### Gestión de Archivos CSV 

##### POST /upload (ver archivos preocesados y no procesados)

**Descripción:** Muestra el perfil de los usuarios que están igresados de manera correcta a la base de datos, y los que no.

**Respuesta:**

- 200 OK: Información de los perfiles en formato JSON (correctos y con errores).
- 401 Unauthorized: Si el usuario no está autenticado ni autorizado.

**Ejemplo de Respuesta:**

```json
{
  "ok": true,
  "data": {
    "success": [
      {
        "name": "Juan Perez",
        "email": "juan.perez@example.com",
        "age": 28,
        "role": "user"
      },
      {
        "name": "Maria Lopez",
        "email": "maria.lopez@example.com",
        "age": 35,
        "role": "user"
      },
      {
        "name": "Carlos Gomez",
        "email": "carlos.gomez@example.com",
        "age": 42,
        "role": "user"
      },
      {
        "name": "Ana Martinez",
        "email": "ana.martinez@example.com",
        "age": 30,
        "role": "user"
      },
      {
        "name": "Roberto Hernandez",
        "email": "roberto.hernandez@example.com",
        "age": 18,
        "role": "user"
      },
      {
        "name": "Luisa Fernandez",
        "email": "luisa.fernandez@example.com",
        "age": 50,
        "role": "user"
      }
    ],
    "errors": [
      {
        "row": 5,
        "details": {
          "name": "The 'name' field cannot be a number or empty string",
          "email": "Email format is invalid, missing @"
        }
      },
      {
        "row": 8,
        "details": {
          "name": "The 'name' field cannot be a number or empty string",
          "email": "Email format is invalid, missing @",
          "age": "Expected number, received nan"
        }
      },
      {
        "row": 9,
        "details": {
          "name": "The 'name' field cannot be a number or empty string",
          "email": "Email format is invalid, missing @",
          "age": "The 'age' field must be a positive number"
        }
      }
    ]
  }
}
```

## Autenticación

En este proyecto, utilizamos JSON Web Token (JWT) para gestionar la autenticación. JWT es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir información de manera segura entre las partes como un objeto JSON. En el contexto de la autenticación, JWT se utiliza para generar tokens que pueden ser verificados para asegurar la identidad del usuario.

### Cómo Funciona

1. **Generación del Token:**

   - Cuando un usuario se autentica con éxito, se genera un JWT que contiene información sobre el usuario y posiblemente otros datos relevantes.

2. **Envío del Token:**

   - El token JWT se envía al cliente, generalmente como parte de la respuesta después de una autenticación exitosa.

3. **Almacenamiento del Token:**

   - El cliente almacena el token, generalmente en el almacenamiento local o en las cookies, para incluirlo en las solicitudes posteriores a recursos protegidos.

4. **Verificación del Token:**
   - En cada solicitud a un recurso protegido, el servidor verifica la validez del token JWT recibido. Si el token es válido, se permite el acceso al recurso protegido.

## Contribuciones

Si deseas contribuir al desarrollo de esta API, simplemente realiza un Pull Request con tus cambios y para que sean revisados, además me puedes contactar, con gusto te responderé paolapachecocarusi@gmail.com

