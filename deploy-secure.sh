#!/bin/bash

# Deployment Script Sin Vulnerabilidades
# Configura variables de Appwrite de forma segura

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }
warning() { echo -e "${YELLOW}[WARNING] $1${NC}"; }

# Configuración
CONTAINER_NAME="estudios-socioeconomicos-app"
IMAGE_NAME="estudios-socioeconomicos"

log "=== DEPLOYMENT SIN VULNERABILIDADES ==="

# Configurar variables de Appwrite de forma segura
source ./setup-appwrite.sh

# Variables para el container
APPWRITE_HOST="$VITE_APPWRITE_HOST"
APPWRITE_PROJECT_ID="$VITE_APPWRITE_PROJECT_ID"  
APPWRITE_API_KEY="$VITE_APPWRITE_API_KEY"

log "Variables configuradas:"
log "Host: $APPWRITE_HOST"
log "Project ID: ${APPWRITE_PROJECT_ID:0:10}..."
log "API Key: ${APPWRITE_API_KEY:0:20}... (${#APPWRITE_API_KEY} chars)"

# Verificar que la API key es válida
if [ ${#APPWRITE_API_KEY} -lt 100 ]; then
    error "API Key inválida o muy corta"
    exit 1
fi

# Build de imagen sin variables sensibles
log "Iniciando build de imagen..."
docker build -t $IMAGE_NAME:latest -t $IMAGE_NAME:$(date +%Y%m%d-%H%M%S) .

if [ $? -eq 0 ]; then
    log "✅ Build completado exitosamente"
else
    error "❌ Build falló"
    exit 1
fi

# Parar y remover container existente
log "Preparando container..."
if docker ps -a | grep -q $CONTAINER_NAME; then
    log "Deteniendo container existente..."
    docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
    docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
fi

# Lanzar container con variables de runtime (más seguro)
log "Iniciando container con variables de runtime..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 80:80 \
    -e VITE_APPWRITE_HOST="$APPWRITE_HOST" \
    -e VITE_APPWRITE_PROJECT_ID="$APPWRITE_PROJECT_ID" \
    -e VITE_APPWRITE_API_KEY="$APPWRITE_API_KEY" \
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
    log "✅ Health check exitoso"
    log "🚀 Aplicación disponible en: http://localhost"
else
    warning "Health check falló - Verificar logs"
fi

log "=== DEPLOYMENT COMPLETADO ==="
log "Container: $CONTAINER_NAME"
log "Imagen: $IMAGE_NAME:latest"
log "Variables: Configuradas vía runtime (seguro)"
log ""
log "Para verificar:"
log "  Logs: docker logs -f $CONTAINER_NAME"
log "  Estado: docker ps | grep $CONTAINER_NAME"
log "  URLs: curl http://localhost"

echo ""
log "🔒 Seguridad: API keys manejadas en runtime, no en imagen Docker"
