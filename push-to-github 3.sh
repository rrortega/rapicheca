#!/bin/bash

# Script para Push Rápido - Estudios Socioeconómicos
# Automatiza el proceso de commit y push con mensaje formateado

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REPO_URL="https://github.com/rrortega/rapicheca.git"
TIMESTAMP=$(date +'%Y-%m-%d %H:%M:%S')

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

# Verificar que estamos en el directorio correcto
check_directory() {
    if [ ! -f "package.json" ] || [ ! -f "Dockerfile" ]; then
        error "No parece ser el directorio del proyecto React"
        error "Asegúrate de ejecutar este script desde estudios-socioeconomicos-app/"
        exit 1
    fi
    log "✅ Directorio correcto confirmado"
}

# Verificar que Git está inicializado
check_git() {
    if [ ! -d ".git" ]; then
        error "Git no está inicializado"
        info "Ejecuta: git init"
        info "Luego: git remote add origin https://github.com/rrortega/rapicheca.git"
        exit 1
    fi
    
    # Verificar remote
    if ! git remote get-url origin > /dev/null 2>&1; then
        error "Remote 'origin' no configurado"
        info "Ejecuta: git remote add origin https://github.com/rrortega/rapicheca.git"
        exit 1
    fi
    
    log "✅ Git configurado correctamente"
}

# Verificar si hay cambios para commit
check_changes() {
    if git diff --quiet && git diff --cached --quiet; then
        warning "No hay cambios para commit"
        info "Si quieres forzar un push, usa: git push origin main"
        exit 0
    fi
    log "📝 Cambios detectados para commit"
}

# Mostrar qué archivos cambiaron
show_changes() {
    echo ""
    info "📋 Archivos modificados:"
    git status --short
    
    echo ""
    if [ -n "$(git diff --name-only)" ]; then
        info "🔄 Archivos con cambios no indexados:"
        git diff --name-only | sed 's/^/  • /'
    fi
    
    if [ -n "$(git diff --cached --name-only)" ]; then
        info "✅ Archivos indexados para commit:"
        git diff --cached --name-only | sed 's/^/  • /'
    fi
    echo ""
}

# Ejecutar git add
git_add() {
    log "📦 Agregando archivos..."
    git add .
    
    if [ $? -eq 0 ]; then
        log "✅ Archivos agregados al staging"
    else
        error "❌ Error al agregar archivos"
        exit 1
    fi
}

# Generar mensaje de commit automático
generate_commit_message() {
    local commit_msg
    
    # Detectar si es la primera vez que se hace commit en el repo
    if [ -z "$(git log --oneline 2>/dev/null)" ]; then
        commit_msg="Setup inicial: Plataforma Estudios Socioeconómicos con Docker + CI/CD + Deploy fixes"
    else
        commit_msg="${TIMESTAMP} - Actualización: Docker build fix, dependencies optimizadas, CI/CD automático"
    fi
    
    echo "$commit_msg"
}

# Hacer commit
git_commit() {
    local commit_msg=$(generate_commit_message)
    
    log "💬 Haciendo commit..."
    git commit -m "$commit_msg"
    
    if [ $? -eq 0 ]; then
        log "✅ Commit realizado: $commit_msg"
    else
        error "❌ Error al hacer commit"
        exit 1
    fi
}

# Push al repositorio
git_push() {
    log "🚀 Haciendo push al repositorio..."
    
    # Verificar si remote apunta al repo correcto
    local remote_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ ! "$remote_url" =~ "rrortega/rapicheca" ]]; then
        warning "El remote no apunta al repo correcto"
        info "Remote actual: $remote_url"
        info "Repo esperado: $REPO_URL"
        info ""
        read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    echo ""
    info "🔗 Push URL: $REPO_URL"
    info "⏰ Iniciando push..."
    echo ""
    
    # Hacer push (puede pedir credenciales)
    if git push origin main; then
        echo ""
        log "🎉 ¡Push realizado exitosamente!"
        echo ""
        info "📊 Estado del push:"
        echo "  ✅ Commit subido a GitHub"
        echo "  🔄 CI/CD automático iniciado"
        echo "  🚀 Deploy en progreso..."
        echo ""
        info "📋 Próximos pasos:"
        echo "  1. Revisar CI/CD en GitHub Actions (si está configurado)"
        echo "  2. Verificar deploy en tu servidor"
        echo "  3. Probar el sitio web"
        echo ""
        info "🔗 Enlaces útiles:"
        echo "  GitHub: https://github.com/rrortega/rapicheca"
        echo "  Actions: https://github.com/rrortega/rapicheca/actions"
    else
        error "❌ Error al hacer push"
        echo ""
        info "💡 Posibles soluciones:"
        echo "  1. Verificar credenciales de GitHub"
        echo "  2. Verificar permisos del repositorio"
        echo "  3. Verificar conexión a internet"
        echo "  4. Intentar: git push origin main --force (con cuidado)"
        exit 1
    fi
}

# Función principal
main() {
    echo -e "${BLUE}"
    echo "🚀 Script de Push Rápido - Estudios Socioeconómicos"
    echo "===================================================="
    echo -e "${NC}"
    
    # Verificaciones
    check_directory
    check_git
    check_changes
    
    # Mostrar cambios
    show_changes
    
    # Preguntar confirmación
    echo ""
    info "¿Proceder con el commit y push?"
    read -p "(Enter para continuar, Ctrl+C para cancelar): "
    
    # Ejecutar pasos
    git_add
    git_commit
    git_push
    
    echo ""
    log "✨ ¡Proceso completado exitosamente!"
    log "⏱️ Tiempo total: aproximadamente 1-2 minutos"
    echo ""
}

# Verificar argumentos
case "${1:-}" in
    "help"|"-h"|"--help")
        echo "Uso: $0 [opciones]"
        echo ""
        echo "Opciones:"
        echo "  (ninguna)  - Ejecución interactiva completa"
        echo "  help       - Mostrar esta ayuda"
        echo ""
        echo "Este script automatiza:"
        echo "  1. Verificación del directorio y Git"
        echo "  2. Agregar archivos al staging"
        echo "  3. Commit con mensaje automático"
        echo "  4. Push al repositorio GitHub"
        echo ""
        echo "Ejemplo: $0"
        exit 0
        ;;
    *)
        main
        ;;
esac