# Enrutamiento de la Engine (Migration & Routing Plan)

Este documento detalla la investigación sobre cómo las funciones actuales de la página principal (Dashboard) serán interceptadas, desmanteladas o enrutadas hacia el nuevo **Mission Engine**. 

## 1. El Estado Global (Zustand)

### A. La Matanza de `activities`
Actualmente, `createDashboardSlice.js` mantiene un array gigante llamado `activities` que lleva el control manual de `completions`, `fullyCompleted`, `usedForRitual` y `periodStartDate`. 
**El Cambio:** Este array completo **desaparecerá**. El estado del progreso de las misiones vivirá única y exclusivamente dentro de `engineState.collections["col_dashboard_habits"].nodesState`.

### B. Adiós a `usedForRitual`
Actualmente, cuando la usuaria completa el Ritual de Luna Llena, se llama a un loop que pone `usedForRitual: true` a las tareas hechas. Como acordamos (filosofía UX First + Hold to Complete), **esto se elimina por completo**.
Al hacer "Hold" en una actividad, esta ganará sus puntos de luna y pasará instantáneamente a estado `completed` con un `cooldownRemaining`. El ritual ya no necesita secuestrar las actividades, simplemente consumirá los 100 puntos de luna y listo. 

## 2. Enrutamiento de Acciones (Actions Routing)

### A. `toggleActivity` ➡️ `completeMission`
**Actual:** Calcula compleciones múltiples, verifica si se cruzó una fase lunar (Cuarto Creciente, Llena, etc.), inyecta estrellas, manda mensajes de Spiral, y actualiza el estado.
**Nuevo Flujo:**
1. La UI llamará a la acción agnóstica del motor: `engineSlice.addProgressToNode(nodeId)` o `engineSlice.completeMission(nodeId)`.
2. El motor actualizará su estado interno (ponerlo en "completed" y asignarle cooldown).
3. **El Puente (Solución de Desacoplamiento):** Como el Motor no sabe qué es una "Luna", crearemos una función interceptora en el store llamada `processOutcomes(outcomes)`. El motor extraerá los premios del `missionCatalog` y se los pasará a esta función.
4. `createDashboardSlice` solo se dedicará a escuchar `processOutcomes` para subir los `progressPoints` de la Luna y disparar mensajes de Spiral.

### B. `startNewDay` ➡️ `resetCalendarDay`
**Actual:** Calcula manualmente la diferencia de fechas con `calculateDaysDifference` iterando por cada actividad para reiniciar sus variables.
**Nuevo Flujo:** Cuando el manejador global dispara la transición de media noche (acción `START_NEW_DAY`), en lugar de iterar manualmente, llamaremos simplemente a la "One to Rule Them All": `engineSlice.resetCalendarDay()`. El motor se encarga de restar el cooldown a todo automáticamente.

### C. `useMoonDust` ➡️ `completeMission("m_polvo_lunar")`
**Actual:** Existe una función especializada en `createDashboardSlice` que resta -1 polvo de luna y suma +20 puntos.
**Nuevo Flujo:** El polvo lunar ahora es un simple nodo dentro de `missionCatalog`. Al hacer "Hold", se llamará a `completeMission("m_polvo_lunar")`. El motor detectará en sus `outcomes` que otorga 20 puntos de luna y gasta 1 polvo lunar (`requiresCost`). Todo el código de `useMoonDust` en el slice será borrado.

### D. `claimMoonReward` (El Ritual)
**Actual:** Da la carta, resetea la luna a Nueva y marca las tareas como usadas.
**Nuevo Flujo:** Dará la carta y reseteará los `progressPoints` a 0. No tocará las actividades para nada, manteniendo la separación de responsabilidades perfecta.

## 3. Enrutamiento de UI (`DashboardPage.jsx`)

### A. Mapeo de Tarjetas
**Actual:** Usa un montón de lógica incrustada en el JSX:
```javascript
const mappedActivities = globalActivities.filter(...).map(...)
const freeActivities = [...]
const usedActivities = [...]
```
Y renderiza componentes `<GlassCard>` directos llenos de `if/else` para saber si poner estrellitas, lunitas mágicas, etc.

**Nuevo Flujo:**
1. `DashboardPage.jsx` llamará al selector puro: `const nodeIds = useCollectionNodes("col_dashboard_habits")`.
2. Hará un simple `map` sobre esos IDs para renderizar el nuevo componente inteligente: 
   ```javascript
   nodeIds.map(id => <MissionRenderer key={id} nodeId={id} />)
   ```
3. Toda la lógica engorrosa de "si es especial, ponle destellos", "si está completada, ponla gris", "si no tengo polvo, escóndela", se muda dentro de `MissionRenderer` y su selector puro `useMissionNode`.

---
## Resumen del Impacto

Esta migración eliminará aproximadamente el **60% del código de espagueti** en el `DashboardPage` y limpiará por completo las matemáticas raras de fechas del `createDashboardSlice`. La comunicación será en una sola vía:

`UI (MissionRenderer) ➔ Engine (completeMission) ➔ Outcomes (processOutcomes) ➔ UI (Moon Graphic)`
