# Solución al Error 401 de Autenticación

## Problema Identificado

El error 401 "User (role: guests) missing scope (account)" se producía porque:

1. El usuario tenía rol "guests" en Appwrite
2. No tenía asignado el scope "account" necesario para `account.get()`
3. El sistema no manejaba correctamente este tipo de errores de autorización

## Solución Implementada

### 1. Mejoras en `authService.ts`

#### Nuevo método `getCurrentUser()` (líneas 35-67)
- Verifica primero si hay una sesión activa con `getSession('current')`
- Detecta específicamente errores 401 por falta de permisos
- Limpia automáticamente la sesión en caso de error de autorización
- Maneja graciosamente diferentes tipos de errores

#### Nuevo método `checkSession()` (líneas 69-91)
- Verifica el estado y validez de la sesión actual
- Comprueba si la sesión ha expirado
- Limpia sesiones expiradas automáticamente
- Proporciona información detallada sobre el estado de la sesión

#### Nuevo método `createSession()` (líneas 93-116)
- Limpia cualquier sesión existente antes de crear una nueva
- Maneja errores de creación de forma más robusta
- Proporciona información detallada sobre errores

### 2. Mejoras en `useAuth.ts`

#### Actualización de `checkAuth()` (líneas 25-71)
- Usa `checkSession()` antes de intentar obtener el usuario
- Maneja errores de forma más eficiente
- Limpia completamente el estado en caso de problemas

#### Actualización de `login()` (líneas 77-90)
- Usa el nuevo método `createSession()` más robusto
- Proporciona mejor información de error
- Maneja códigos de error específicos

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