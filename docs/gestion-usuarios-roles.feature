#language: es
Funcionalidad: Gestión de Usuarios y Roles

  Como administrador del workspace
  Quiero gestionar usuarios y asignar roles
  Para poder controlar el acceso y permisos dentro del workspace

  Escenario: Invitar nuevo usuario al workspace
    Dado que tengo permisos para gestionar usuarios
    Y estoy en la sección de usuarios del workspace
    Cuando hago clic en "Invitar Usuario"
    Y proporciono el email del usuario
    Y asigno un rol inicial
    Y envío la invitación
    Entonces el sistema debe:
      - Enviar email de invitación al usuario
      - Crear registro pendiente de usuario
      - Asignar el rol especificado temporalmente
      - Mostrar la invitación en estado "pendiente"

  Escenario: Aceptar invitación de workspace
    Dado que he recibido una invitación por email
    Y hago clic en el enlace de aceptación
    Cuando completo el proceso de aceptación
    Entonces el sistema debe:
      - Crear mi cuenta de usuario si no existe
      - Asociar mi usuario al workspace
      - Activar mi rol asignado
      - Enviar confirmación al administrador
      - Permitirme acceder al workspace

  Escenario: Cambiar rol de usuario existente
    Dado que tengo permisos para gestionar usuarios
    Y selecciono un usuario del workspace
    Cuando cambio su rol
    Y confirmo el cambio
    Entonces el sistema debe:
      - Actualizar el rol del usuario
      - Modificar sus permisos automáticamente
      - Registrar el cambio en el audit log
      - Notificar al usuario del cambio
      - Mantener el acceso a datos según nuevos permisos

  Escenario: Desactivar usuario
    Dado que tengo permisos para gestionar usuarios
    Y selecciono un usuario para desactivar
    Cuando confirmo la desactivación
    Entonces el sistema debe:
      - Cambiar el estado del usuario a "inactive"
      - Revocar acceso inmediato al workspace
      - Mantener sus datos históricos
      - Permitir reactivación posterior
      - Registrar la acción en audit log

  Escenario: Ver lista de usuarios del workspace
    Dado que tengo acceso a la gestión de usuarios
    Cuando accedo a la lista de usuarios
    Entonces el sistema debe mostrar:
      - Todos los usuarios asociados al workspace
      - Rol y permisos de cada usuario
      - Estado de cada usuario (active, inactive, invited)
      - Fecha de última actividad
      - Opciones de acción según mis permisos

  Escenario: Configurar permisos personalizados
    Dado que tengo permisos avanzados de gestión
    Y selecciono un usuario específico
    Cuando accedo a la configuración de permisos
    Y ajusto los permisos granulares
    Y guardo la configuración
    Entonces el sistema debe:
      - Aplicar permisos personalizados
      - Mantener coherencia con el rol base
      - Validar que no se den permisos superiores
      - Mostrar resumen de permisos otorgados

  Criterios de Aceptación:
  - Solo administradores pueden gestionar usuarios
  - Los roles deben respetar jerarquía de permisos
  - Los cambios de rol deben aplicarse inmediatamente
  - Las invitaciones deben expirar después de tiempo límite
  - Los usuarios desactivados mantienen trazabilidad histórica
  - Los audit logs deben registrar todas las acciones de gestión