#language: es
Funcionalidad: Autenticación de Usuarios

  Como usuario del sistema de estudios socioeconómicos
  Quiero poder autenticarme en la aplicación
  Para poder acceder a mi cuenta y gestionar mis estudios

  Escenario: Registro exitoso de nuevo usuario
    Dado que estoy en la página de registro
    Cuando completo el formulario con email válido, contraseña y nombre
    Y hago clic en el botón "Registrarse"
    Entonces el sistema debe crear mi cuenta
    Y redireccionarme al dashboard
    Y mostrar mensaje de bienvenida

  Escenario: Login exitoso
    Dado que tengo una cuenta registrada
    Y estoy en la página de login
    Cuando ingreso mi email y contraseña correctos
    Y hago clic en "Iniciar Sesión"
    Entonces el sistema debe autenticarme
    Y redireccionarme al dashboard
    Y cargar mis workspaces y datos de usuario

  Escenario: Login con credenciales incorrectas
    Dado que estoy en la página de login
    Cuando ingreso credenciales incorrectas
    Y hago clic en "Iniciar Sesión"
    Entonces el sistema debe mostrar error de credenciales
    Y mantener al usuario en la página de login

  Escenario: Logout exitoso
    Dado que estoy autenticado en el sistema
    Cuando hago clic en "Cerrar Sesión"
    Entonces el sistema debe cerrar mi sesión
    Y limpiar todo el estado de autenticación
    Y redireccionarme a la página de login

  Escenario: Manejo de error 401 - Usuario no autorizado
    Dado que tengo una sesión activa
    Y el sistema detecta error 401 por falta de permisos
    Cuando el sistema intenta obtener el usuario actual
    Entonces debe limpiar la sesión automáticamente
    Y mostrar mensaje de sesión expirada
    Y redireccionar al login

  Criterios de Aceptación:
  - El sistema debe manejar errores de autorización apropiadamente
  - Se debe limpiar el estado de autenticación en caso de error 401
  - Los usuarios deben poder registrarse e iniciar sesión exitosamente
  - El logout debe limpiar completamente el estado del usuario
  - Las credenciales incorrectas deben mostrar mensaje de error apropiado