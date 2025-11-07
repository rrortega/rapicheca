# Dockerfile - Versión Ultra-Simple
# Sin variables sensibles, sin dependencias complejas

FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --no-frozen-lockfile --prefer-offline

# Copiar código fuente
COPY . .

# Variables básicas (sin API keys)
ENV NODE_ENV=production

# Build simple (sin verificación de tipos)
RUN npm run build

# Verificar build
RUN [ -f "dist/index.html" ] || (echo "Build failed" && exit 1)

# Imagen final
FROM node:18-alpine

WORKDIR /app

# Instalar serve
RUN npm install -g serve

# Copiar build
COPY --from=builder /app/dist ./dist

# Seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 80

# Comando
CMD ["serve", "-s", "dist", "-p", "80", "--host", "0.0.0.0"]
