#language: es
Funcionalidad: Gestión de Casos de Estudios Socioeconómicos

  Como analista del sistema de estudios socioeconómicos
  Quiero crear y gestionar casos de estudio
  Para poder evaluar la situación socioeconómica de individuos o familias

  Escenario: Crear nuevo caso de estudio
    Dado que tengo permisos para crear casos
    Y estoy en la vista de casos
    Cuando hago clic en "Crear Nuevo Caso"
    Y completo la información del caso con datos socioeconómicos
    Y selecciono una plantilla aplicable
    Y hago clic en "Guardar"
    Entonces el sistema debe:
      - Crear el caso con los datos proporcionados
      - Aplicar la plantilla seleccionada
      - Asignar un ID único al caso
      - Mostrar el caso en la lista de casos
      - Descontar créditos según el plan del workspace

  Escenario: Listar casos existentes
    Dado que tengo acceso a casos en el workspace
    Cuando accedo a la vista de casos
    Entonces el sistema debe mostrar:
      - Lista paginada de todos mis casos
      - Filtros por estado, fecha, tipo de estudio
      - Búsqueda por nombre o ID de caso
      - Información resumida de cada caso
      - Opciones de acción según mis permisos

  Escenario: Editar caso existente
    Dado que tengo permisos para editar casos
    Y selecciono un caso de la lista
    Cuando hago clic en "Editar"
    Y modifico la información necesaria
    Y hago clic en "Actualizar"
    Entonces el sistema debe guardar los cambios
    Y mostrar mensaje de confirmación
    Y actualizar la vista del caso

  Escenario: Eliminar caso
    Dado que tengo permisos para eliminar casos
    Y selecciono un caso
    Cuando confirmo la eliminación
    Entonces el sistema debe:
      - Eliminar permanentemente el caso
      - Liberar los créditos utilizados
      - Actualizar la lista de casos
      - Mostrar confirmación de eliminación

  Escenario: Ver detalles completos de un caso
    Dado que tengo acceso a un caso específico
    Cuando hago clic en ver detalles
    Entonces el sistema debe mostrar:
      - Toda la información socioeconómica recolectada
      - Resultados del análisis
      - Historial de cambios
      - Documentos adjuntos
      - Tiempo de creación y última modificación

  Criterios de Aceptación:
  - Los casos deben crearse con datos completos y válidos
  - Los permisos de usuario deben respetarse en todas las operaciones
  - Los créditos deben descontarse y liberarse apropiadamente
  - La información debe persistir correctamente
  - Las operaciones deben ser auditadas en los logs