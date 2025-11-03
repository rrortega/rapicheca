#!/bin/bash

# Script de Deploy Manual - Estudios Socioeconómicos
# Para uso cuando el CI/CD automático no esté disponible
# 
# Uso: ./deploy.sh [comando]
# Comandos: build, deploy, restart, logs, status

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
PROJECT_NAME="estudios-socioeconomicos"
CONTAINER_NAME="estudios-socioeconomicos-app"
PORT=3000
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Función de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
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

# Verificar que Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
        error "Docker Compose no está disponible."
        exit 1
    fi
}

# Función build
build_image() {
    log "🔨 Construyendo imagen Docker..."
    
    # Limpiar imágenes anteriores para forzar rebuild
    docker rmi -f ${PROJECT_NAME} 2>/dev/null || true
    
    # Build con cache cleaning
    docker build --no-cache -t ${PROJECT_NAME} .
    
    if [ $? -eq 0 ]; then
        log "✅ Imagen construida exitosamente"
        info "Tamaño de imagen:"
        docker images ${PROJECT_NAME} --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
    else
        error "❌ Error al construir imagen"
        exit 1
    fi
}

# Función deploy
deploy() {
    log "🚀 Deploying aplicación..."
    
    # Verificar que la imagen existe
    if ! docker images ${PROJECT_NAME} | grep -q ${PROJECT_NAME}; then
        warning "Imagen no encontrada. Construyendo primero..."
        build_image
    fi
    
    # Stop y remove containers existentes
    log "🛑 Deteniendo contenedores existentes..."
    docker-compose down 2>/dev/null || true
    
    # Deploy con docker-compose
    log "🚀 Iniciando contenedores..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        log "✅ Deploy completado exitosamente"
        status
    else
        error "❌ Error durante el deploy"
        exit 1
    fi
}

# Función restart
restart() {
    log "🔄 Reiniciando aplicación..."
    docker-compose restart
    
    if [ $? -eq 0 ]; then
        log "✅ Aplicación reiniciada"
        status
    else
        error "❌ Error al reiniciar"
        exit 1
    fi
}

# Función status
status() {
    log "📊 Estado de contenedores:"
    docker-compose ps
    
    echo ""
    info "🌐 URLs de acceso:"
    echo "  Local: http://localhost:${PORT}"
    echo "  Container: http://localhost:80 (dentro del container)"
    
    echo ""
    info "📈 Resource usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | head -5
}

# Función logs
logs() {
    local lines=${1:-50}
    log "📜 Mostrando últimos $lines logs..."
    docker-compose logs --tail=$lines -f
}

# Función cleanup
cleanup() {
    log "🧹 Limpiando recursos Docker..."
    
    read -p "¿Estás seguro? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker system prune -f
        log "✅ Limpieza completada"
    else
        info "Limpieza cancelada"
    fi
}

# Función test
test_deployment() {
    log "🧪 Probando deployment..."
    
    # Esperar a que el servicio esté listo
    sleep 5
    
    # Test local
    if curl -f -s http://localhost:${PORT} > /dev/null; then
        log "✅ Test local: OK"
    else
        error "❌ Test local: FALLO"
        return 1
    fi
    
    # Test dentro del container
    if docker-compose exec -T ${CONTAINER_NAME} curl -f -s http://localhost:80 > /dev/null; then
        log "✅ Test container: OK"
    else
        error "❌ Test container: FALLO"
        return 1
    fi
    
    # Test SSL (si está disponible)
    if command -v curl &> /dev/null; then
        if curl -f -s -k https://localhost:${PORT} > /dev/null 2>&1; then
            log "✅ Test SSL: OK"
        else
            warning "⚠️ SSL test: No disponible (normal para localhost)"
        fi
    fi
    
    log "🎉 Todos los tests pasaron"
}

# Función help
show_help() {
    echo -e "${BLUE}Script de Deploy Manual - Estudios Socioeconómicos${NC}"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build     - Construir imagen Docker"
    echo "  deploy    - Deploy completo (build + start)"
    echo "  restart   - Reiniciar aplicación"
    echo "  status    - Mostrar estado de contenedores"
    echo "  logs [n]  - Mostrar logs (últimas n líneas, default: 50)"
    echo "  test      - Probar deployment"
    echo "  cleanup   - Limpiar recursos Docker"
    echo "  help      - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 deploy    # Deploy completo"
    echo "  $0 logs 100  # Ver últimas 100 líneas de logs"
    echo "  $0 test      # Probar que todo funciona"
}

# Función principal
main() {
    check_docker
    
    case "${1:-help}" in
        "build")
            build_image
            ;;
        "deploy")
            deploy
            ;;
        "restart")
            restart
            ;;
        "status")
            status
            ;;
        "logs")
            logs "${2:-50}"
            ;;
        "test")
            test_deployment
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Comando desconocido: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"