#language: es
Funcionalidad: Gestión de Workspaces

  Como usuario del sistema de estudios socioeconómicos
  Quiero gestionar múltiples workspaces
  Para poder organizar mis estudios por empresa o proyecto

  Escenario: Visualizar lista de workspaces
    Dado que estoy autenticado
    Y tengo acceso a múltiples workspaces
    Cuando accedo a la vista de workspaces
    Entonces el sistema debe mostrar:
      - Lista de todos mis workspaces
      - Información de plan de cada workspace (basic, professional, enterprise)
      - Estado de cada workspace (active, trial, suspended)
      - Balance de créditos disponible
      - Branding personalizado si está configurado

  Escenario: Cambiar workspace activo
    Dado que estoy autenticado
    Y tengo múltiples workspaces
    Y estoy en un workspace diferente
    Cuando selecciono otro workspace de la lista
    Entonces el sistema debe:
      - Cambiar al workspace seleccionado
      - Cargar los datos del usuario en ese workspace
      - Actualizar la interfaz con la información del nuevo workspace
      - Mostrar el rol y permisos del usuario en ese workspace

  Escenario: Ver información del usuario en workspace
    Dado que estoy en un workspace
    Cuando consulto mi información en el workspace
    Entonces el sistema debe mostrar:
      - Mi rol (owner, admin, analyst, viewer)
      - Mis permisos específicos
      - Mi estado (active, inactive, invited)
      - Mi información personal (email, nombre completo)

  Escenario: Verificar permisos de usuario
    Dado que estoy en un workspace
    Cuando intento realizar una acción específica
    Entonces el sistema debe verificar:
      - Si tengo permisos para crear casos
      - Si tengo permisos para editar casos
      - Si tengo permisos para eliminar casos
      - Si tengo permisos para gestionar usuarios
      - Si tengo permisos para gestionar facturación
      - Si tengo permisos para ver analytics
      - Si tengo permisos para gestionar integraciones

  Criterios de Aceptación:
  - El usuario debe poder cambiar entre sus workspaces disponibles
  - Los permisos deben respetarse según el rol asignado
  - La información del workspace debe cargar correctamente
  - El estado de sesión debe persistir al cambiar de workspace
  - Los límites y características del plan deben aplicarse correctamente
  - El sistema debe mostrar el branding personalizado del workspace