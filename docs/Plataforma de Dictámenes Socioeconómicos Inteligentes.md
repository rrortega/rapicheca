Rediseño Integral de la Plataforma de Dictámenes Socioeconómicos Inteligentes

## 🎯 Objetivo General

Rediseñar y construir una plataforma **multi-tenant y totalmente automatizada** que permita a brokers, despachos, aseguradoras o empresas crear, personalizar y ejecutar **flujos de dictámenes socioeconómicos o financieros** bajo su propio workspace.  

Cada workspace opera como una entidad independiente con su propia **configuración, branding, plan de créditos, facturación y flujos personalizados**, y permite definir tanto la estructura como la lógica de evaluación para distintos usos (arrendamientos, membresías, créditos, seguros, becas, etc.).

---

## ⚙️ Concepto Central: Multi-Tenant por Workspace

Cada **workspace** representa una entidad autónoma.  
Los datos, branding, suscripción, créditos, usuarios, plantillas, flujos y métricas se aíslan completamente entre workspaces.

### Atributos del Workspace
- **Datos generales:** Nombre comercial, Razón Social, RFC, dirección, contacto.  
- **Branding:** Logo, colores, textos y pantallas finales personalizadas.  
- **Plan de suscripción:** mensual con créditos incluidos, con opción a créditos on-demand.  
- **Usuarios:** owner, admins, analistas y lectores con permisos configurables.  
- **Facturación:** historial de consumos, pagos y top-ups.  
- **Dashboard y KPIs:** métricas de desempeño, uso de créditos, tasa de aprobación, tiempos promedio, etc.  
- **Plantillas de dictamen:** flujos configurables por tipo de servicio o análisis.  

---

## 🧩 Arquitectura funcional del flujo

### 1️⃣ Onboarding del Workspace
1. Creación de cuenta.
2. Configuración de datos fiscales y contacto.
3. Elección de plan y método de pago.
4. Personalización visual (logo, colores, textos, pantalla de finalización).
5. Asignación inicial de créditos.
6. Invitación de usuarios al workspace.

---

### 2️⃣ Configuración de Plantillas de Dictamen

Cada plantilla representa un **flujo personalizable** para evaluar a los aplicantes de un determinado servicio.

#### Pasos configurables:
1. **Cuestionario** (personal, laboral, familiar, financiero).
2. **Validación de identidad** (documentos, rostro, fuentes oficiales).
3. **Carga de documentos** (estados de cuenta, comprobantes, etc.).
4. **Referencias personales o laborales** (voz o WhatsApp).
5. **Verificaciones externas** (empresa, redes, antecedentes, opcional).
6. **Scoring y dictamen** (motor de decisión).
7. **Pantalla final y branding** (configurable por plantilla).

#### Opciones de personalización:
- Reordenar pasos del flujo (drag & drop).
- Definir canales (voz, WhatsApp, formulario web, híbrido).
- Activar/desactivar validaciones.
- Configurar **porcentaje máximo de carga financiera** (relación ingreso/gasto).
- Personalizar mensajes, pantallas de fin y recomendaciones.
- Clonar, versionar y exportar plantillas.

---

### 3️⃣ Creación de Expedientes (Casos)

- Cada expediente representa un **solicitante** que sigue un flujo definido.  
- El owner o analista puede crear expedientes manualmente o vía API.  
- Envío de invitaciones:
  - Email
  - SMS
  - WhatsApp
  - Llamada automatizada
- Enlace único para iniciar el proceso.  
- Seguimiento en tiempo real y control de progreso.  
- Consumo de créditos por paso del flujo.  
- Reanudación automática al recargar créditos si el caso quedó pausado.

---

### 4️⃣ Experiencia del Solicitante

- **Interfaz web/PWA** sencilla, accesible y con identidad visual del workspace.
- Flujo guiado paso a paso con:
  - Consentimiento legal.
  - Formulario progresivo.
  - Subida de documentos validada.
  - Contacto automático con referencias (voz o WA).
  - Seguimiento del progreso (% completado).
- Al finalizar:
  - Resultado básico visible: *Aprobado / Condicional / Rechazado*.
  - Recomendaciones automáticas si está “cerca del umbral”.
  - Opción de revisión humana si lo requiere.

---

### 5️⃣ Análisis y Dictamen Automático

- Validaciones automáticas:
  - **Identidad:** comparación facial y documental.
  - **Finanzas:** lectura y análisis de ingresos, estabilidad y variaciones.
  - **Referencias:** interpretación de respuestas y coherencia.
  - **Contexto:** validación cruzada con información pública opcional.
