#language: es
Funcionalidad: Sistema de Créditos y Facturación

  Como usuario del sistema de estudios socioeconómicos
  Quiero gestionar mis créditos y facturación
  Para poder controlar el uso del servicio según mi plan

  Escenario: Verificar balance de créditos
    Dado que estoy autenticado en mi workspace
    Cuando accedo a la información del workspace
    Entonces el sistema debe mostrar:
      - Balance actual de créditos disponibles
      - Créditos utilizados en el mes actual
      - Límite mensual según el plan
      - Proyección de uso para el resto del período
      - Fecha de renovación de créditos

  Escenario: Comprar créditos adicionales
    Dado que mi balance de créditos está bajo
    Y tengo permisos para gestionar facturación
    Cuando accedo a la sección de créditos
    Y selecciono un paquete de créditos
    Y completo el proceso de pago
    Entonces el sistema debe:
      - Procesar el pago a través de Stripe
      - Acreditar los créditos a mi workspace
      - Actualizar el balance disponible
      - Registrar la transacción en el historial
      - Enviar confirmación por email

  Escenario: Ver historial de transacciones
    Dado que tengo transacciones de créditos
    Cuando accedo al historial de facturación
    Entonces el sistema debe mostrar:
      - Lista de todas las transacciones
      - Créditos comprados con fecha y monto
      - Créditos utilizados por operación
      - Refunds y ajustes si aplican
      - Balance resultante de cada transacción

  Escenario: Gestionar plan de workspace
    Dado que tengo permisos para gestionar facturación
    Cuando accedo a la gestión del plan
    Entonces el sistema debe mostrar:
      - Plan actual (basic, professional, enterprise)
      - Límites del plan actual
      - Opciones de upgrade/downgrade
      - Costo del nuevo plan
      - Fecha de facturación próxima

  Escenario: Límites de plan alcanzados
    Dado que he alcanzado los límites de mi plan
    Cuando intento crear un nuevo caso
    Entonces el sistema debe:
      - Mostrar mensaje de límite alcanzado
      - Sugerir upgrade del plan o compra de créditos
      - Bloquear la operación hasta obtener más créditos
      - Ofrecer opciones para resolver la situación

  Escenario: Renovación automática de plan
    Dado que tengo un plan con renovación automática
    Cuando se acerca la fecha de renovación
    Entonces el sistema debe:
      - Notificar sobre la renovación próxima
      - Mostrar el costo de renovación
      - Procesar el pago automáticamente
      - Renovar el plan y créditos
      - Enviar confirmación de renovación

  Criterios de Aceptación:
  - Los créditos deben descontarse correctamente por operación
  - El sistema debe respetar los límites del plan del workspace
  - Los pagos deben procesarse de forma segura a través de Stripe
  - El historial de transacciones debe ser preciso y completo
  - Las notificaciones de límites deben ser oportunas
  - La renovación automática debe funcionar sin interrupciones
  - Los refunds deben procesarse según las políticas establecidas