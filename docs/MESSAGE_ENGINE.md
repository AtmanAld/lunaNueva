# Sistema Central de Mensajería (Message Engine)

Este documento detalla la arquitectura técnica del motor de mensajes de Luna Nueva. Su propósito es servir como la fuente única de verdad (Single Source of Truth) para la implementación de cualquier nuevo mensaje, diálogo o interacción en el futuro, garantizando que no se rompa la arquitectura ni se introduzca lógica "spaghetti" en la UI.

## 1. Arquitectura Central

### Archivos Clave
1. **`src/store/slices/createMessageSlice.js` (El Cerebro):** Contiene el arreglo global `messageQueue`, la lógica de encolado (`enqueueMessage`), y el **Selector Puro** (`selectActiveMessage`).
2. **`src/data/spiralCatalog.js` (El Catálogo):** La base de datos cruda de todos los mensajes, textos (incluidos los arrays de aleatoriedad), videos y botones. TODO texto mostrado debe existir aquí.
3. **`src/components/ui/SpiralMessage.jsx` (El Pintor):** Componente de UI que recibe las propiedades y las dibuja en pantalla.

---

### El Selector Puro (`selectActiveMessage`)
Es la única vía por la cual la UI consulta qué mensaje mostrar.
- Recibe el `state` de Zustand y el `scope` actual de la página.
- Filtra la cola (`messageQueue`) eliminando los mensajes de un scope distinto al actual (a menos que sean `global`).
- Ordena los mensajes válidos **estrictamente por prioridad (mayor a menor)**. En caso de empate, ordena por timestamp (el último en llegar gana).
- **IMPORTANTE:** Siempre devuelve la referencia de memoria exacta del mensaje (ej. `validRequests[0]`) almacenada en la cola. Jamás devuelve un nuevo objeto creado al vuelo `{...}` para evitar bucles infinitos de re-renders provocados por la validación de igualdad estricta (`Object.is`) de Zustand.

---

## 2. Niveles de Prioridad (Jerarquía Estricta)

El sistema soporta y resuelve conflictos matemáticamente usando una escala del 1 al 6.

* **Nivel 1 (Fondos / Ambientales):** Lo que Spiral dice o hace cuando la usuaria está inactiva. (Ej. `SPIRAL_FELIZ`, `REVIEW_DAY_WAITING`). Es decir, no requiere interacción del usuario para aparecer.
* **Nivel 2 (Interacciones / Tareas Menores):** Diálogos secundarios disparados por interacciones, entregan premios, o hacen preguntas rápidas (Ej. Recompensa pendiente `THANKS_WATER`, Confirmación `CONFIRM_WATER`). Tapan al fondo.
* **Nivel 3 (Alertas Efímeras):** Mensajes que desaparecen solos con temporizador. (Ej. "Spiral rechaza el agua", "Faltan recursos").
* **Nivel 4 (Modales / Recompensas Mayores):** Bloquean el flujo general exigiendo interacción de la usuaria. (Ej. `DASHBOARD_FULL_MOON`, "Carta mágica descubierta").
* **Nivel 5 (Estados Críticos del Juego):** Estados primordiales que obligan un reinicio de ciclo o validación estricta antes de dar regalos. (Ej. `NEW_DAY_PROMPT`, `REVIEW_DAY_PROMPT`, o sus secuelas como "Haz los cambios y luego reiniciamos"). **Aplastan a la Prioridad 4**.
* **Nivel 6 (Sistema Supremo):** Tutoriales irrompibles o errores del sistema general.

---

## 3. Scope (Enrutamiento Contextual)

Cada mensaje tiene asignado un `scope` al crearse (ej. `'pet'`, `'dashboard'`, `'ritual'`, `'global'`).
Si un mensaje crítico de Prioridad 5 ("Nuevo Día") se encola para el `scope: 'dashboard'`, este **secuestrará el Dashboard**, pero no molestará a la usuaria si cambia a la página de Spiral (`scope: 'pet'`).
Sin embargo, dado que el mensaje nunca fue desencolado (`dequeueMessage`), al regresar al Dashboard, la página volverá a ser interceptada por este mensaje. Así logramos modales persistentes por sección.

