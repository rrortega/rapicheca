# Historia de Usuario: Mejorar Layout del Dashboard con Sidebar Colapsable

## Resumen
Como usuario de la plataforma de estudios socioeconómicos, quiero tener un dashboard con un layout mejorado que incluya un sidebar colapsable para optimizar el espacio de la pantalla y facilitar la navegación.

## Contexto
El dashboard actual tiene un layout básico que no aprovecha eficientemente el espacio de pantalla y no permite a los usuarios colapsar la navegación para tener más espacio para el contenido.

## Características Principales

### 1. Sidebar Colapsable
- **Funcionalidad:** El sidebar debe poder colapsarse y expandirse
- **Botón Toggle:** Icono de chevron para controlar el estado del sidebar
- **Estado Inicial:** Expandido por defecto
- **Animaciones:** Transiciones suaves al cambiar entre estados
- **Espacio:** Ancho completo (256px) cuando está expandido, colapsado (64px) cuando está contraído

### 2. Navegación Mejorada
- **Dashboard:** Página principal con estadísticas y overview
- **Expedientes:** Gestión de casos de estudios socioeconómicos
- **Plantillas:** Manejo de plantillas de estudios
- **Workspaces:** Selección y gestión de espacios de trabajo
  - Opción para crear nuevo workspace
- **Mi Cuenta:** Configuración de perfil de usuario
- **Usuarios:** Gestión de usuarios del workspace
- **Configuración:** Panel de configuración general
- **Facturación:** Gestión de créditos y facturación

### 3. Indicadores Visuales
- **Estado Activo:** Resaltado visual del elemento de navegación actual
- **Tooltips:** Información mostrada al pasar el cursor sobre elementos colapsados
- **Iconos:** Identificación visual clara de cada sección
- **Información de Workspace:** Display del nombre y plan del workspace actual

### 4. Experiencia de Usuario
- **Responsive:** Adaptable a diferentes tamaños de pantalla
- **Overlay Móvil:** Capa oscura para mejorar la experiencia en dispositivos móviles
- **Accesibilidad:** Navegación por teclado y lectores de pantalla
- **Persistencia:** El estado del sidebar se mantiene durante la sesión

## Criterios de Aceptación

### Gherkin: Sidebar Colapsable

```gherkin
Feature: Sidebar Colapsable del Dashboard

  Scenario: Usuario colapsa el sidebar
    Given que estoy en el dashboard con el sidebar expandido
    When hago clic en el botón de colapso (chevron izquierdo)
    Then el sidebar debe colapsarse mostrando solo iconos
    And el contenido principal debe ajustarse al espacio disponible
    And debe mostrarse un tooltip con el nombre del elemento al pasar el cursor

  Scenario: Usuario expande el sidebar
    Given que estoy en el dashboard con el sidebar colapsado
    When hago clic en el botón de expansión (chevron derecho)
    Then el sidebar debe expandirse mostrando iconos y texto
    And el contenido principal debe ajustarse al espacio disponible
    And la información del workspace debe ser visible

  Scenario: Navegación a diferentes secciones
    Given que tengo el sidebar visible con opciones de navegación
    When hago clic en "Expedientes"
    Then debo navegar a la página de casos/expedientes
    And el elemento "Expedientes" debe resaltarse como activo
    When hago clic en "Plantillas"
    Then debo navegar a la página de plantillas
    And el elemento "Plantillas" debe resaltarse como activo

  Scenario: Crear nuevo workspace
    Given que estoy en la sección de workspaces
    When hago clic en el botón "+" (plus) en la información del workspace
    Then debo navegar a la página de creación de nuevo workspace
    And debe abrirse un formulario o modal para crear workspace

  Scenario: Visualización en móvil
    Given que estoy en un dispositivo móvil
    When el sidebar está expandido
    Then debe mostrarse un overlay oscuro
    When hago clic fuera del sidebar o en el botón de colapso
    Then el sidebar debe cerrarse automáticamente
    And el overlay debe disappear
```

### Gherkin: Navegación y Rutas

```gherkin
Feature: Sistema de Rutas Protegidas

  Scenario: Acceso a rutas protegidas sin autenticación
    Given que no estoy autenticado en el sistema
    When intento acceder a "/dashboard"
    Then debo ser redirigido a la página de login
    When intento acceder a "/cases"
    Then debo ser redirigido a la página de login

  Scenario: Acceso a rutas públicas autenticado
    Given que estoy autenticado en el sistema
    When accedo a "/login"
    Then debo ser redirigido automáticamente al dashboard
    When accedo a "/register"
    Then debo ser redirigido automáticamente al dashboard

  Scenario: Navegación entre páginas del dashboard
    Given que estoy autenticado y en el dashboard
    When navego a diferentes secciones usando el sidebar
    Then el contenido debe cambiar pero mantener el layout del sidebar
    And la información del usuario y workspace debe persistir
    And el elemento de navegación activo debe actualizarse
```

## Implementación Técnica

### Componentes Principales
- **DashboardLayout.tsx:** Layout principal con sidebar colapsable
- **ProtectedRoute.tsx:** Componente para rutas protegidas
- **App.tsx:** Configuración de rutas y navegación

### Tecnologías Utilizadas
- **React Router v6:** Sistema de enrutamiento
- **TypeScript:** Tipado estático
- **Tailwind CSS:** Estilos y responsividad
- **Lucide React:** Iconografía
- **React Hooks:** Estado y efectos

### Estados y Lógica
- **isCollapsed:** Estado del sidebar (colapsado/expandido)
- **Navegación:** Array de objetos con ruta, nombre e icono
- **Autenticación:** Verificación de usuario autenticado
- **Workspace:** Información del workspace actual

## Beneficios para el Usuario

1. **Optimización de Espacio:** Mayor área de contenido al colapsar el sidebar
2. **Navegación Intuitiva:** Acceso rápido a todas las funciones del sistema
3. **Experiencia Consistente:** Layout uniforme en todas las páginas del dashboard
4. **Responsividad:** Funciona correctamente en desktop y móvil
5. **Accesibilidad:** Soporte para navegación por teclado y lectores de pantalla

## Métricas de Éxito

- **Tiempo de Carga:** < 2 segundos para transiciones del sidebar
- **Responsividad:** Funciona correctamente en pantallas desde 320px hasta 2560px
- **Usabilidad:** Reducción del 30% en tiempo de navegación entre secciones
- **Accesibilidad:** Puntuación AA en tests de accesibilidad
- **Satisfacción:** > 85% de satisfacción en testing de usuario

## Próximos Pasos

1. **Testing de Usuario:** Pruebas con usuarios reales del sistema
2. **Optimización de Performance:** Monitoreo de métricas de carga
3. **Mejoras de Accesibilidad:** Implementar navegación por teclado completa
4. **Funcionalidades Adicionales:** 
   - Persistencia del estado del sidebar en localStorage
   - Shortcuts de teclado para navegación rápida
   - Breadcrumbs para navegación contextual