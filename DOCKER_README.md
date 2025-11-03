# Docker Configuration - Estudios Socioeconómicos 🐳

Este directorio contiene toda la configuración Docker necesaria para CI/CD automático con tu setup de easypanel + Traefik.

## 📋 Archivos Incluidos

| Archivo | Propósito |
|---------|-----------|
| `Dockerfile` | Build multi-stage optimizado para producción |
| `Dockerfile.dev` | Desarrollo local con hot reload |
| `docker-compose.yml` | Orquestación completa (prod + dev) |
| `.dockerignore` | Optimización del build (excluye archivos innecesarios) |
| `.env.example` | Variables de entorno requeridas |

## 🚀 CI/CD Automático (GitHub → Servidor)

Tu setup ya está configurado para CI/CD automático:

### **Flujo Automático:**
1. **Push a GitHub** → Webhook trigger
2. **Servidor ejecuta git pull** → Código actualizado
3. **Docker build automático** → Imagen optimizada
4. **Deploy en easypanel** → Traefik maneja SSL automáticamente

### **Comando para deploy:**
```bash
# Solo necesitas hacer esto:
git push origin main

# El resto es automático en tu servidor
```

## 🏗️ Arquitectura Docker

### **Multi-stage Build (Dockerfile):**
```dockerfile
Stage 1 (Builder):
- Node.js 18 Alpine
- pnpm install
- Build de producción con variables de entorno
- Resultado: directorio dist/ optimizado

Stage 2 (Runner):
- Node.js 18 Alpine minimal
- serve (static file server)
- Usuario no-root (seguridad)
- Puerto 80 expuesto
```

### **Variables de Entorno en Build:**
```bash
# Estas se injectionan durante el docker build:
VITE_APPWRITE_HOST=https://aw.chamba.pro
VITE_APPWRITE_PROJECT_ID=69083e13001189dca41d
VITE_APPWRITE_API_KEY=standard_09b5a82f8feb46cd48fdb27f5a14d106ee35a5291dcee365e44149fc7ad9abd5a740c1c7b08518c4085c241c2b17d7d7ac440f7a689940b111c094517c25fcd5002cf6c478ee96cbc19157edeb02434de2edec878e6a1e7b67982d1835c569ca7ea23fd0d9f951efa88c2903d53fe5ae1114a81e60d24ca2c49cb3c76789870c
```

## 🧪 Testing Local

### **Producción Local:**
```bash
# Build y run completo
docker-compose up -d --build

# Verificar que funciona
curl http://localhost:3000

# Ver logs
docker-compose logs -f
```

### **Desarrollo Local:**
```bash
# Con hot reload (cambios se ven inmediatamente)
docker-compose --profile dev up estudios-socioeconomicos-dev

# Acceder en: http://localhost:5173
```

### **Limpieza:**
```bash
# Parar todo
docker-compose down

# Limpiar volúmenes (si hay problemas)
docker-compose down -v

# Limpiar sistema Docker completo
docker system prune -a
```

## 🔧 Configuración Personalizada

### **Variables de Entorno Locales:**
```bash
# Copiar ejemplo
cp .env.example .env

# Editar según necesidades
nano .env
```

### **Cambiar Puerto Local:**
```yaml
# En docker-compose.yml, cambiar:
ports:
  - "TU_PUERTO:80"  # Cambiar 3000 por el puerto que prefieras
```

### **Agregar Más Servicios:**
```yaml
# En docker-compose.yml, agregar bajo services:
nuevo-servicio:
  build: .
  ports:
    - "3001:80"
  environment:
    - NODE_ENV=production
```

## 📊 Monitoreo y Debugging

### **Ver Estado de Contenedores:**
```bash
docker-compose ps
docker ps -a  # Incluir contenedores detenidos
```

### **Ver Logs Detallados:**
```bash
# Logs de servicio específico
docker-compose logs estudios-socioeconomicos

# Logs con timestamp y follow
docker-compose logs -f -t estudios-socioeconomicos

# Últimas 50 líneas
docker-compose logs --tail=50
```

