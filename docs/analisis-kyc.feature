#language: es
Funcionalidad: Análisis KYC y Verificaciones

  Como analista del sistema de estudios socioeconómicos
  Quiero realizar verificaciones KYC y análisis de background
  Para poder cumplir con requisitos regulatorios y evaluar riesgos

  Escenario: Activar verificación KYC en workspace
    Dado que mi plan incluye verificación KYC
    Y tengo permisos para gestionar integraciones
    Cuando accedo a la configuración de KYC
    Y habilito la funcionalidad
    Entonces el sistema debe:
      - Activar los campos de verificación KYC
      - Configurar las reglas de validación requeridas
      - Habilitar la consulta a bases de datos externas
      - Mostrar las opciones de verificación disponibles

  Escenario: Realizar verificación de identidad
    Dado que la verificación KYC está habilitada
    Y tengo un caso en proceso
    Cuando proporciono los datos de identidad del sujeto
    Y ejecuto la verificación
    Entonces el sistema debe:
      - Validar la información proporcionada
      - Consultar bases de datos oficiales
      - Verificar documentos de identidad
      - Generar reporte de verificación
      - Asignar un score de confianza

  Escenario: Consulta de antecedentes
    Dado que el workspace tiene habilitada la función de background checks
    Y tengo permisos para realizar verificaciones
    Cuando inicio una consulta de antecedentes
    Entonces el sistema debe:
      - Consultar registros públicos disponibles
      - Verificar historial crediticio si está autorizado
      - Revisar listas de sanciones
      - Generar reporte de antecedentes
      - Documentar todas las fuentes consultadas

  Escenario: Motor de scoring automático
    Dado que el motor de scoring está habilitado
    Y tengo un caso completo con datos socioeconómicos
    Cuando ejecuto el análisis automático
    Entonces el sistema debe:
      - Aplicar las reglas de scoring configuradas
      - Analizar todos los datos recolectados
      - Calcular score de riesgo
      - Generar recomendaciones
      - Proporcionar justificación del resultado

  Escenario: Reporte de cumplimiento regulatorio
    Dado que he completado verificaciones en múltiples casos
    Cuando genero un reporte de cumplimiento
    Entonces el sistema debe mostrar:
      - Casos procesados en el período
      - Verificaciones completadas exitosamente
      - Alertas de casos que requieren atención
      - Estadísticas de scoring
      - Recomendaciones de mejora

  Criterios de Aceptación:
  - Las verificaciones KYC deben cumplir con regulaciones locales
  - Los datos personales deben manejarse de forma segura
  - El motor de scoring debe ser configurable por workspace
  - Los reportes deben incluir trazabilidad completa
  - Las integraciones externas deben ser confiables
  - Los resultados deben ser auditables y defendibles