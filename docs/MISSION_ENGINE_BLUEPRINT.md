# Sistema Central de Misiones o Nodos accionables de contenido (Mission Engine)

Este documento detalla la arquitectura DESEAD para construir el motor de misiones o contenido accionable en forma de nodos. El objetivo es crear un sistema que permita estandarizar y gestionar todo el contenido accionable de la aplicación. Es decir, cualquier elemento que sea "pulsable", "estudiable", "visualizable", "interaccionable" y que requiera de una reacción o cambio en la aplicación, ya sea que sean nodos que aparecen de forma recurrente, por semana, por mes, fechas arbitrarías, con un  tiempo limite o no, una sola vez, agrupados, lineales o ramificados.  En esta versión del documento aún no se han creado los archivos clave para la misión engine.

## 1. Arquitectura Central Propuesta

### Archivos Clave Propuestos

// NOTA PARA GEMINI: Esto es parte del blueprint, pero si por cuestiones tecnicas, o para maximizar la estandarizacion/agnosticismo de la engine o para hacerlo más ligero o rápido sugieres otra cosa, DÍMELO.
1. **`src/store/slices/createEngineSlice.js` (El Cerebro):** Contiene las funciones y los arreglos globales, y el **Selector Puro** (`useMissionNode`).
2. **`src/data/missionCatalog.js` (El Catálogo):** La base de datos cruda de todos los nodos que se comportan como: misiones si es una app rpg, información si es una app tipo tienda/documentación, tareas si es un organizador, etc. Todo lo que sea "accionable" se define en este archivo.

