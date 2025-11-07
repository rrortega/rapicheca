#language: es
Funcionalidad: Gestión de Plantillas de Estudios

  Como administrador del sistema de estudios socioeconómicos
  Quiero gestionar plantillas de estudios
  Para poder estandarizar la recolección de información socioeconómica

  Escenario: Crear nueva plantilla de estudio
    Dado que tengo permisos para gestionar plantillas
    Y estoy en la sección de plantillas
    Cuando hago clic en "Crear Plantilla"
    Y defino la estructura del formulario
    Y configuro los campos obligatorios
    Y establezco las reglas de validación
    Y hago clic en "Guardar"
    Entonces el sistema debe:
      - Crear la plantilla con la configuración definida
      - Aplicar las validaciones configuradas
      - Mostrar la plantilla en la lista
      - Permitir usarla para crear nuevos casos

  Escenario: Listar plantillas disponibles
    Dado que existen plantillas en el workspace
    Cuando accedo a la sección de plantillas
    Entonces el sistema debe mostrar:
      - Lista de todas las plantillas disponibles
      - Plantillas personalizadas del workspace
      - Plantillas del sistema por defecto
      - Estado de cada plantilla (activa, inactiva)
      - Fecha de creación y última modificación

  Escenario: Editar plantilla existente
    Dado que tengo permisos para gestionar plantillas
    Y selecciono una plantilla editable
    Cuando hago clic en "Editar"
    Y modifico la estructura o configuración
    Y guardo los cambios
    Entonces el sistema debe:
      - Actualizar la plantilla con los nuevos datos
      - Mantener la compatibilidad con casos existentes
      - Mostrar confirmación de actualización

  Escenario: Usar plantilla para crear caso
    Dado que existen plantillas disponibles
    Y tengo permisos para crear casos
    Cuando inicio la creación de un nuevo caso
    Y selecciono una plantilla de la lista
    Entonces el sistema debe:
      - Generar el formulario basado en la plantilla
      - Mostrar solo los campos definidos en la plantilla
      - Aplicar las validaciones configuradas
      - Mantener la estructura de datos estándar

  Escenario: Duplicar plantilla
    Dado que tengo una plantilla base
    Y quiero crear una similar
    Cuando hago clic en "Duplicar" en una plantilla
    Y modifico el nombre y configuración
    Y guardo como nueva plantilla
    Entonces el sistema debe crear una copia independiente
      - Con todos los campos y configuraciones originales
      - Con un nuevo ID único
      - Lista para ser editada independientemente

  Criterios de Aceptación:
  - Las plantillas deben definir formularios dinámicos
  - Los campos deben tener validaciones apropiadas
  - Las plantillas deben ser reutilizables para múltiples casos
  - Los cambios en plantillas no deben afectar casos existentes
  - Las plantillas deben respetar los límites del plan del workspace
  - El sistema debe mantener un historial de cambios de plantillas