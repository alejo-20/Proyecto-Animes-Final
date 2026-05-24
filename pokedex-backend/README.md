# Pokedex Backend

API REST para gestionar animes y personajes con autenticación mediante Supabase.

## Tecnologías

- Node.js + Express 5
- Supabase (Auth + PostgreSQL + Storage)
- Swagger (OpenAPI 3.0)
- Docker + Docker Compose
- SonarQube (análisis de código)

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 22+ (para desarrollo local)
- Copiar `.env` (solicitar al equipo)

## Inicio rápido con Docker Compose

Desde la raíz del proyecto (`proyectoFinal/`), levanta todo junto:

```bash
docker compose up -d
```

Esto inicia:
- **Backend** → `http://localhost:3000`
- **Frontend** → `http://localhost:8080`
- **SonarQube** → `http://localhost:9000`
- **PostgreSQL** (para SonarQube)

Para ver logs:

```bash
docker compose logs -f
```

Para detener:

```bash
docker compose down
```

> Si solo quieres reconstruir el backend después de cambios:
> ```bash
> docker compose up -d --build backend
> ```

## Inicio local (desarrollo)

```bash
npm install
npm start
```

## Documentación de la API (Swagger)

Una vez corriendo el servidor:

```
http://localhost:3000/api/docs
```

Interfaz interactiva para probar todos los endpoints. CORS está habilitado para todos los orígenes (`*`).

## Análisis de código con SonarQube

### Opción 1: Usando Docker Compose (recomendado)

Desde la raíz (`proyectoFinal/`), los servicios de SonarQube ya se levantan con `docker compose up -d`.

1. Esperar a que SonarQube esté listo (~1-2 min, desde `proyectoFinal/`):

```bash
docker compose logs -f sonarqube
```

2. Acceder a `http://localhost:9000`
3. Login: `admin` / `admin` (cambiar contraseña la primera vez)
4. Ir a **Your Account → Security → Generate Tokens**
5. Crear un token (ej: `pokedex-scanner`) y copiarlo
6. Ejecutar el análisis desde `pokedex-backend/`:

```powershell
cd pokedex-backend
docker run --rm -e "SONAR_HOST_URL=http://host.docker.internal:9000" -e "SONAR_TOKEN=TU_TOKEN" -v "${PWD}:/usr/src" sonarsource/sonar-scanner-cli
```
```

### Opción 2: Análisis sin Docker Compose (solo SonarQube)

```bash
docker run -d --name sonarqube -p 9000:9000 -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true sonarqube:community
```

Luego seguir los pasos 2-6 de la Opción 1.

### Ver resultados

Los resultados del análisis se ven en `http://localhost:9000`.

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| GET | `/api/animes` | No | Listar animes |
| GET | `/api/animes/:id` | No | Anime por ID + personajes |
| POST | `/api/animes` | Sí | Crear anime |
| PUT | `/api/animes/:id` | Sí | Actualizar anime |
| DELETE | `/api/animes/:id` | Sí | Eliminar anime |
| POST | `/api/animes/:id/personajes` | Sí | Crear personaje |
| PUT | `/api/personajes/:id` | Sí | Actualizar personaje |
| DELETE | `/api/personajes/:id` | Sí | Eliminar personaje |
| GET | `/api/:anime` | No | Personajes por slug |
| GET | `/api/:anime/:nombre` | No | Personaje por slug + nombre |

## Probar endpoints con PowerShell (CORS habilitado)

### Autenticación

```powershell
# Registrar
$body = @{ email = "test@ejemplo.com"; password = "MiPassword123"; nombre = "Test" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"

# Iniciar sesión
$body = @{ email = "test@ejemplo.com"; password = "MiPassword123" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $login.session.access_token
```

### Animes

```powershell
# Listar animes
Invoke-RestMethod -Uri "http://localhost:3000/api/animes" -Method Get

# Crear anime (autenticado)
$body = @{ nombre = "Saint Seiya"; descripcion = "Caballeros del Zodiaco" } | ConvertTo-Json
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3000/api/animes" -Method Post -Body $body -ContentType "application/json" -Headers $headers

# Obtener anime por ID
Invoke-RestMethod -Uri "http://localhost:3000/api/animes/1" -Method Get

# Actualizar anime
$body = @{ nombre = "Saint Seiya (Actualizado)" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/animes/1" -Method Put -Body $body -ContentType "application/json" -Headers $headers

# Eliminar anime
Invoke-RestMethod -Uri "http://localhost:3000/api/animes/1" -Method Delete -Headers $headers
```

### Personajes

```powershell
# Crear personaje en anime (autenticado)
$body = @{ nombre = "Seiya"; descripcion = "Caballero de Pegaso" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/animes/1/personajes" -Method Post -Body $body -ContentType "application/json" -Headers $headers

# Consulta pública por slug
Invoke-RestMethod -Uri "http://localhost:3000/api/saint-seiya" -Method Get

# Consulta pública por slug + nombre
Invoke-RestMethod -Uri "http://localhost:3000/api/saint-seiya/Seiya" -Method Get

# Actualizar personaje (autenticado)
$body = @{ habilidades = "Meteoros de Pegaso" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/personajes/1" -Method Put -Body $body -ContentType "application/json" -Headers $headers

# Eliminar personaje (autenticado)
Invoke-RestMethod -Uri "http://localhost:3000/api/personajes/1" -Method Delete -Headers $headers
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_KEY` | Clave anónima de Supabase |
| `SUPABASE_SERVICE_KEY` | Clave service_role de Supabase |
| `SERVER_URL` | URL del servidor (para Swagger) |
| `PORT` | Puerto del servidor (default: 3000) |