---

## 4. Resolución de Variables y Aleatoriedad (Antiparásitos Visuales)

Si el `spiralCatalog.js` tiene múltiples opciones de texto para un ID (`text: ["Hola", "Qué tal"]`), el motor NUNCA permite que la UI las lea directamente.

Al usar `enqueueMessage`, la función `resolveMessageVariablesNew`:
1. Ejecuta `Math.random()` **una sola vez**.
2. Reemplaza cualquier variable interpolada (`{{userName}}`, `{{stars}}`).
3. Sella el resultado final en la propiedad `resolvedText` del objeto encolado.

**Resultado:** Se elimina por completo el parpadeo de textos ("glitch") en pantalla causado por los renders de React.

---

## 5. Mejores Prácticas y Reglas de Implementación Futuras

**AL AGREGAR UNA NUEVA CARACTERÍSTICA QUE REQUIERA MENSAJES:**

1. **PROHIBIDO HARDCODEAR TEXTOS EN LA UI:** Cualquier mensaje de Spiral, sea alerta, error, o recompensa, debe estar registrado en `spiralCatalog.js`.
2. **ASIGNACIÓN DE PRIORIDAD DIRECTA:** En el catálogo, aséguarate de incluir la propiedad `priority: X`. (Por defecto será 1 si la omites).
3. **NO USAR `setState` O VARIABLES LOCALES PARA MOSTRAR MENSAJES:** Usa siempre `enqueueMessage(source, catalogId, extraData, scope)` para insertarlo, y `dequeueMessage(source)` para borrarlo.
4. **MENSAJES TEMPORALES:** Para alertas que deben irse solas, usa `setScopedEphemeralMessage`. El motor respetará automáticamente la duración especificada en `duration` dentro del catálogo (o 4000ms por defecto).
5. **EL SELECTOR NO SE TOCA:** Jamás envuelvas o alteres la salida de `selectActiveMessage` creando nuevos objetos para mutar en JSX; dáselo directamente a `<SpiralMessage>`.
6. **FALLBACK DE PRIMER RENDER:** Dado que Zustand encola los primeros mensajes en el ciclo `useEffect` inicial de las páginas, el primerísimo frame de React puede arrojar `activeMessage === null`. Siempre inyecta un *fallback estático local simple* derivado de la lógica para evitar cuadros vacíos al cargar (Ej. La lógica actual en `SpiralPetPage.jsx`).

---

## 6. Nomenclatura del Catálogo (`spiralCatalog.js`)

Cada entrada en `spiralCatalog.js` es un objeto que define el comportamiento y apariencia del mensaje.

### Propiedades disponibles en el Catálogo:
* **`text`** *(String | Array de Strings)*: El diálogo a mostrar. Puede contener variables como `{{userName}}` o `{{stars}}`. Si es un arreglo, el motor elige uno al azar.
* **`priority`** *(Number)*: El nivel de prioridad (1 al 6). Si se omite, el motor asume Prioridad 1 (Ambiental).
* **`video`** *(String)*: Ruta relativa al video de fondo (ej. `"assets/videos/spiral_feliz.mp4"`). Si se omite, se mostrará el fallback de arte estático.
* **`duration`** *(Number)*: Tiempo en milisegundos que el mensaje permanecerá visible. Solo tiene efecto si el mensaje es invocado vía `setScopedEphemeralMessage`. Si se omite y no hay botones, dura 4000ms.
* **`actionConfig`** *(Array de Objetos)*: Define los botones interactivos que aparecerán bajo el mensaje. Cada botón tiene:
  * `label` *(String)*: El texto del botón.
  * `type` *(String)*: El tipo de acción que dispara en el store (ej. `"USE_PET_ITEM"`, `"CLAIM_MOON_REWARD"`).
  * `variant` *(String)*: Estilo visual (`"highlighted"` o `"normal"`, no hay ningún otro estilo visual).
  * `icon` *(String)*: Identificador del icono a usar. **Nota Importante:** Los iconos no se importan directamente en el catálogo. Se usa un string en minúsculas (ej. `"check"`, `"star"`) que debe estar pre-registrado en el diccionario `ICON_MAP` ubicado al inicio del archivo `src/components/ui/SpiralMessage.jsx`. Si necesitas un icono nuevo, debes importarlo en ese archivo (desde `lucide-react`) y agregarlo al diccionario.
  * `data` *(Cualquier tipo)*: Información extra (ej. el ID del item a usar). Puede contener variables interpoladas como `{{itemId}}`.

