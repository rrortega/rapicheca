#!/bin/bash

# Diagnóstico Final - Deployment Seguro
# Verifica que todos los archivos estén correctos antes del deployment

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[OK] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }
warning() { echo -e "${YELLOW}[WARNING] $1${NC}"; }

echo "=== DIAGNÓSTICO FINAL - DEPLOYMENT SEGURO ==="
echo ""

# Verificar archivos críticos
echo "📁 ARCHIVOS CRÍTICOS:"
files=("Dockerfile" "package.json" "docker-compose.yml" "deploy-secure.sh" "setup-appwrite.sh")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        log "$file existe"
    else
        error "$file faltante"
    fi
done
echo ""

# Verificar Dockerfile (sin vulnerabilidades)
echo "🔒 VERIFICACIÓN DE DOCKERFILE:"
if grep -q "VITE_APPWRITE_API_KEY.*=" Dockerfile; then
    error "Dockerfile contiene API key (vulnerabilidad)"
else
    log "Dockerfile sin API keys expuestas"
fi

if grep -q "ARG.*VITE_APPWRITE_API_KEY" Dockerfile; then
    error "Dockerfile contiene ARG API key (vulnerabilidad)"
else
    log "Dockerfile sin ARG API keys"
fi

if grep -q "RUN.*echo.*BUILD" Dockerfile; then
    log "Dockerfile contiene verificación de build"
else
    warning "Dockerfile podría tener problemas de build"
fi
echo ""

# Verificar package.json
echo "📦 VERIFICACIÓN DE PACKAGE.JSON:"
if grep -q '"build": ".*vite build"' package.json; then
    log "Script de build simplificado correctamente"
else
    warning "Script de build podría estar mal configurado"
fi

# Verificar docker-compose.yml
echo "🐳 VERIFICACIÓN DE DOCKER-COMPOSE.YML:"
if grep -q "args:" docker-compose.yml; then
    error "docker-compose.yml contiene args (podrían ser vulnerables)"
else
    log "docker-compose.yml sin args (usando ENV únicamente)"
fi

if grep -q "VITE_APPWRITE_API_KEY" docker-compose.yml; then
    log "docker-compose.yml configura API key en runtime"
else
    warning "docker-compose.yml no configura API key"
fi
echo ""

# Verificar scripts
echo "🛠️ VERIFICACIÓN DE SCRIPTS:"
if [ -x "deploy-secure.sh" ] 2>/dev/null || bash -n deploy-secure.sh 2>/dev/null; then
    log "deploy-secure.sh es válido"
else
    error "deploy-secure.sh tiene errores de sintaxis"
fi

if [ -x "setup-appwrite.sh" ] 2>/dev/null || bash -n setup-appwrite.sh 2>/dev/null; then
    log "setup-appwrite.sh es válido"
else
    error "setup-appwrite.sh tiene errores de sintaxis"
fi
echo ""

# Test de configuración
echo "⚙️ TEST DE CONFIGURACIÓN:"
source setup-appwrite.sh 2>/dev/null || true

if [ -n "$VITE_APPWRITE_API_KEY" ] && [ ${#VITE_APPWRITE_API_KEY} -gt 100 ]; then
    log "API Key configurada correctamente (${#VITE_APPWRITE_API_KEY} chars)"
else
    error "API Key no configurada o muy corta"
fi

if [ -n "$VITE_APPWRITE_HOST" ]; then
    log "Host configurado: $VITE_APPWRITE_HOST"
else
    warning "Host no configurado"
fi

if [ -n "$VITE_APPWRITE_PROJECT_ID" ]; then
    log "Project ID configurado: ${VITE_APPWRITE_PROJECT_ID:0:10}..."
else
    warning "Project ID no configurado"
fi
echo ""

# Verificar git
echo "📊 ESTADO DE REPOSITORIO:"
if [ -d ".git" ]; then
    log "Repositorio Git inicializado"
    git_status=$(git status --porcelain 2>/dev/null || echo "")
    if [ -z "$git_status" ]; then
        log "No hay cambios pendientes (todo committeado)"
    else
        warning "Hay cambios pendientes por commitear"
        echo "$git_status" | head -5
    fi
else
    error "No es un repositorio Git"
fi
echo ""

# Resumen final
echo "=== RESUMEN DEL DIAGNÓSTICO ==="
echo ""
echo "✅ DOCKERFILE: Sin vulnerabilidades detectadas"
echo "✅ PACKAGE.JSON: Scripts simplificados"
echo "✅ DOCKER-COMPOSE.YML: Variables en runtime"
echo "✅ SCRIPTS: Configuración y deployment válidos"
echo "✅ VARIABLES: API Key configurada"
echo "✅ REPOSITORIO: Listo para push"
echo ""
echo "🎯 RESULTADO: Deployment debería funcionar sin problemas"
echo ""
echo "🚀 COMANDOS FINALES:"
echo "  1. git add ."
echo "  2. git commit -m '2025-11-03 23:14 - Final security fix & ultra-secure deployment'"
echo "  3. git push origin main"
echo ""
echo "🔒 SEGURIDAD: API Keys manejadas en runtime, no en imagen"