SCHEMA PROPUESTO PARA ESTE ARCHIVO:
const missionSchemaTemplate = {
  // 1. IDENTIFICACIÓN ÚNICA
  id: "m_tarot_basico_01",
  type: "course_step", // 'daily_habit', 'rpg_quest', 'finance_goal', 'experience_guide'
  
  // 2. META Y NARRATIVA (Lo que lee el usuario)
  meta: {
    title: "El Viaje del Loco",
    description: "Aprende el significado de la carta número 0.",
    lore: "Spiral te mira fijamente y deja caer una carta en tu regazo...", // Texto narrativo RPG/NPC
    origin: "npc_spiral", // Puede ser 'system', 'npc_spiral', o 'user_created' (para apps de tareas)
    tags: ["tarot", "principiante", "arcano_mayor"] // Para agrupar y filtrar
  },

  // 3. DISPONIBILIDAD Y DESBLOQUEO (¿Cuándo y cómo puedo hacerla?)
  availability: {
    requiresMissions: ["m_intro_00"], // Misiones que deben completarse antes (Dependencias)
    requiresCost: [{ currency: "stars", amount: 50 }], // Si la misión se "compra" en una tienda
    requiresState: [{ stat: "moon_phase", operator: ">=", value: 50 }], // Condiciones del jugador
    timeWindow: {
      activeDays: ["Monday", "Wednesday"], // Nulo si es siempre
      expiresInHours: 24, // Para misiones de tiempo limitado o eventos
      specificDateRange: null // Para retos mensuales o de temporada
    }
  },

  // 4. EJECUCIÓN Y RECURRENCIA (¿Qué debo hacer y cuántas veces?)
  execution: {
    objectiveType: "interaction", // 'boolean' (click done), 'collect' (items), 'input' (escribir algo)
    targetValue: 1, // Cuántas veces debo hacerlo (ej. Tomar 3 vasos de agua)
    recurrence: {
      isRepeatable: true, // True para hábitos diarios/labores del hogar
      resetType: "calendar", // 'calendar' (se reinicia al llamar a "START_NEW_DAY") o 'timer' (horas exactas desde que se hizo)
      cooldownDays: 1, // Si es 'calendar', cuántos "Nuevos Días" deben pasar para que se reactive (1 = diario)
      maxCompletions: 1 // Límite de veces que da recompensa en su intervalo de activación
    }
  },

  // 5. RECOMPENSAS Y CASTIGOS (Lo que gano al terminar)
  outcomes: {
    onComplete: {
      currencies: [{ type: "stars", amount: 75 }],
      points: [{ type: "moon_points", amount: 10 }],
      items: [{ id: "item_polvo_lunar", qty: 1 }],
      unlocks: ["m_tarot_basico_02"] // Desbloquea el siguiente nodo automáticamente
    },
    onFail: {
      // Opcional: penalizaciones si el tiempo expira (ej. pierdes racha)
      currencies: [] 
    }
  },

  // 6. CONTENIDO Y UI (El "Payload" visual)
  content: {
    hasMultimedia: true,
    media: [
      { type: "image", url: "/assets/cards/el_loco.jpg" },
      { type: "video", url: "https://..." }
    ],
    // AQUÍ ESTÁ LA MAGIA PARA TUS NOTAS COMPLEJAS:
    customComponent: "TarotSpreadInteractive", // Le dice a la UI de React qué componente especial cargar
    componentProps: { spreadType: "past_present_future" }, // Datos que necesita ese componente
    // NOTA TÉCNICA (Desacoplamiento): Para mantener el motor 100% puro y agnóstico, el catálogo envía solo un STRING (ej. "countdown" o "TarotSpread").
    // En la capa de React, existirá un "Diccionario de Registro de Componentes" (un mapa) que traducirá este string al componente de React real importado.
    // De esta forma, el motor de estado NUNCA tiene dependencias de UI (React) y no se rompe si compilamos la app para otro entorno.
  }

//7.: FEEDBACK Y GRACE MECHANICS //Colecta información sobre la ejecución de la actividad o misión para modificar los premios, ocurre justo antes de dar el premio o premios
feedbackSteps: [  //si no contiene steps, esta mecanica es “skip”
  {
    stepId: "step_time_sleep",
    type: "multiple_choice",
    question: "¿A qué hora realmente cerraste los ojos?",
    value: [  //valor para el “type”, en este caso sus choices
	{
	label: "¡Antes de las 11:00 PM!",
	value: "perfect",
	rewardMultiplier: 1.5, // 50% de bonus por excelencia
	feedbackLore: "Spiral ronronea feliz, ¡dormiste excelente!" 
	spiralMessageID: mañana_Mejor,
	}, 
	{ 
	label: "Cerca de las 12:00 AM", 
	value: "good", 
	rewardMultiplier: 1.0, // Recompensa base normal 
	feedbackLore: "Spiral asiente, un buen esfuerzo." 
	spiralMessageID: mañana_Mejor,
	}, 
	{ 
	label: "Cerca de la 1:00 AM o más...",
	value: "okay", 
	rewardMultiplier: 0.5, // Gana algo, pero menos (buffer de empatía)
	feedbackLore: "Spiral te da un empujoncito. Mañana lo haremos mejor."
	spiralMessageID: mañana_Mejor,
	 } ] 
  },
//Ejecuta el siguiente paso en caso de existir, los siguientes son tipos posibles distintos de steps, sin embargo por ahora considero que la gran mayoría serían multiple choice para estandarizar lo más posible.
  {
    stepId: "step_intensidad",
    type: "slider",
    question: "Del 1 al 10, ¿qué tan fuerte fue?",
    value: 8	// Aquí el valor del slider (ej. 8) podría multiplicarse por una penalización o recompensa
  },
  {
    stepId: "step_notas",
    type: "text_input",
    question: "Añade notas para tu expediente (opcional)"
  }
]

};

3. **`src/data/collectionIndex.js` (El indice de items):** Este documento sirve para "organizar" los items por su ID. Permite crear colecciones para distintos escenarios, ejemplos: recetas de cocina, hacks para el hogar, rutina matutina, programa de detox, curso de tarot, main quest, side quests, quests por NPC, etc. Con la peculiaridad de poder ser editables o no (dependiendo el fin de la app a crear)

Para lograr el "Santo Grial" del diseño de software (escribir el motor de renderizado y validación una sola vez y que sirva para cualquier app), necesitamos un Esquema de Colección Universal.

El secreto para unificar un curso lineal, un RPG ramificado y una lista dinámica de tareas de hogar es estandarizar dos cosas: Las Reglas de Flujo (behavior.flow) y el Enrutamiento (next).

SCHEMA PROPUESTO:
const collectionSchemaTemplate = {
  collectionId: "col_id_unico", // Puede ser una rutina, un curso, un proyecto CRM
  
  meta: {
    title: "Nombre del Grupo",
    category: "tag_agrupador", // Para la UI (ej. 'rutinas', 'cursos', 'proyectos')
  },

  // EL CEREBRO DEL MOTOR: Le dice a la UI cómo comportarse con esta colección
  behavior: {
    flow: "linear", // 'linear', 'branching', 'unordered'
    isUserEditable: false, // True para las listas de tareas del usuario
    activeDays: ["Monday", "Wednesday"] // Nulo si siempre está activa
  },

  // EL MAPA: Siempre es un array de objetos, sin importar el caso de uso.
  nodes: [
    {
      nodeId: "m_001", // Referencia al missionCatalog.js
      
      // LA ESTANDARIZACIÓN DEL 'NEXT': Siempre es un objeto (o null).
      // El motor siempre buscará: next[eleccionUsuario] o next["default"]
      next: {
        "default": "m_002" 
      }
    }
  ]
};

