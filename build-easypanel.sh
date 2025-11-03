#!/bin/bash

# Script de Build Optimizado para EasyPanel
# Maneja variables de entorno y errores de forma robusta

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función de logging
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Configuración
CONTAINER_NAME="estudios-socioeconomicos-app"
IMAGE_NAME="estudios-socioeconomicos"
DOMAIN="${DOMAIN:-localhost}"

log "=== BUILD OPTIMIZADO PARA EASYPANEL ==="

# Verificar variables críticas
info "Verificando variables de entorno..."

if [ -z "$VITE_APPWRITE_API_KEY" ]; then
    error "VITE_APPWRITE_API_KEY no está definida"
    error "Configura esta variable en EasyPanel antes del deployment"
    exit 1
fi

if [ ${#VITE_APPWRITE_API_KEY} -lt 100 ]; then
    warning "API Key parece muy corta (${#VITE_APPWRITE_API_KEY} caracteres)"
fi

log "✅ Variables de entorno verificadas"
log "Host: $VITE_APPWRITE_HOST"
log "Project ID: ${VITE_APPWRITE_PROJECT_ID:0:10}..."

# Crear imagen Docker
log "Iniciando build de imagen Docker..."
docker build \
    --build-arg VITE_APPWRITE_HOST="$VITE_APPWRITE_HOST" \
    --build-arg VITE_APPWRITE_PROJECT_ID="$VITE_APPWRITE_PROJECT_ID" \
    --build-arg VITE_APPWRITE_API_KEY="$VITE_APPWRITE_API_KEY" \
    -t $IMAGE_NAME:latest \
    -t $IMAGE_NAME:build-$(date +%Y%m%d-%H%M%S) \
    .

if [ $? -eq 0 ]; then
    log "✅ Build de imagen completado exitosamente"
else
    error "❌ Build de imagen falló"
    exit 1
fi

# Verificar que el build produjo archivos
log "Verificando resultado del build..."
if [ ! -f "dist/index.html" ]; then
    error "dist/index.html no encontrado - Build puede haber fallado"
    exit 1
fi

log "✅ Verificación del build exitosa"
log "Tamaño de la imagen: $(docker images $IMAGE_NAME:latest --format 'table {{.Size}}' | tail -n +2)"
log "Archivos en dist/: $(find dist/ -type f | wc -l) archivos"

# Stop y remove container existente si existe
log "Preparando container..."
if docker ps -a | grep -q $CONTAINER_NAME; then
    log "Deteniendo container existente..."
    docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
    docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
fi

# Ejecutar container
log "Iniciando container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 80:80 \
    -e NODE_ENV=production \
    $IMAGE_NAME:latest

if [ $? -eq 0 ]; then
    log "✅ Container iniciado exitosamente"
else
    error "❌ Error al iniciar container"
    exit 1
fi

# Health check
log "Ejecutando health check..."
sleep 5
if curl -f -s http://localhost:80 > /dev/null; then
    log "✅ Health check exitoso - Aplicación funcionando en puerto 80"
else
    warning "Health check falló - La aplicación puede necesitar más tiempo para iniciar"
fi

log "=== DEPLOYMENT COMPLETADO ==="
log "Container: $CONTAINER_NAME"
log "Imagen: $IMAGE_NAME:latest"
log "Puerto: 80"
log "URL: http://localhost (o tu dominio configurado)"
log "Logs: docker logs $CONTAINER_NAME"
log "Estado: docker ps | grep $CONTAINER_NAME"

info "Para verificar logs: docker logs -f $CONTAINER_NAME"
info "Para restart: docker restart $CONTAINER_NAME"
