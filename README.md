# Anime Characters App

Proyecto compuesto por un **backend API** (Express + Supabase) y un **frontend mobile/web** (Expo React Native).

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git

## Despliegue local

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd proyectofinal

# Construir y levantar todos los servicios
docker compose up --build
```

Esto levanta dos contenedores:

| Servicio | URL |
|----------|-----|
| Backend API | http://localhost:3000 |
| Documentación Swagger | http://localhost:3000/api/docs |
| Frontend Web | http://localhost:8080 |

## Variables de entorno

El backend requiere un archivo `.env` en `pokedex-backend/` con las siguientes variables:

```
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_SERVICE_KEY=...
PORT=3000
```

## Comandos útiles

```bash
# Ver contenedores activos
docker ps

# Ver logs de un servicio específico
docker compose logs backend
docker compose logs frontend

# Detener servicios
docker compose down

# Reconstruir imágenes desde cero
docker compose build --no-cache
```

## Comandos útiles

```bash
# Ver contenedores activos
docker ps

# Ver logs de un servicio específico
docker compose logs backend
docker compose logs frontend

# Detener servicios
docker compose down

# Reconstruir imágenes desde cero
docker compose build --no-cache
```

## Análisis de calidad con SonarQube

Espera ~1 minuto y abre http://localhost:9000. Las credenciales por defecto son `admin` / `admin`.

### 2. Crear el proyecto

1. En SonarQube ve a **Projects → Create Project → Local project**
2. Usa `pokedex-backend` como **Project key**
3. Genera un token en **My Account → Security → Generate Token** (tipo *Global Analysis Token*)

### 3. Correr el scanner

Desde la carpeta `pokedex-backend/` en CMD:

```cmd
docker run --rm ^
  -e "SONAR_HOST_URL=http://host.docker.internal:9000" ^
  -e "SONAR_TOKEN=<tu-token>" ^
  -v "%cd%:/usr/src" ^
  sonarsource/sonar-scanner-cli
```

> **Nota:** reemplaza `<tu-token>` por el token generado en el paso anterior. Nunca subas el token real al repositorio.

### 4. Ver resultados

Una vez finalizado el análisis, abre http://localhost:9000/dashboard?id=pokedex-backend para ver el reporte de calidad.