¿Cómo el Motor lee este MISMO esquema en escenarios extremos?
Aquí está la magia de por qué tu código central en Zustand nunca tendrá que cambiar.

Escenario 1: La app de Tareas del Hogar / Rutina (Unordered)
La usuaria arma su rutina para el domingo.

{
  collectionId: "col_domingo_limpieza",
  meta: { title: "Limpieza Profunda" },
  behavior: {
    flow: "unordered", // <--- EL MOTOR LEE ESTO
    isUserEditable: true,
    resetSchedule: "weekly",
    activeDays: ["Sunday"]
  },
  nodes: [
    { nodeId: "m_barrer", next: null },
    { nodeId: "m_trapear", next: null },
    { nodeId: "m_ventanas", next: null }
  ]
}
Cómo actúa el Motor: Como el flow es "unordered", el motor ignora el next. Simplemente toma todos los nodeId, busca su info en el catálogo y le dice a la UI: "Dibuja todos estos nodos al mismo tiempo en una lista". Como isUserEditable es true, le muestra el botón de "Añadir Tarea".

Escenario 2: El Curso de Espiritualidad (Linear)
Un curso estricto paso a paso.
{
  collectionId: "col_curso_chakra_1",
  meta: { title: "Despertando el Chakra Raíz" },
  behavior: {
    flow: "linear", // <--- EL MOTOR LEE ESTO
    isUserEditable: false,
    resetSchedule: "never",
    activeDays: "all"
  },
  nodes: [
    { 
      nodeId: "m_leccion_1", 
      next: { "default": "m_leccion_2" } 
    },
    { 
      nodeId: "m_leccion_2", 
      next: { "default": "m_quiz_final" } 
    },
    { 
      nodeId: "m_quiz_final", 
      next: null // Fin de la colección
    }
  ]
}

Cómo actúa el Motor: Como el flow es "linear", el motor le dice a la UI: "Solo dibuja el nodo donde va el usuario". Cuando el usuario completa m_leccion_1, el motor busca la llave "default" y automáticamente lo mueve a m_leccion_2.

Escenario 3: La Mini Novela / RPG (Branching)
Historia interactiva donde el feedback cambia el rumbo.
{
  collectionId: "col_historia_bosque",
  meta: { title: "El Bosque Susurrante" },
  behavior: {
    flow: "branching", // <--- EL MOTOR LEE ESTO
    isUserEditable: false,
    resetSchedule: "never",
    activeDays: "all"
  },
  nodes: [
    { 
      nodeId: "m_encrucijada_01", 
      next: { 
        "ataque_magico": "m_batalla_ganada", // Coincide con el 'value' del feedbackLoop del Catálogo
        "huida": "m_batalla_perdida" 
      } 
    },
    { nodeId: "m_batalla_ganada", next: { "default": "m_tesoro" } },
    { nodeId: "m_batalla_perdida", next: null }
  ]
}

Cómo actúa el Motor: Al ser "branching", la usuaria hace la misión y en el "Feedback Loop" (que definimos antes) elige la opción que vale "ataque_magico". El motor toma ese string, va al nodo actual y dice: ¿A dónde lleva "ataque_magico"? Ah, a "m_batalla_ganada". Y carga ese nodo.

La Elegancia del Código (Por qué no hay código espagueti)
Con este esquema estandarizado, la función central de tu motor que calcula "qué sigue" se reduce a unas cuantas líneas infalibles:

// Pseudocódigo del corazón de tu engine
avanzarNodo: (collectionId, currentNodeId, userFeedbackValue) => {
  const collection = getCollection(collectionId);
  
  if (collection.behavior.flow === "unordered") return; // No hay 'siguiente'

  const currentNode = collection.nodes.find(n => n.nodeId === currentNodeId);
  
  // Magia pura: Busca la ruta elegida, si no existe, usa "default"
  const nextNodeId = currentNode.next[userFeedbackValue] || currentNode.next["default"];
  
  if (nextNodeId) {
    setActiveNode(nextNodeId);
  } else {
    completarColeccion(collectionId);
  }
}

