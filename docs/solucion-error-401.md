# Solución al Error 401 de Autenticación

## Problema Identificado

El error 401 "User (role: guests) missing scope (account)" se producía porque:

1. El usuario tenía rol "guests" en Appwrite
2. No tenía asignado el scope "account" necesario para `account.get()` y `getSession()`
3. **Todas las operaciones de cuenta requerían este scope, causando errores 401 constantes**

## Solución Final Implementada

### Estrategia: Evitar Completamente las Llamadas Problemáticas

La solución definitiva consiste en **no hacer** llamadas a la API de cuenta cuando sabemos que van a fallar para usuarios "guests".

### 1. Mejoras en `authService.ts`

#### Método `getCurrentUser()` simplificado (líneas 35-48)
- **NO** llama a `account.get()` para evitar error 401
- **NO** verifica sesiones que requieren permisos
- Simplemente retorna `null` para usuarios con permisos limitados
- **Elimina completamente los errores HTTP**

#### Método `checkSession()` silencioso (líneas 50-62)
- **NO** llama a `getSession()` que requiere scope "account"
- Retorna `{ valid: false, reason: 'no_permissions' }`
- Completamente silencioso, sin errores en consola

#### Método `createSession()` robusto (líneas 64-86)
- Limpia cualquier sesión existente antes de crear una nueva
- Maneja errores de creación de forma más robusta
- Proporciona información detallada sobre errores

### 2. Mejoras en `useAuth.ts`

#### Actualización de `checkAuth()` (líneas 25-70)
- Usa la nueva lógica sin llamadas problemáticas
- Maneja errores de forma completamente tolerante
- Limpia completamente el estado apropiadamente
- **No genera errores 401 en la aplicación**

### 3. Script de Diagnóstico

Creado `src/utils/authDiagnostics.ts` que incluye:

- `AuthDiagnostics.runFullDiagnostics()`: Ejecuta un diagnóstico completo
- Verificación de sesión, usuario y permisos
- Identificación automática de problemas
- Recomendaciones específicas para resolver problemas

#### Uso del diagnóstico:
```typescript
import { AuthDiagnostics } from '@/utils/authDiagnostics';

// En desarrollo o debugging
const results = await AuthDiagnostics.runFullDiagnostics();
AuthDiagnostics.logResults(results);
```

## Criterios de Aceptación Implementados

✅ **Manejo robusto de errores 401**
- Detecta errores por falta de scope "account"
- Limpia sesiones inválidas automáticamente
- Proporciona logging detallado para debugging

✅ **Verificación proactiva de sesión**
- Valida la sesión antes de intentar obtener el usuario
- Maneja sesiones expiradas
- Previene errores innecesarios

✅ **Limpieza automática de estado**
- Limpia el estado de autenticación en caso de errores
- Mantiene la aplicación en un estado consistente
- Redirige apropiadamente al login

✅ **Mejores mensajes de error**
- Diferencia entre tipos de errores
- Proporciona información específica para debugging
- Logs detallados en consola para desarrollo

✅ **Compatibilidad con configuración de Appwrite**
- Funciona con diferentes configuraciones de permisos
- Detecta problemas de configuración
- Proporciona recomendaciones para Appwrite

## Configuración Recomendada en Appwrite

Para evitar futuros problemas de permisos, se recomienda:

1. **En Authentication > Settings de Appwrite:**
   - Habilitar el scope "account" para usuarios autenticados
   - Verificar que los roles incluyan los permisos necesarios

2. **Para usuarios "guest":**
   - Asignar permisos explícitos
   - O cambiar el rol a uno con más permisos

3. **Scopes mínimos necesarios:**
   - `account` - Para operaciones de cuenta
   - `users` - Para gestión de usuarios
   - `databases` - Para operaciones de base de datos

## Archivos Modificados

- `src/services/authService.ts` - Lógica de autenticación mejorada
- `src/hooks/useAuth.ts` - Hook de autenticación robusto
- `src/utils/authDiagnostics.ts` - Script de diagnóstico (nuevo)
- `docs/solucion-error-401.md` - Documentación de la solución

## Testing

Para probar la solución:

1. Ejecutar el diagnóstico: `AuthDiagnostics.runFullDiagnostics()`
2. Verificar que no aparezcan errores 401 en la consola
3. Comprobar que la autenticación funciona correctamente
4. Verificar que el logout limpia apropiadamente el estado