# Dockerfile - Versión Corregida
# Multi-stage build optimizado y seguro
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Args para variables de build (más seguro que ENV)
ARG VITE_APPWRITE_HOST
ARG VITE_APPWRITE_PROJECT_ID
ARG VITE_APPWRITE_API_KEY

# Establecer variables por defecto si no se proporcionan
ENV VITE_APPWRITE_HOST=${VITE_APPWRITE_HOST:-https://aw.chamba.pro}
ENV VITE_APPWRITE_PROJECT_ID=${VITE_APPWRITE_PROJECT_ID:-69083e13001189dca41d}
ENV VITE_APPWRITE_API_KEY=${VITE_APPWRITE_API_KEY}

# Verificar que las variables críticas están definidas
RUN echo "=== VERIFICANDO VARIABLES ===" && \
    echo "Host: $VITE_APPWRITE_HOST" && \
    echo "Project ID: $VITE_APPWRITE_PROJECT_ID" && \
    echo "API Key: ${VITE_APPWRITE_API_KEY:0:20}..."

# Copiar archivos de dependencias primero para mejor cache
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --no-frozen-lockfile --prefer-offline

# Copiar el resto del código fuente
COPY . .

# Build de producción con mejor manejo de errores
RUN echo "=== INICIANDO BUILD ===" && \
    echo "Node Environment: $NODE_ENV" && \
    echo "Build starting..." && \
    pnpm run build && \
    echo "=== BUILD COMPLETADO ===" && \
    ls -la dist/

# Stage final - imagen mínima para servir
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar serve globalmente para servir archivos estáticos
RUN npm install -g serve

# Copiar solo los archivos necesarios del build
COPY --from=builder /app/dist ./dist

# Verificar que el build fue exitoso
RUN ls -la dist/ && \
    echo "=== VERIFICANDO DIST ===" && \
    [ -f "dist/index.html" ] || (echo "ERROR: index.html not found!" && exit 1)

# Crear usuario no-root para mejor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar propiedad de los archivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 80

# Comando por defecto para servir la aplicación
CMD ["serve", "-s", "dist", "-p", "80", "--host", "0.0.0.0"]