Mover una misión de una colección a otra no implica reescribir datos, descripciones ni recompensas. Es, literalmente, sacar una palabra de un array y meterla en otro.

¿Cómo se ve esto en tu "Cerebro" (Zustand)?
Solo necesitarías una función en tu store que haga este movimiento. Sería algo tan sencillo y magro como esto:

JavaScript
moverMision: (origenColeccionId, destinoColeccionId, nodeId) => {
  set((state) => {
    const origen = state.colecciones.find(c => c.collectionId === origenColeccionId);
    const destino = state.colecciones.find(c => c.collectionId === destinoColeccionId);

    // 1. EL ESCUDO PROTECTOR (La magia del Schema)
    // Si la usuaria intenta arrastrar "Lavar trastes" al Curso de Tarot, el motor la bloquea.
    if (!origen.behavior.isUserEditable || !destino.behavior.isUserEditable) {
      console.warn("Movimiento denegado: Una de las colecciones está bloqueada.");
      return state; 
    }

    // 2. EL MOVIMIENTO (Sustraer y Añadir)
    // Quitamos el nodo del origen
    const origenLimpio = origen.nodes.filter(n => n.nodeId !== nodeId);
    
    // Lo añadimos al destino (conservando la estructura del objeto 'next')
    const destinoActualizado = [...destino.nodes, { nodeId: nodeId, next: null }];

    // 3. ACTUALIZAR EL ESTADO
    return {
      colecciones: state.colecciones.map(c => {
        if (c.collectionId === origenColeccionId) return { ...c, nodes: origenLimpio };
        if (c.collectionId === destinoColeccionId) return { ...c, nodes: destinoActualizado };
        return c;
      })
    };
  });
}

Si construyes una app de organización libre (tipo Notion o Todoist): Tu interfaz simplemente tendrá un botón de "Crear Nueva Lista". Al darle clic, la UI genera un nuevo objeto JSON con isUserEditable: true y lo inyecta en el estado de Zustand.

Si construyes una app basada en un método estricto (o un RPG/Curso): Simplemente no programas ese botón de "Crear" en la interfaz. Entregas el estado inicial de Zustand con las colecciones ya pre-llenadas y el motor las procesará con la misma naturalidad.


4. **`src/components/ui/MissionRenderer.jsx` (El Pintor):** Componente de UI que recibe las propiedades y las dibuja en pantalla.Su trabajo es leer el esquema y decidir qué "Lego" poner en la pantalla:

function MissionRenderer({ nodeId }) {
  const node = useMissionNode(nodeId);

  // 1. INYECTA EL CONTENIDO VISUAL
  // Si el esquema dice que hay un componente personalizado, lo inyecta mágicamente.
  // Si no, muestra el título y descripción estándar.
  const visualContent = node.content.customComponent 
    ? DynamicComponentLoader(node.content.customComponent) 
    : <StandardText title={node.meta.title} lore={node.meta.lore} />;

  // 2. INYECTA EL MECANISMO DE EJECUCIÓN (El Gatillo)
  // Lee cómo se debe completar la misión y dibuja el botón correcto.
  let executionUI;
  if (node.execution.objectiveType === "interaction") {
     executionUI = <HoldButton onComplete={() => completeMission(nodeId)} />;
  } else if (node.execution.feedbackSteps) {
     executionUI = <FeedbackLoop steps={node.execution.feedbackSteps} onFinish={...} />;
  }

  // 3. RENDERIZA LA CAJA ESTANDARIZADA
  return (
    <Card isLocked={!node.isAvailable}>
      {visualContent}
      {executionUI}
    </Card>
  );
}


---

### El Selector Puro (`useMissionNode`)
Igual que pides un mensaje por su ID en message engine (o spiralengine), la UI nunca debería tener que escarbar en el estado global para encontrar una misión. Necesitas un selector puro que extraiga los datos y calcule su estado en tiempo real.

En lugar de que la página de la rutina lea todo el JSON, hace esto:
// El componente solo pide lo que necesita
const { meta, availability, content, isCompleted } = useMissionNode("m_agua_01");
Este selector es el que, tras bambalinas, llama a la función interna evaluateAvailability() para devolverle a la UI si la misión está bloqueada, disponible o en cooldown, sin que la UI tenga que hacer una sola operación matemática.

