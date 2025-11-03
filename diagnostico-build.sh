# Diagnóstico de Build - Script de Debug
#!/bin/bash

echo "=== DIAGNÓSTICO DE BUILD ==="
echo "Fecha: $(date)"
echo "Directorio: $(pwd)"
echo ""

# Verificar archivos clave
echo "=== ARCHIVOS CLAVE ==="
echo "package.json: $([ -f package.json ] && echo '✅ EXISTE' || echo '❌ NO EXISTE')"
echo "Dockerfile: $([ -f Dockerfile ] && echo '✅ EXISTE' || echo '❌ NO EXISTE')"
echo "pnpm-lock.yaml: $([ -f pnpm-lock.yaml ] && echo '✅ EXISTE' || echo '❌ NO EXISTE')"
echo "vite.config.ts: $([ -f vite.config.ts ] && echo '✅ EXISTE' || echo '❌ NO EXISTE')"
echo ""

# Verificar estructura del proyecto
echo "=== ESTRUCTURA DEL PROYECTO ==="
echo "src/: $([ -d src ] && echo '✅ EXISTE' || echo '❌ NO EXISTE')"
echo "public/: $([ -d public ] && echo '✅ EXISTE' || echo '❌ NO EXISTE')"
echo "dist/: $([ -d dist ] && echo '✅ EXISTE' || echo '❌ NO EXISTE')"
echo ""

# Verificar configuración de Vite
if [ -f vite.config.ts ]; then
    echo "=== CONFIGURACIÓN DE VITE ==="
    echo "Base URL:"
    grep -E "base:|outputDir:" vite.config.ts || echo "No base/outputDir found"
    echo ""
fi

# Verificar dependencias críticas
echo "=== DEPENDENCIAS CRÍTICAS ==="
if [ -f package.json ]; then
    echo "Vite:"
    grep '"vite"' package.json || echo "Vite not found"
    echo "React:"
    grep '"react"' package.json || echo "React not found"
    echo "TypeScript:"
    grep '"typescript"' package.json || echo "TypeScript not found"
    echo ""
fi

# Verificar sintaxis de package.json
echo "=== SINTAXIS DE PACKAGE.JSON ==="
if [ -f package.json ]; then
    if python3 -m json.tool package.json > /dev/null 2>&1; then
        echo "✅ package.json es JSON válido"
    else
        echo "❌ package.json tiene errores de sintaxis JSON"
    fi
else
    echo "❌ package.json no encontrado"
fi
echo ""

# Verificar variables de entorno necesarias
echo "=== VARIABLES DE ENTORNO NECESARIAS ==="
echo "VITE_APPWRITE_HOST: ${VITE_APPWRITE_HOST:-NO DEFINIDA}"
echo "VITE_APPWRITE_PROJECT_ID: ${VITE_APPWRITE_PROJECT_ID:-NO DEFINIDA}"
echo "VITE_APPWRITE_API_KEY: ${VITE_APPWRITE_API_KEY:0:20}... (${#VITE_APPWRITE_API_KEY} chars)"

# Verificar si la API key tiene longitud correcta
if [ -n "$VITE_APPWRITE_API_KEY" ]; then
    if [ ${#VITE_APPWRITE_API_KEY} -gt 100 ]; then
        echo "✅ API key tiene longitud correcta"
    else
        echo "⚠️ API key parece muy corta (${#VITE_APPWRITE_API_KEY} chars)"
    fi
else
    echo "❌ API key no está definida"
fi
echo ""

# Probar instalación local
echo "=== PRUEBA DE INSTALACIÓN ==="
echo "Instalando dependencias..."
pnpm install --prefer-offline --silent
if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
fi
echo ""

# Probar build local
echo "=== PRUEBA DE BUILD ==="
echo "Ejecutando build..."
NODE_ENV=production VITE_APPWRITE_HOST="$VITE_APPWRITE_HOST" \
    VITE_APPWRITE_PROJECT_ID="$VITE_APPWRITE_PROJECT_ID" \
    VITE_APPWRITE_API_KEY="$VITE_APPWRITE_API_KEY" \
    pnpm run build 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
    echo "Tamaño de dist/: $(du -sh dist/ 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "Archivos en dist/:"
    ls -la dist/ 2>/dev/null | head -10
else
    echo "❌ Build falló"
fi

echo ""
echo "=== DIAGNÓSTICO COMPLETADO ==="
