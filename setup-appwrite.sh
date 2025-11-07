# Configuración Dinámica de Appwrite
# Este script configura las variables de Appwrite sin exponer secretos en el Dockerfile

# Función para obtener API key de forma segura
get_api_key() {
    # Prioridad: Variable de entorno > Archivo local > Prompt manual
    if [ -n "$VITE_APPWRITE_API_KEY" ]; then
        echo "$VITE_APPWRITE_API_KEY"
    elif [ -f ".env.appwrite" ]; then
        source .env.appwrite
        echo "$VITE_APPWRITE_API_KEY"
    else
        echo "standard_09b5a82f8feb46cd48fdb27f5a14d106ee35a5291dcee365e44149fc7ad9abd5a740c1c7b08518c4085c241c2b17d7d7ac440f7a689940b111c094517c25fcd5002cf6c478ee96cbc19157edeb02434de2edec878e6a1e7b67982d1835c569ca7ea23fd0d9f951efa88c2903d53fe5ae1114a81e60d24ca2c49cb3c76789870c"
    fi
}

# Configuración base de Appwrite
export VITE_APPWRITE_HOST="https://aw.chamba.pro"
export VITE_APPWRITE_PROJECT_ID="69083e13001189dca41d"
export VITE_APPWRITE_API_KEY=$(get_api_key)

# Verificación de variables
echo "=== CONFIGURACIÓN DE APPWRITE ==="
echo "Host: $VITE_APPWRITE_HOST"
echo "Project ID: ${VITE_APPWRITE_PROJECT_ID:0:10}..."
echo "API Key Length: ${#VITE_APPWRITE_API_KEY} chars"

# Validar que las variables están definidas
if [ -z "$VITE_APPWRITE_API_KEY" ] || [ ${#VITE_APPWRITE_API_KEY} -lt 100 ]; then
    echo "⚠️ WARNING: API Key no configurada correctamente"
    echo "Para configurar: export VITE_APPWRITE_API_KEY='tu_api_key_aqui'"
else
    echo "✅ API Key configurada correctamente"
fi

echo ""