### **Ejecutar Comandos Dentro del Contenedor:**
```bash
# Entrar al contenedor
docker-compose exec estudios-socioeconomicos sh

# Ver procesos
docker-compose exec estudios-socioeconomicos ps aux

# Ver archivos del build
docker-compose exec estudios-socioeconomicos ls -la dist/
```

### **Monitorear Recursos:**
```bash
# Uso de CPU/Memoria
docker stats

# Información del contenedor
docker inspect [CONTAINER_ID]

# Tamaño de imagen
docker images estudios-socioeconomicos
```

## 🔒 Seguridad

### **Mejores Prácticas Implementadas:**
- ✅ Usuario no-root en contenedor de producción
- ✅ Multi-stage build (imagen mínima)
- ✅ .dockerignore (excluye archivos sensibles)
- ✅ Variables de entorno injectionadas en build time
- ✅ Traefik maneja SSL/TLS automáticamente

### **Variables Sensibles:**
```bash
# Estas están injectionadas en el docker build:
# NO deben estar en el código fuente

# API Keys que el usuario debe configurar:
# - STRIPE_SECRET_KEY
# - LLAMAEXTRACT_API_KEY
# - OPENROUTER_API_KEY
# - ZAPSIGN_API_KEY
# - ELEVENLABS_API_KEY
# - TRUORA_API_KEY
```

## 🚨 Troubleshooting

### **Build Falla:**
```bash
# Verificar que package.json existe
ls -la package.json

# Verificar pnpm-lock.yaml
ls -la pnpm-lock.yaml

# Limpiar cache de Docker
docker system prune -a

# Build manual para ver errores
docker build -t estudios-socioeconomicos --no-cache .
```

### **Contenedor No Inicia:**
```bash
# Ver logs específicos
docker-compose logs estudios-socioeconomicos

# Verificar puerto disponible
netstat -tulpn | grep 3000

# Probar manualmente
docker run -p 3000:80 estudios-socioeconomicos
```

### **Servicios No se Ven:**
```bash
# Verificar que Traefik esté funcionando
curl -I http://localhost:3000

# Verificar configuración de easypanel
# EasyPanel → Apps → Ver estado

# Verificar DNS local
nslookup localhost
```

### **Variables de Entorno No Funcionan:**
```bash
# Verificar que están en el build
docker-compose exec estudios-socioeconomicos env | grep VITE

# Rebuild si cambiaste variables
docker-compose up -d --build
```

## 📈 Performance

### **Optimizaciones Incluidas:**
- 🏗️ **Multi-stage build** - Imagen mínima (~100MB vs ~1GB)
- 📦 **Layer caching** - Build más rápido en CI/CD
- 🚫 **.dockerignore** - Build context optimizado
- ⚡ **pnpm** - Instalación más rápida que npm
- 🔧 **Node 18 Alpine** - Imagen base mínima

### **Tamaño de Imagen:**
```bash
# Ver tamaño de la imagen final
docker images estudios-socioeconomicos

# Resultado esperado: ~150-200MB
```

### **Tiempo de Build:**
```bash
# Primer build: ~2-3 minutos
# Builds subsecuentes: ~30-60 segundos (con cache)
```

## 🎯 Siguientes Pasos

1. **✅ Ya configurado:**
   - Dockerfile optimizado
   - CI/CD automático
   - easypanel + Traefik
   - Variables de entorno

2. **🔄 Para usar:**
   ```bash
   # Subir a GitHub y el resto es automático
   git add .
   git commit -m "Docker setup completo"
   git push origin main
   ```

3. **📋 Opcional (APIs externas):**
   - Configurar Stripe (pagos)
   - Configurar LlamaExtract (OCR)
   - Configurar OpenRouter (IA)
   - Configurar ZapSign (firmas)
   - Configurar ElevenLabs (llamadas)
   - Configurar Truora (background checks)

---

**🚀 ¡CI/CD automático listo para usar!**

**📝 Configuración:** 2025-11-03  
**🔧 Setup:** GitHub + Docker + EasyPanel + Traefik  
**⏱️ Deploy time:** Automático (30-60 segundos)  
**🔒 Seguridad:** Usuario no-root + SSL automático