- Motor de decisión parametrizable:
  - **Pesos y reglas** por variable (identidad, finanzas, referencias, contexto).
  - **Umbrales** de aprobación, condicional o rechazo.
  - **Explicaciones** del dictamen.
- Resultados generados en minutos:
  - Score (0–100)
  - Estado final
  - Resumen explicativo
  - PDF y JSON descargables

---

### 6️⃣ Vista del Owner y Analistas

- **Dashboard del workspace:**
  - Créditos disponibles y consumidos.
  - Expedientes activos, en pausa o completados.
  - Tiempo promedio de dictamen.
  - Distribución de resultados.
  - Consumo por plantilla o canal.
- **Gestión de expedientes:**
  - Vista general con filtros.
  - Detalle completo (documentos, logs, resultados, acciones).
  - Posibilidad de reintentar pasos, forzar revisión o compartir acceso.
- **Gestión de créditos:**
  - Visualización de saldo y consumo.
  - Compra inmediata de créditos on-demand.
  - Notificaciones de saldo bajo.

---

## 💳 Sistema de Créditos

- Cada acción (OCR, llamada, validación, análisis) tiene un costo en créditos.  
- Los créditos se consumen en tiempo real conforme avanza el expediente.  
- Si no hay saldo suficiente:
  - El expediente queda **pausado** automáticamente.
  - Se reanuda al recargar créditos.
- El owner puede **comprar créditos on-demand** o mejorar su plan.
- Registro histórico de uso y facturación mensual.

---

## 📊 Métricas y Analítica (por Workspace)

**Indicadores clave:**
- Expedientes procesados / pendientes.
- Promedio de tiempo a dictamen.
- % automatización total y por paso.
- Tasa de aprobación / condicional / rechazo.
- Costo medio por dictamen.
- Ranking de causas de rechazo.
- Créditos consumidos por tipo de validación.

**Visualizaciones:**
- Funnel de conversión por plantilla.
- Evolución temporal de dictámenes.
- Comparativas entre plantillas.
- Heatmaps de errores o cuellos de botella.

---

## 🧱 Principales componentes UI

### A. Builder de Plantillas
- Interfaz de flujo visual (drag & drop)
- Editor de pasos, preguntas y canales
- Configurador de scoring y parámetros financieros
- Branding y pantalla de finalización
- Previsualización en modo solicitante

### B. Dashboard del Workspace
- Vista global con métricas, créditos y accesos rápidos
- Secciones:
  - Expedientes
  - Plantillas
  - Créditos
  - Usuarios
  - Facturación
  - Configuración general

### C. Vista del Solicitante
- Proceso guiado y claro
- Branding del workspace visible
- Indicador de progreso
- Validaciones en tiempo real
- Resultado básico con recomendaciones

---

## 🔐 Cumplimiento y Ética

- Cumplimiento integral con **LFPDPPP**.  
- Consentimiento explícito y granular por tipo de validación.  
- Derechos ARCO (exportación o eliminación).  
- Auditoría completa de accesos y acciones.  
- Cifrado en tránsito y reposo.  
- Registro de consentimiento y hash de dictamen.  
- Revisión humana posible en casos condicionales o impugnados.

---

## 🚀 Entregables del Rediseño

1. Arquitectura multi-tenant funcional (con colecciones, roles y flujos).
2. UI/UX completa:
   - Onboarding workspace.
   - Builder de plantillas.
   - Dashboard y métricas.
   - Experiencia del solicitante.
3. Motor de scoring parametrizable.
4. Sistema de créditos y facturación.
5. Plantillas y flujos listos para verticales comunes.
6. Documentación funcional y legal.
7. Manual de operación y despliegue.

---

## ✅ Criterios de Éxito

- Dictamen generado en **≤30 minutos**.  
- ≥80% de pasos automatizados.  
- Cumplimiento legal y trazabilidad completa.  
- Experiencia fluida tanto para el solicitante como para el analista.  
- Personalización total de flujos por workspace.  
- Escalabilidad y aislamiento de datos garantizados.

---

## 🧠 Instrucción para la IA Multiagente

> Rediseñar la plataforma completa basándose en este documento.  
> Entregar los flujos funcionales, la arquitectura de entidades, la experiencia de usuario completa y el sistema multi-tenant con workspaces configurables.  
> Incluir prototipos de interfaz (wireframes), estructura de datos, especificaciones funcionales y documentación integral del flujo.

**Foco:**  
- Experiencia personalizada por workspace.  
- Configuración completa del dictamen (flujo, branding, umbrales, canales).  
- Procesos automatizados y trazables.  
- Escalabilidad por créditos y planes de uso.