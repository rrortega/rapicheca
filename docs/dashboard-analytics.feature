#language: es
Funcionalidad: Dashboard y Analytics

  Como usuario del sistema de estudios socioeconómicos
  Quiero ver un dashboard con métricas y analytics
  Para poder monitorear el rendimiento y uso del workspace

  Escenario: Ver dashboard principal
    Dado que estoy autenticado
    Y accedo al dashboard del workspace
    Entonces el sistema debe mostrar:
      - Resumen de casos creados este mes
      - Balance de créditos actual
      - Uso mensual de créditos
      - Casos pendientes de verificación
      - Actividad reciente del equipo
      - Alertas y notificaciones importantes

  Escenario: Analytics de casos procesados
    Dado que tengo casos en el workspace
    Cuando accedo a los analytics de casos
    Entonces el sistema debe mostrar:
      - Gráfico de casos creados por período
      - Tiempo promedio de procesamiento
      - Distribución por tipo de estudio
      - Casos completados vs pendientes
      - Tasa de éxito de verificaciones

  Escenario: Métricas de rendimiento del equipo
    Dado que soy administrador del workspace
    Cuando veo las métricas del equipo
    Entonces el sistema debe mostrar:
      - Productividad por usuario
      - Casos procesados por analista
      - Tiempo promedio por tipo de caso
      - Distribución de carga de trabajo
      - Alertas de usuarios inactivos

  Escenario: Reportes de cumplimiento
    Dado que tengo permisos de visualización de analytics
    Cuando genero un reporte de cumplimiento
    Entonces el sistema debe incluir:
      - Casos procesados en período seleccionado
      - Verificaciones KYC completadas
      - Porcentaje de cumplimiento regulatorio
      - Alertas de casos críticos
      - Recomendaciones de mejora

  Escenario: Configurar alertas personalizadas
    Dado que tengo permisos para gestionar el workspace
    Cuando accedo a la configuración de alertas
    Y configuro umbrales personalizados
    Y guardo la configuración
    Entonces el sistema debe:
      - Monitorear los umbrales configurados
      - Enviar notificaciones cuando se superen
      - Registrar alertas en el sistema
      - Permitir ajustar sensibilidad de alertas

  Criterios de Aceptación:
  - Los dashboards deben cargar rápidamente
  - Las métricas deben ser precisas y actualizadas
  - Los gráficos deben ser interactivos y exportables
  - Las alertas deben ser oportunas y relevantes
  - Los reportes deben cumplir con formatos regulatorios
  - Los datos deben ser filtrables por fecha y usuario