"Al frente de la cola" -> "El Puntero Activo"
En tus message engine, el engine los forma en una cola por prioridades. En el Mission Engine, esto equivale al Puntero del Flujo (activeNodeId).

Cuando tu colección es linear (un curso) o branching (una historia), no le muestras todos los nodos al usuario. La UI simplemente llama a un selector especial:

// La UI pide "lo que sea que siga" en este curso
const currentNodeData = useActiveCollectionNode("col_curso_tarot");

El motor hace el cálculo y le escupe a la UI solamente los datos del nodo actual. Cuando la usuaria termina, la función advanceFlow() mueve el puntero internamente, y la UI se actualiza sola con el siguiente paso.

---

### Funciones propuestas para zustand (acciones)
Las siguientes son funciones que se proponen para poder editar/manipular los nodos de esta engine de forma agnóstica sin importar el tipo de APP que se construye:

PARTE 1: Gestión de Colecciones (El Índice / collectionIndex)
Estas funciones manipulan los "Contenedores" (añadir rutinas, mover tareas de día, etc.).

createCollection(payload): Crea una nueva colección personalizada (si la app permite isUserEditable: true). Recibe el título, el tipo de flujo (unordered, linear) y los días activos.

deleteCollection(collectionId): Elimina una colección entera.

updateCollectionMeta(collectionId, metaPayload): Para editar el nombre, icono o etiqueta de una colección.

addNodeToCollection(collectionId, nodeId): Inserta una misión (solo su ID) al final del array nodes de una colección.

removeNodeFromCollection(collectionId, nodeId): Quita un nodo específico de una colección (sin borrarlo del catálogo general).

moveNode(sourceColId, destColId, nodeId): La función estrella para el Drag & Drop. Saca el nodo de una carpeta y lo mete en otra (evaluando antes si ambas tienen isUserEditable: true).

reorderNodeInCollection(collectionId, nodeId, newIndex): Para cuando la usuaria arrastra una tarea arriba o abajo dentro de la misma lista para cambiar su prioridad.

resetCollection(collectionId): Borra el progreso de todos los nodos de esta colección. Vital para el resetSchedule (por ejemplo, limpiar todas las tareas a las 00:00).

PARTE 2: Gestión de Ejecución y Nodos (El Progreso de las Misiones)
Estas funciones manejan la lógica de si se completó la misión, si está en cooldown, y cómo aplicar los multiplicadores del feedbackSteps.

evaluateAvailability(nodeId): (Función Interna/Getter) Revisa el schema de la misión y el estado actual del jugador. Devuelve un booleano true/false. Revisa si tiene el nivel necesario, si no está en cooldown, o si estamos en los días activos permitidos. La UI usa esto para pintar el botón en gris o bloqueado.

startMission(nodeId): Registra el momento exacto (Timestamp) en que se inició la misión. Útil para calcular si el usuario tardó mucho o para misiones que requieren "10 minutos de lectura".

addProgressToNode(nodeId, amount): Para misiones donde targetValue > 1. Por ejemplo, "Tomar 3 vasos de agua". Esta función suma +1. Si llega a 3, dispara automáticamente la compleción.

submitFeedbackStep(nodeId, stepId, value): Guarda temporalmente la respuesta de la usuaria en un paso del Feedback Loop (ej. guardando el rewardMultiplier de la opción que eligió).

completeMission(collectionId, nodeId): (La Función Maestra) * Suma todos los multiplicadores recolectados en los feedbackSteps.

Toma los outcomes.onComplete (estrellas, polvos lunares) y los multiplica.

Llama al store global de economía y deposita el premio.

Registra el Timestamp de compleción para iniciar el cooldown (si isRepeatable es true).

advanceFlow(collectionId, currentNodeId, feedbackValue): (El Navegador) Se ejecuta justo después de completeMission. Lee el behavior.flow de la colección.

Si es unordered: No hace nada.

Si es linear o branching: Lee el objeto next del nodo actual y determina cuál es el ID del siguiente nodo a cargar en pantalla.

failMission(collectionId, nodeId): Dispara los castigos (si los hay) definidos en outcomes.onFail. Se ejecuta si el timeWindow expiró y la usuaria no lo logró.

resetCalendarDay(): (La Función "One to Rule Them All") Itera sobre todo el motor restando 1 día al cooldown de las misiones completadas. Si el cooldown llega a 0, la misión vuelve a estar activa. Reemplaza cualquier necesidad de loops manuales o cálculos de fechas complejas.


---

