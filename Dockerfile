# Multi-stage build para optimizar el tamaño de la imagen
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias primero para mejor cache
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias usando pnpm
RUN pnpm install --frozen-lockfile --prefer-offline

# Copiar el resto del código fuente
COPY . .

# Variables de entorno para build de producción
ENV NODE_ENV=production
ENV VITE_APPWRITE_HOST=https://aw.chamba.pro
ENV VITE_APPWRITE_PROJECT_ID=69083e13001189dca41d
ENV VITE_APPWRITE_API_KEY=standard_09b5a82f8feb46cd48fdb27f5a14d106ee35a5291dcee365e44149fc7ad9abd5a740c1c7b08518c4085c241c2b17d7d7ac440f7a689940b111c094517c25fcd5002cf6c478ee96cbc19157edeb02434de2edec878e6a1e7b67982d1835c569ca7ea23fd0d9f951efa88c2903d53fe5ae1114a81e60d24ca2c49cb3c76789870c

# Build de producción
RUN pnpm run build

# Stage final - imagen mínima para servir
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar serve globalmente para servir archivos estáticos
RUN npm install -g serve

# Copiar solo los archivos necesarios del build
COPY --from=builder /app/dist ./dist

# Crear usuario no-root para mejor seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar propiedad de los archivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 80

# Comando por defecto para servir la aplicación
CMD ["serve", "-s", "dist", "-p", "80", "--host", "0.0.0.0"]