# Diseño del Motor Reactivo (createEngineSlice)

Este documento define la arquitectura, el estado interno y las funciones del Mission Engine en Zustand. 
El objetivo es que este código sea 100% agnóstico y sirva para cualquier aplicación, rigiéndose por los principios de "Cero Sobreingeniería" y "UX First".

## 1. El Estado Base (`engineState`)

El motor manejará su propio "Universo" dentro del store, completamente aislado de los estados específicos de la app.

```javascript
engineState: {
  collections: {
    "col_set_1": {
      currentNodeId: null, // Vital para colecciones lineales (indica dónde va el jugador)
      nodesState: {
        "m_tomar_pastillas": {
          status: "active", // Posibles: "active", "completed", "locked"
          progress: 0, // Cuántas veces se ha hecho (si targetValue > 1)
          cooldownRemaining: 0 // Días restantes para volver a estar "active"
        }
      }
    }
  }
}
```

## 2. La Lógica de Cooldown y "Nuevo Día"

El usuario marca su propio ritmo. No guardamos fechas de inicio estrictas (`periodStartDate`), abrazamos la flexibilidad.
- **Al completar una misión:** 
  El motor cambia el estado a `status: "completed"`, y establece la variable `cooldownRemaining` usando el valor de `cooldownDays` del catálogo.
- **La Función "One to Rule Them All" (`resetCalendarDay`):** 
  Al llamar a esta función (que simula el inicio de un nuevo día para el usuario), el motor itera sobre todos los nodos completados. Si `cooldownRemaining > 0`, se le resta 1. Si llega a `0`, el nodo vuelve a ser `status: "active"` y `progress: 0`.
- **Ventaja UX:** Una tarea con cooldown de 7 días no presiona al usuario. Si tarda 10 días en hacerla, no pasa nada; simplemente se bloqueará por 7 días a partir del momento en que la haga. Completada = en cooldown. No completada = libre de cooldown.

## 3. Desacoplamiento (Ej. La Luna)

Fieles al principio de evitar abstracciones prematuras, el motor no tendrá un "Enrutador de Puntos Universal". 
- **Simplicidad:** El Engine solo se encarga de cambiar el estado interno del nodo y ejecutar `completeMission`.
- **Responsabilidad delegada:** Al completarse, el motor dispara los `outcomes`. El slice específico de la app (ej. `createDashboardSlice`) es quien lee ese evento y decide sumar `moonPhase.progressPoints` a su propia variable.
- **Agnosticismo:** Para hacer que los nodos de la luna avancen, usaremos la propiedad nativa del Blueprint: `requiresState: [{ stat: "moon_points", operator: ">=", value: 25 }]`. El motor solo leerá esta variable externa. Si en el futuro hacemos una app de granjas que usa `stat: "water_drops"`, el motor funcionará exactamente igual.

## 4. Acciones Base del Engine

El slice expondrá estas acciones puras:
- `initEngine()`: Construye el `engineState` inicial fusionando el `collectionIndex.js` estático con el progreso guardado del usuario (si lo hay).
- `addProgressToNode(nodeId, collectionId, amount)`: Suma progreso. Si `progress >= targetValue`, llama automáticamente a `completeMission`.
- `completeMission(nodeId, collectionId)`: Marca como `completed`, asigna el `cooldownRemaining`, maneja el avance si es un flujo `linear`, y devuelve los `outcomes` para que el resto de la app (como DashboardSlice) aplique las recompensas.
- `resetCalendarDay()`: Itera por todo el estado restando 1 al cooldown de los nodos completados.

## 5. Selectores (La Conexión con la UI)

El motor debe ser una "caja negra" para la UI. Los componentes de React NUNCA deben leer `state.engineState` directamente. En su lugar, el engine expondrá **Selectores Puros** (optimizados con `useShallow` para evitar re-renders).

### A. `useCollectionNodes(collectionId)`
El componente padre (ej. `DashboardPage`) solo llama a este hook.
- **Flujo Unordered (Rutinas):** Devuelve un array con TODOS los `nodeId` de la colección.
- **Flujo Linear (Cursos/Luna):** Devuelve UN SOLO `nodeId` (el `currentNodeId` en el que va el usuario).
- *Retorno:* `["m_tomar_pastillas", "m_usar_bicicleta"]`

### B. `useMissionNode(nodeId)`
El componente hijo (`MissionRenderer`) llama a este hook pasándole el ID.
Este selector hace el "Heavy Lifting" (El trabajo pesado):
1. **Fusión:** Toma los datos estáticos del `missionCatalog.js` (título, estrellas) y los fusiona con los datos dinámicos del `engineState` (status, progress).
2. **Evaluación en Tiempo Real:** Llama a la función interna `evaluateAvailability(nodeId)` que checa si el usuario tiene el "polvo lunar" necesario (`requiresCost`), si la luna está en la fase correcta (`requiresState`), o si está dentro de las horas activas (`timeWindow`).
3. *Retorno:* Devuelve un objeto "listo para renderizar":
   ```javascript
   {
     id: "m_tomar_pastillas",
     title: "Tomar pastillas",
     category: "Wellness",
     isAvailable: true, // Resultado de evaluateAvailability
     status: "active", // "active", "completed", "locked"
     progress: 0,
     targetValue: 1,
     rewards: { stars: 15, moon_points: 4 }
   }
   ```
De esta manera, la UI es extremadamente tonta. Solo dibuja lo que el selector le entrega.

## 6. Funciones Pendientes (Fuera del alcance del MVP actual)

Las siguientes funciones son vitales para lograr el "Santo Grial" del motor (100% genérico), pero han sido pausadas en la iteración actual (MVP) para no inflar el código innecesariamente. Se codificarán en el futuro cuando las necesitemos:

### Gestión de Colecciones (Ej. Drag & Drop o Customización)
- `createCollection`, `deleteCollection`, `updateCollectionMeta`, `addNodeToCollection`, `removeNodeFromCollection`, `moveNode`, `reorderNodeInCollection`, `resetCollection`.

### Ejecución Avanzada (RPG / Branching)
- `startMission(nodeId)`: Para registrar el timestamp exacto de inicio.
- `submitFeedbackStep(nodeId, stepId, value)`: Para capturar temporalmente opciones elegidas en un Quiz o Branching.
- `advanceFlow(collectionId, currentNodeId)`: El navegador puro que decide a qué nodo saltar según el feedback. Por ahora (MVP), asumiremos que el flujo avanza de forma simple o es "unordered".
- `failMission(collectionId, nodeId)`: Para ejecutar castigos si el temporizador de la misión expiró.
