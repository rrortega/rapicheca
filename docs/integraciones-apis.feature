#language: es
Funcionalidad: Integraciones con APIs Externas

  Como administrador del workspace
  Quiero configurar integraciones con APIs externas
  Para poder automatizar verificaciones y obtener datos externos

  Escenario: Configurar integración con API de verificación
    Dado que tengo permisos para gestionar integraciones
    Y estoy en la sección de integraciones
    Cuando agrego una nueva integración
    Y proporciono las credenciales de API
    Y configuro los endpoints necesarios
    Y pruebo la conexión
    Entonces el sistema debe:
      - Validar las credenciales de API
      - Confirmar conectividad con el servicio externo
      - Guardar la configuración de forma segura
      - Mostrar estado de conexión
      - Habilitar el uso de la integración

  Escenario: Usar integración en caso de estudio
    Dado que tengo integraciones configuradas
    Y estoy creando un nuevo caso
    Cuando selecciono una verificación externa
    Y proporciono los datos requeridos
    Y ejecuto la consulta
    Entonces el sistema debe:
      - Enviar solicitud a la API externa
      - Recibir y procesar la respuesta
      - Incorporar los datos al caso
      - Actualizar el estado de verificación
      - Registrar la consulta en audit log

  Escenario: Monitorear uso de APIs
    Dado que tengo integraciones activas
    Cuando accedo al monitoreo de APIs
    Entonces el sistema debe mostrar:
      - Número de consultas realizadas
      - Respuestas exitosas vs fallidas
      - Tiempo promedio de respuesta
      - Límites de uso próximos
      - Costos de consulta si aplican

  Escenario: Manejar errores de integración
    Dado que una integración está configurada
    Y la API externa retorna error
    Cuando ocurre un fallo en la consulta
    Entonces el sistema debe:
      - Mostrar mensaje de error específico
      - Intentar reintento si está configurado
      - Registrar el error en logs
      - Proporcionar opción de reintento manual
      - Mantener datos del caso sin datos externos

  Escenario: Sincronización automática de datos
    Dado que tengo integraciones con sincronización automática
    Y está configurado un schedule de actualización
    Cuando se ejecuta la sincronización
    Entonces el sistema debe:
      - Descargar datos actualizados
      - Comparar con datos existentes
      - Actualizar casos que requieran cambios
      - Notificar sobre actualizaciones importantes
      - Reportar estadísticas de sincronización

  Criterios de Aceptación:
  - Las credenciales de API deben almacenarse de forma segura
  - Los errores de API deben manejarse graciosamente
  - Las integraciones deben respetar límites de rate limiting
  - Los datos externos deben validarse antes de usar
  - Las sincronizaciones deben ser auditables
  - El sistema debe mantener funcionamiento sin dependencias externas