## 5. Mejores Prácticas y Reglas de Implementación Futuras

**AL AGREGAR UNA NUEVA CARACTERÍSTICA QUE REQUIERA MISIONES:**

1. **lista de mejores prácticas**, aún no esta dada de alta, pues esto lo adquiriremos con la PRÁCTICA. //NOTA PARA GEMINI


---

## 6. Nomenclatura del Catálogo (`missionCatalog.js`, `collectionIndex.js`)

Cada entrada en `missiongCatalog.js` es un objeto que define las propiedades de un nodo.
Cada entrada en `collectionIndex.js` es un objeto que define el comportamiento de una colección.

### Propiedades disponibles:
NOTA PARA GEMINI: NO LAS ENUMERO AQUÍ, POR QUE TÚ LAS PONDRÁS CUANDO TENGAMOS EL SCHEMA FINAL, PERO POR AHORA PUEDES REVISAR EL SCHEMA PROPUESTO ARRIBA SI QUIERES VER LAS PROPIEDADES.

### ¿Cómo lo usa la UI?
Cuando el selector puro, le entrega la misión en puntero a la UI, llega transformado en un objeto simple, la UI lo pasa como *props* al componente missionRenderer, el cual renderiza de acuerdo a las propiedades enviadas. (se definió anteriormente ya en este documento) NOTA PARA GEMINI: Aquí describiremos el comportamiento final, (ya creada la engine, te pediré que lo anotes).

---

## 7. Interfaces de Comunicación (Funciones para la UI)

La lista está arriba en funciones propuestas. Nota para Gemini: UNA VEZ TENGAMOS LA ENGINE FINALIZADA AQUÍ LAS ESCRIBIRÁS PARA TENER DOCUMENTADO TODO

---

## 8. Notas Técnicas de Rendimiento y Arquitectura (Zustand & React)

Para asegurar que esta arquitectura no colapse cuando la aplicación crezca, se deben respetar dos reglas técnicas estrictas al implementar el `Mission Engine` en código.

### A. Separación del "Disco del Juego" (Estático) y la "Partida Guardada" (Dinámico)
El error más común en aplicaciones de React es meter todo el JSON estático dentro del manejador de estado global. Esto infla la memoria y ralentiza la aplicación.
*   **El Disco del Juego (`missionCatalog.js` y `collectionIndex.js`):** Es inmutable. Contiene las descripciones, imágenes, lore, y reglas. **Nunca** debe guardarse en Zustand (a menos que el usuario sea quien lo esté creando desde cero).
*   **La Partida Guardada (Zustand - `engineSlice`):** Zustand **solo** debe almacenar el progreso mutado, lo estrictamente necesario para saber dónde está el usuario.
    *   *Si la colección es estricta (RPG/Curso con `isUserEditable: false`):* Zustand solo guarda referencias, ej: `{ collectionId: "col_tarot", activeNodeId: "m_leccion_2", completedNodes: ["m_leccion_1"] }`.
    *   *Si la colección es libre (Todo List con `isUserEditable: true`):* Como el usuario está armando la lista dinámicamente, aquí Zustand sí debe guardar el array de los IDs (`nodes: [...]`) para recordar el orden que el usuario eligió.

### B. Evaluación de Disponibilidad y Prevención de Re-Renders (Performance)
Al tener misiones que dependen del tiempo (`cooldowns`, `expiresInHours`), es peligroso hacer cálculos directamente en la UI, ya que llamadas constantes a funciones dinámicas pueden causar bucles infinitos de *re-renders* (parpadeos en pantalla y lentitud).
*   La función `evaluateAvailability(nodeId)` mencionada en las acciones no debe llamarse libremente dentro del retorno de React.
*   Debe implementarse utilizando un **Selector Puro Memoizado** (con herramientas como `useShallow` de Zustand). 
*   Esto asegura que el motor evalúe en segundo plano si un `cooldown` ya terminó, y **solamente inyecte una actualización a la vista de React en el milisegundo exacto** en que el estado pasa de bloqueado a disponible. Así, un componente de React (ej. el botón de la misión) renderiza solo 1 vez cuando cambia su disponibilidad, manteniendo la app fluida a 60FPS.

---

## 9. Guía Rápida de Implementación (Cheat Sheet)
¿Necesitas hacer uso de la Engine en algo nuevo?:
NOTA PARA GEMINI: aquí agregaras un cheat sheet para esta mission engine (te lo pediré una vez finalizemos de implementarla en la app actual)