### ¿Cómo lo usa la UI?
Cuando el Selector Puro (`selectActiveMessage`) le entrega el mensaje "ganador" a la UI, este llega transformado en un objeto simple (`{ id, text, video, actionConfig, source }`). La UI simplemente se lo pasa como *props* al componente `<SpiralMessage />`, el cual renderiza el texto, reproduce el `video` (si existe), y mapea el arreglo `actionConfig` para dibujar los botones correspondientes de la interfaz.

---

## 7. Interfaces de Comunicación (Funciones para la UI)

Cuando la UI (o cualquier *slice*) necesita mandar a llamar un mensaje, usa una de estas funciones inyectadas por Zustand.

### A. `enqueueMessage(source, catalogId, extraData = {}, scope = 'global')`
Útil para mensajes que se quedan en pantalla hasta que la usuaria interactúe o se limpien manualmente.
- **`source`** *(String)*: Un ID único para rastrear *quién* pidió el mensaje (ej. `'pet_ambient'`, `'pending_reward'`). Permite sobrescribir o borrar mensajes del mismo origen sin afectar otros.
- **`catalogId`** *(String)*: La llave exacta del mensaje en `spiralCatalog.js` (ej. `"SPIRAL_FELIZ"`).
- **`extraData`** *(Object)*: Variables dinámicas que inyectarás en el texto o botones (ej. `{ stars: 5, itemName: "Agua" }`). Estas variables reemplazarán a `{{stars}}` o `{{itemName}}` respectivamente.
- **`scope`** *(String)*: Contexto de pantalla donde debe aparecer (ej. `'pet'`, `'dashboard'`, `'global'`).

### B. `setScopedEphemeralMessage(source, catalogId, extraData = {}, scope = 'global')`
Útil para notificaciones volátiles que desaparecen solas con el tiempo.
- Recibe exactamente los mismos parámetros que `enqueueMessage`.
- Su característica especial es que lee la propiedad `duration` del catálogo (o espera 4 segundos por defecto) e inicia un cronómetro. Al cumplirse el tiempo, ejecuta un `dequeueMessage` automáticamente sobre el `source` indicado, borrando el mensaje de la pantalla.
- Si se envía un `catalogId === null` para el mismo `source`, el mensaje y su temporizador se destruyen prematuramente.

### C. `dequeueMessage(source)`
- **`source`** *(String)*: Remueve de la cola a todos los mensajes que compartan este origen. Útil al desmontar componentes (`useEffect return`) o cuando una tarea de fondo termina.

---

## 8. Scopes Soportados (Lista Oficial)

Para evitar colisiones o duplicar contextos bajo nombres similares (ej. `'mascota'` vs `'pet'`), limítate a utilizar estrictamente los siguientes `scopes` registrados. Si una nueva sección gigante de la app se crea en el futuro, agrégala aquí primero.

* **`'global'`**: El mensaje interrumpe a la usuaria sin importar en qué pantalla o ruta se encuentre. Debe usarse con mucha precaución (ej. errores de servidor, baneos).
* **`'dashboard'`**: Página principal (rutas raíz). Útil para las recompensas de inicio de día, eventos lunares y revisión.
* **`'pet'`**: Página de interacción con Spiral. 
* **`'ritual'`**: El Overlay o Modal inmersivo del Pentáculo de Manifestación.
* **`'store'`**: La tienda mágica.
* **`'album'`**: La página de la enciclopedia o cartas mágicas.

!Importante: Si estamos creando una nueva sección, sugiéreme la creación de un nuevo scope, pues cada uno de estos scopes corresponden a una sección particular de la aplicación. Y un scope debe tener un nombre "único" (no repetir nombres de secciones existentes)..

---

## 9. Guía Rápida de Implementación (Cheat Sheet)
¿Necesitas agregar un nuevo mensaje o modal a la aplicación usando el Motor Spiral? Sigue estos sencillos pasos según tu caso de uso:
### Paso 1: Registrar el mensaje en `spiralCatalog.js`
Toda interacción comienza agregando una entrada en el catálogo de mensajes.
**Caso A: Mensaje efímero simple (No bloquea, desaparece solo)**
```javascript
  MIAU_HAMBRE: {
    text: "Miau, ¡tengo mucha hambre!",
    priority: 3, // Alerta Efímera
    duration: 3000 // Desaparece en 3 segundos
  },
```
**Caso B: Modal Bloqueante (Requiere interacción)**
```javascript
  RECOMPENSA_SECRETA: {
    text: "¡Felicidades {{userName}}! Encontraste un secreto.",
    priority: 4, // Modal
    actionConfig: [
      { label: "Reclamar", type: "RECLAMAR_SECRETO", variant: "modal_highlighted", icon: "star" }
    ]
  },
```
### Paso 2: Invocar el mensaje desde la UI o Zustand
**Caso A: Lanzar un mensaje efímero (Ej: Al pulsar un botón sin fondos)**
Usa `setScopedEphemeralMessage`. El motor se encarga de mostrarlo y borrarlo automáticamente.
```javascript
// Desde Zustand o dentro de un componente React:
useGameStore.getState().setScopedEphemeralMessage(
  'hambre_alert', // Source (ID único para identificar de dónde viene)
  'MIAU_HAMBRE',  // ID del Catálogo
  {},             // Variables extra (vacío si no hay)
  'pet'           // Scope (dónde aparece)
);
```
**Caso B: Lanzar un Modal persistente (Ej: Evento de Recompensa)**
Usa `enqueueMessage`. El mensaje NO desaparecerá hasta que el usuario interactúe y tú lo borres.
```javascript
useGameStore.getState().enqueueMessage(
  'secreto_evento',      // Source
  'RECOMPENSA_SECRETA',  // ID del Catálogo
  { userName: "Bruja" }, // Inyección de variables
  'dashboard'            // Scope
);
```
### Paso 3: Dibujar el mensaje en la Interfaz (JSX)
En el componente correspondiente al `scope` (ej. DashboardPage.jsx), asegúrate de que estás usando el selector puro y pasando los datos a `<SpiralMessage>`.
**Para Mensajes Efímeros/Flotantes (Fondo):**
```jsx
const activeMessage = useGameStore(state => selectActiveMessage(state, 'dashboard'));
{/* Se dibuja solo si no hay un modal bloqueante activo */}
{!isModalActive && activeMessage && (
  <SpiralMessage
    message={activeMessage.text}
    video={activeMessage.video}
    // ... config básica
  />
)}
```
**Para Modales Bloqueantes:**
La vista delega TODO el diseño del botón a SpiralMessage mediante `centerContent` y `actionConfig`.
```jsx
<ActionModalOverlay isActive={isModalActive}>
  {activeMessage && (
    <SpiralMessage
      message={activeMessage.text}
      isOverlayMode={true}
      centerContent={true} // <-- CLAVE: SpiralMessage dibuja los botones al centro
      actionConfig={activeMessage.actionConfig || []}
      onAction={handleGlobalAction}
      // ... config de modal
    />
  )}
</ActionModalOverlay>
```
### Paso 4: Manejar la acción (Para los Modales)
Cuando el usuario presiona el botón, `<SpiralMessage>` llama a `onAction` (ej. `handleGlobalAction`). Aquí debes ejecutar la lógica de la recompensa y **muy importante**, decirle al motor que ya puede borrar el mensaje usando `dequeueMessage`.
```javascript
const handleGlobalAction = (action) => {
  if (action.type === 'RECLAMAR_SECRETO') {
    // 1. Ejecutas la lógica del juego (dar monedas, etc)
    console.log("Secreto reclamado");
    
    // 2. Eliminas el mensaje de la cola manualmente usando su 'source'
    useGameStore.getState().dequeueMessage('secreto_evento');
  }
};