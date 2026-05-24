# 🌌 Blueprints del Store (Zustand) - Luna Nueva

Este documento define la arquitectura de estado global para el proyecto. Está diseñado para ser escalable, fácil de leer y listo para ser implementado con **Zustand**.

## 🏗️ Organización del Store
Utilizaremos el **Pattern de Slices**. Todos los slices se combinarán en un único store central (`useStore`), lo que permite que las funciones puedan acceder a datos de cualquier sección fácilmente.

---

## 👤 1. User Slice (Identidad y Moneda)
*El núcleo del perfil y la economía de la app.*

### Estado (State)
- `userName`: String (Inicial: "Amelia")
- `userLevel`: String (Inicial: "New Moon")
- `userAvatar`: String (URL o Placeholder)
- `userStars`: Number (Las estrellas gastables, Inicial:600)
- `statistics`: Object
    - `totalStarsEarned`: Number (Histórico, Inicial:600)
    - `totalMoney`: Number (Canjeado del álbum, Inicial:0)
    - `totalMoons`: Number (Ciclos de luna completos, Inicial:0)
    - `totalTasksCompleted`: Number (Tareas completadas en total, equivale a la experiencia para subir de nivel, Inicial:0)

### Acciones (Actions)
- `updateProfile(data)`: Actualiza nombre o foto.
- `updateStars(amount)`: Suma estrellas (positivas si gana estrellas, negativas si gasta o pierde)
- `updateTasks(amount)`: Suma actidades completadas (positivas si completa una actividad, negativas si la reinicia)
- `updateMoney(amount)`: Suma dinero al balance del usuario (positivo si gana, negativo si cobra en la vida real)

### Datos iniciales (Mock Data)
userLevels: [
  { id: 1, name: "Luna Nueva", minExp: 0, reward: 0 },
  { id: 2, name: "Luna Creciente", minExp: 10, reward: 50 },
  { id: 3, name: "Cuarto Creciente", minExp: 30, reward: 100 },
  { id: 4, name: "Gibosa Creciente", minExp: 60, reward: 150 },
  { id: 5, name: "Luna Llena", minExp: 100, reward: 300 },  
  { id: 6, name: "Luna Azul", minExp: 160, reward: 500 },
  { id: 7, name: "Superluna", minExp: 250, reward: 1000 }
]

---

## 🌙 2. Dashboard Slice (Rituales y Actividades)
*Gestiona el progreso diario y las tareas.*

### Estado (State)
- `moonPhase`: Object
    - `name`: String ("Luna Nueva", "Luna Creciente", "Cuarto Creciente", "Gibosa Creciente", "Luna Llena", Inicial:"Luna Nueva")
    - `progressPoints`: Number (Inicial: 0)
    - `maxPoints`: Number (Inicial: 100)
- `activities`: Array de objetos 
    - `activityID`: Number (ID único)
    - `setID`: Number (ID único correspondiente a un set de actividades al que pertenezca, ej: Detox, Rutina Matutina)
    - `title`: String (Nombre de la actividad. Ej: "Meditación guiada para manifestar")
    - `category`: String (Categoría de la actividad. Ej: "Mente")
    - `value`: Number (valor medible que equivale a completar la actividad 1 vez)
    - `valueUnit`: String (unidad a mostrar a lado del valor, ej: "vez", "mins", "vaso", "páginas")
    - `stars`: Number (Estrellas que otorga cada vez que se completa. Ej: 100)
    - `completions`: Number (Número de veces completada ahora mismo. Ej: 0, 1)
    - `maxCompletions`: Number (Máximo de veces que se puede completar en cada intervalCompletions Ej: 3)
    - `isUnlocked`: Boolean (Si es false, la actividad no aparece en el Dashboard y se muestra en la Tienda para su compra).
    - `intervalCompletions`: Number (Número de días durante los cuales se toma encuenta maxCompletions, una vez alcanzado, se reinicia.)
    - `intervalName`: String ("al día", "cada 2 días", "cada 3 días", "cada 4 días", "cada 5 días", "cada 6 días", "por semana", "por quincena", "por mes")   
    - `fullyCompleted`: Boolean (Si está completada al máximo de completions. Ej: false   )
    - `activityImage`: URL (Imagen opcional, si es que hay una imagen que describe los pasos a seguir por ejemplo en un ejercicio con poses)
    - `activityVideo`: URL (Video opcional, en caso de que la actividad requiera por ejemplo meditación guiada)
    - `activityDetails`: String (Descripción detallada de la actividad)
    - `phasePoints`: Number (puntos de progreso que incrementa a moonPhase.progressPoints, default:1)
    - `isUnlocked`: Boolean (True si el usuario ya la obtuvo en la tienda o de alguna otra forma, false si no ha sido comprada u obtenida)
    - `isActive`: Boolean (True por default, false cuando usuario la desactive desde su dashboard)
- `lastResetDate`: String (Formato: YYYY-MM-DD)

### Acciones (Actions)
- `startNewDay()`: Resetea el progreso diario (completions a 0, etc.) y actualiza la fecha del último reinicio tras confirmar en el mensaje de Spiral.
- `claimMoonReward()`: Otorga la recompensa por completar el ciclo lunar (ej. añadir una tarjeta especial) y reinicia el progreso de la luna.
- `toggleActivity(id)`: Lógica principal para completar o revertir actividades.
    - `Lógica`: Incrementa completions, primero pregunta si fullyCompleted es true, si es así entonces lo vuelve false y reinicia completions a 0. Si no era true, entonces solo incrementa completions y finalmente pregunta si completions ahora es igual a maxCompletions, si es así entonces fullyCompleted se vuelve true.
    - `Interacción`: Llama userSlice.addStars usando el valor de stars de esta actividad, si actividad se reinicia, multiplica stars * -1 * completions antes para obtener el valor a sumaer en userSlice.addStars.
    - `Interacción`: Llama a userSlice.updateTasks añadiendo +1 mientras no se esté reiniciando la actividad, si se reinicia añade completions * -1 para cancelar la actividad
- `updateActivity(id, data)`: Modifica una actividad específica.
- `resetDailyActivities()`: Limpia completions al iniciar un nuevo día y actualiza lastResetDate(date)
- `addActivity(id, data)`: Añade una nueva actividad.
- `toggleActivityVisibility(id)`: Activa o desactiva una actividad.
- `purchaseActivity(id)`: Desbloquea una actividad una vez usuaria la compra desde la store.
- `updateActivitySet(id)`: Modifica el grupo de actividades o set al que pertenece una actividad (por ejemplo si tenemos set de rutina matutina y vespertina, la puede cambiar de set)

### Datos iniciales (Mock Data)
 [
  activities  { 
    activityID: 1, 
    setID: 1,
    title:"Toma tus pastillas.",
    category:"Suplementos",
    value: 1,
    valueUnit:"pastilla",
    stars:1,
    completions:0,
    maxCompletions:10,
    intervalCompletions:1,
    intervalName:"al día",
    fullyCompleted: false,
    activityImage:"",
    activityVideo:"",
    activityDetails:"Toma tus pastillas diarias como esté indicado.",
    phasePoints:"0.1",
    isUnlocked: true,
    isActive: true,
    },
    { 
    activityID: 2, 
    setID: 1,
    title:"Lavar platos.",
    category:"Limpieza",
    value: 1,
    valueUnit:"vez",
    stars:10,
    completions:0,
    maxCompletions:1,
    intervalCompletions:1,
    intervalName:"al día",
    fullyCompleted: false,
    activityImage:"",
    activityVideo:"",
    activityDetails:"Lavar los trastes sucios del día.",
    phasePoints:"1",
    isUnlocked: true,
    isActive: true,
    },
    { 
    activityID: 3, 
    setID: 1,
    title:"Lavar la ropa.",
    category:"Limpieza",
    value: 1,
    valueUnit:"vez",
    stars:11,
    completions:0,
    maxCompletions:1,
    intervalCompletions:7,
    intervalName:"por semana",
    fullyCompleted: false,
    activityImage:"",
    activityVideo:"",
    activityDetails:"Lavar la ropa sucia.",
    phasePoints:"1.5",
    isUnlocked: true,
    isActive: true,
    },
    { 
    activityID: 4, 
    setID: 1,
    title:"Ejercicios nervio vago",
    category:"Wellness",
    value: 1,
    valueUnit:"vez",
    stars:5,
    completions:0,
    maxCompletions:4,
    intervalCompletions:1,
    intervalName:"al día",
    fullyCompleted: false,
    activityImage:"",
    activityVideo:"",
    activityDetails:"Realiza tus ejercicios para el nervio vago.",
    phasePoints:"1.5",
    isUnlocked: true,
    isActive: true,
    },
]
activitySets: [
    { 
    id: 1, 
    name: "Antes del desayuno", 
    description: "Actividades para enfocar tu mañana",
    price: 200,
    specialRewards: 50,
    isUnlocked: true,
    isActive: true
    },
    { 
    id: 2, 
    name: "Medio día", 
    description: "Actividades para después del desayuno",
    price: 200,
    specialRewards: 50,
    isUnlocked: true,
    isActive: true
    },
    {
    id: 3, 
    name: "Por la tarde", 
    description: "Actividades para hacer por la tarde y noche",
    price: 200,
    specialRewards: 50,
    isUnlocked: true,
    isActive: true
    },
]

## Reglas de lógica 
- `Chequeo del Día`: Si al iniciar la app la fecha es distinta a lastResetDate, no resetear atuomáticamente actividades, pedir confirmación vía Spiral.
- `Pluralización automática`: El sistema debe mostar valueUnit si completions es 1, de lo contrario debe aplicar el plural (regla general: añadir "s", excepción si termina en "z" cambiar por "ces")


## 🐱 3. Pet Slice (Spiral y Mensajería Global)
*Gestiona a la mascota y el sistema de voz de la app.*

### Estado (State)
- `petName`: String (Inicial: "Spiral")
- `needs`: `{ water, food, clean, play }` (Valores 0-100, incial: 100 para todos)
- `petInventory`: Array de items consumibles `{ id, name, icon, quantity, targetsNeed }`
- `spiralMessage`: `{ 
    text: string (el texto final que se muestra sacado del catálogo o fijo),
    video: URL (video que aparece como foto de spiral),
    duration: number (opcional, en ms, para mensajes que se cierran solos),
    actionConfig: [{label: string, type:string, data:string, icon:string, variant:string}] (configuración de botones),
}`

### Acciones (Actions)
- `setSpiralMessage(id, extraData)`: Recibe la clave del catálogo y datos extra (como estrellas o nombres) para realizar reemplazos de etiquetas (ej: `{{stars}}`) antes de actualizar el estado.
- `usePetItem(itemId)`: Consume un item, sube la necesidad y dispara un mensaje de agradecimiento.
    - `Lógica`: elimina item de inventario (una unidad) y aumenta la cantidad de la necesidad respectiva al item
    - `Interacción`: Llama setSpiralMessage dependiendo del item consumido (THANKS_WASH para jabón, THANKS_WATER para agua, THANKS_FOOD para commida, THANKS_PLAY para juguete)
- `addPetItem(product)`: Recibe el objeto del producto desde la tienda. Si el ítem ya existe en el inventario, aumenta su `quantity`. Si no existe, lo crea usando el nombre, ícono y los datos de su `payload`.

### Datos iniciales (Mock Data)
// Inventario inicial
inventory: [
  { id: 'agua', name: 'Agua', quantity: 3, targetsNeed: 'water', amount: 50 },
  { id: 'comida', name: 'Croquetas', quantity: 3, targetsNeed: 'food', amount: 50 },
  { id: 'jabob', name: 'Jabón', quantity: 3, targetsNeed: 'clean', amount: 50 },
  { id: 'juguete', name: 'Juguete', quantity: 3, targetsNeed: 'play', amount: 50 },
],
messageCatalog: {
  // Los datos de este objeto se encuentran definidos externamente en: spiral_messages.md
  // Consultar ese archivo para el catálogo completo de variantes por emoción y situaciones.
}

---

## 🛍️ 4. Store Slice (Catálogo)
*El motor de transacciones.*

### Estado (State)
- `catalog`: Array de productos `{ id, name, icon, price, category, description, chips, payload }`
- `categories`: `["Actividad", "Album", "Mascota"]`

### Acciones (Actions)
- `purchaseItem(productId)`: 
    1. Verifica estrellas en `userSlice`.
    2. Resta estrellas.
    3. Si es mascota → Llama a `petSlice.addPetItem`.
    4. Si es álbum → Llama a `albumSlice.addCardToInventory` o desbloquea casilla.
    5. Si es actividad → Cambia `isUnlocked: true` en el objeto correspondiente del `dashboardSlice`.
    6. Dispara mensaje de éxito en `petSlice`.

### Datos iniciales (Mock Data)
// Nota: Las actividades para la tienda se filtran directamente del DashboardSlice (isUnlocked: false)
catalog: [
  {
    id: 'agua',
    name: 'Agua',
    icon: '💧',
    price: 50,
    category: 'Mascota',
    description: 'Agua fresca para hidratar a Spiral.',
    chips: ['Estándar', '1 uso', '💧 -50 sed'],
    payload: { targetsNeed: 'water', amount: 50 }
  },
  {
    id: 'comida',
    name: 'Croquetas',
    icon: '🍖',
    price: 100,
    category: 'Mascota',
    description: 'Deliciosas croquetas de salmón.',
    chips: ['Premium', '1 uso', '🍖 -50 hambre'],
    payload: { targetsNeed: 'food', amount: 50 }
  },
  {
    id: 'jabob',
    name: 'Jabón',
    icon: '🧼',
    price: 75,
    category: 'Mascota',
    description: 'Jabón con aroma a lavanda espacial.',
    chips: ['Estándar', '1 uso', '🧼 -50 suciedad'],
    payload: { targetsNeed: 'clean', amount: 50 }
  },
  {
    id: 'juguete',
    name: 'Juguete',
    icon: '🐭',
    price: 150,
    category: 'Mascota',
    description: 'Ratón de tela con catnip lunar.',
    chips: ['Estándar', '1 uso', '🧶 -50 aburrimiento'],
    payload: { targetsNeed: 'play', amount: 50 }
  },
  {
    id: 'polvo_lunar',
    name: 'Polvo Lunar',
    icon: '✨',
    price: 500,
    category: 'Album',
    description: 'Polvo mágico para desbloquear casillas especiales o nuevas páginas.',
    chips: ['Premium', '1 uso', 'Funcional'],
    payload: { type: 'UNLOCK_TOOL' }
  },
  {
    id: 'tarjeta_eterna',
    name: 'Tarjeta Eterna',
    icon: '💎',
    price: 1000,
    category: 'Album',
    description: 'Una tarjeta legendaria que nunca se desvanece.',
    chips: ['Premium', 'Infinito', 'Coleccionable'],
    payload: { type: 'SPECIAL_CARD' }
  },
  {
    id: 'sobre_estandar',
    name: 'Sobre estándar',
    icon: '✉️',
    price: 300,
    category: 'Album',
    description: 'Contiene 3 tarjetas aleatorias para tu colección.',
    chips: ['Estándar', '1 uso', 'Aleatorio'],
    payload: { type: 'PACK', count: 3 }
  }
]

---

## 📖 5. Album Slice (Coleccionables)
*Estructura de páginas y progreso de colección.*

### Estado (State)
- `pages`: Array de `{ id, state (locked/unlocked), rewardState }`
- `slots`: Array de `{ id, pageId, state (empty/locked/filled), cardId, title }`
- `userCards`: Array de tarjetas en inventario (compradas pero no pegadas).

### Acciones (Actions)
- `placeCard(slotId, cardId)`: Pega una tarjeta en un espacio vacío.
- `unlockSlot(slotId)`: Usa un item (Polvo Lunar) para abrir el slot 6.
- `unlockPage(pageId)`: Usa un item (Llave) para abrir una página nueva.
- `fillLastSlot(pageId)`: Llena automáticamente la última carta faltante de una página pagando un coste adicional para poder canjearla por más dinero.
- `claimReward(pageId, amount)`: Procesa el canje de dinero.
- `addCardToInventory(product)`: Recibe un sobre o tarjeta desde la tienda. Si es un sobre, procesa el `payload` para generar tarjetas aleatorias. Si es una tarjeta única, la añade al inventario `userCards`.

### Datos iniciales (Mock Data)
pages: [
  { id: 1, state: 'unlocked', rewardState: 'available' },
  { id: 2, state: 'locked', rewardState: 'available' },
  { id: 3, state: 'locked', rewardState: 'available' },
  { id: 4, state: 'locked', rewardState: 'available' }
],
slots: [
  // Página 1
  { id: 1, pageId: 1, state: 'empty', cardId: null, title: 'Slot 1' },
  { id: 2, pageId: 1, state: 'empty', cardId: null, title: 'Slot 2' },
  { id: 3, pageId: 1, state: 'empty', cardId: null, title: 'Slot 3' },
  { id: 4, pageId: 1, state: 'empty', cardId: null, title: 'Slot 4' },
  { id: 5, pageId: 1, state: 'empty', cardId: null, title: 'Slot 5' },
  { id: 6, pageId: 1, state: 'locked', cardId: null, title: 'Slot Especial' },
  // Página 2
  { id: 7, pageId: 2, state: 'empty', cardId: null, title: 'Slot 1' },
  { id: 8, pageId: 2, state: 'empty', cardId: null, title: 'Slot 2' },
  { id: 9, pageId: 2, state: 'empty', cardId: null, title: 'Slot 3' },
  { id: 10, pageId: 2, state: 'empty', cardId: null, title: 'Slot 4' },
  { id: 11, pageId: 2, state: 'empty', cardId: null, title: 'Slot 5' },
  { id: 12, pageId: 2, state: 'locked', cardId: null, title: 'Slot Especial' },
  // Página 3
  { id: 13, pageId: 3, state: 'empty', cardId: null, title: 'Slot 1' },
  { id: 14, pageId: 3, state: 'empty', cardId: null, title: 'Slot 2' },
  { id: 15, pageId: 3, state: 'empty', cardId: null, title: 'Slot 3' },
  { id: 16, pageId: 3, state: 'empty', cardId: null, title: 'Slot 4' },
  { id: 17, pageId: 3, state: 'empty', cardId: null, title: 'Slot 5' },
  { id: 18, pageId: 3, state: 'locked', cardId: null, title: 'Slot Especial' },
  // Página 4
  { id: 19, pageId: 4, state: 'empty', cardId: null, title: 'Slot 1' },
  { id: 20, pageId: 4, state: 'empty', cardId: null, title: 'Slot 2' },
  { id: 21, pageId: 4, state: 'empty', cardId: null, title: 'Slot 3' },
  { id: 22, pageId: 4, state: 'empty', cardId: null, title: 'Slot 4' },
  { id: 23, pageId: 4, state: 'empty', cardId: null, title: 'Slot 5' },
  { id: 24, pageId: 4, state: 'locked', cardId: null, title: 'Slot Especial' }
],
userCards: [
  { id: 'c1', title: 'Spiral Galáctico', rarity: 'Normal', image: 'assets/cards/c1.png' },
  { id: 'c2', title: 'Luna de Queso', rarity: 'Normal', image: 'assets/cards/c2.png' },
  { id: 'c3', title: 'Amelia la Bruja', rarity: 'Premium', image: 'assets/cards/c3.png' },
  { id: 'c4', title: 'Estrella Fugaz', rarity: 'Normal', image: 'assets/cards/c4.png' },
  { id: 'c5', title: 'Gatito Astronauta', rarity: 'Premium', image: 'assets/cards/c5.png' },
  { id: 'c6', title: 'Vía Láctea de Chocolate', rarity: 'Normal', image: 'assets/cards/c6.png' },
  { id: 'c7', title: 'Nebulosa de Lavanda', rarity: 'Normal', image: 'assets/cards/c7.png' },
  { id: 'c8', title: 'Planeta de Peluche', rarity: 'Normal', image: 'assets/cards/c8.png' },
  { id: 'c9', title: 'Saturno de Caramelo', rarity: 'Normal', image: 'assets/cards/c9.png' },
  { id: 'c10', title: 'Constelación del Gato', rarity: 'Premium', image: 'assets/cards/c10.png' },
  { id: 'c11', title: 'Cometa de Azúcar', rarity: 'Normal', image: 'assets/cards/c11.png' },
  { id: 'c12', title: 'Sol con Gafas', rarity: 'Normal', image: 'assets/cards/c12.png' },
  { id: 'c13', title: 'Agujero Negro de Café', rarity: 'Normal', image: 'assets/cards/c13.png' },
  { id: 'c14', title: 'Aurora Boreal Neón', rarity: 'Premium', image: 'assets/cards/c14.png' },
  { id: 'c15', title: 'Meteorito de Menta', rarity: 'Normal', image: 'assets/cards/c15.png' },
  { id: 'c16', title: 'Supernova de Confeti', rarity: 'Normal', image: 'assets/cards/c16.png' },
  { id: 'c17', title: 'Estación de Galleta', rarity: 'Normal', image: 'assets/cards/c17.png' },
  { id: 'c18', title: 'Telescopio de Cristal', rarity: 'Normal', image: 'assets/cards/c18.png' },
  { id: 'c19', title: 'Marciano Amigable', rarity: 'Normal', image: 'assets/cards/c19.png' },
  { id: 'c20', title: 'Portal Mágico', rarity: 'Premium', image: 'assets/cards/c20.png' }
]

---

---

## ⚠️ Notas de Refactorización Crítica (Antes de Iniciar)

Para evitar errores y asegurar una transición limpia a Zustand, se deben seguir estos puntos:

1. **Limpieza de Mock Data Locales**: Al conectar cada página (`DashboardPage`, `StorePage`, etc.), se DEBEN eliminar los arrays `INITIAL_...` que existen actualmente. La única fuente de verdad será el Store de Zustand.
2. **Centralización de Timeouts**: Eliminar todos los `setTimeout` manuales en los componentes que regresan el mensaje de Spiral al estado base. El componente `SpiralMessage` debe manejar esto automáticamente leyendo la propiedad `duration` del `spiralMessage` de Zustand.
3. **Migración de Eventos Globales**: Eliminar el sistema de `window.dispatchEvent` y `window.addEventListener` usado para las estrellas en `App.jsx` y `TopBar.jsx`. Usar `updateStars` de Zustand directamente.
4. **Simplificación de Modales**: Borrar las máquinas de estado visuales manuales en las páginas (ej. `buyStep` en la tienda). Los botones y el contenido del modal deben generarse dinámicamente desde el `actionConfig` del mensaje activo.
5. **Formateo de Textos**: Implementar la lógica de pluralización (`valueUnit`) y reemplazo de variables (`{{stars}}`) durante la lectura del catálogo, no de forma hardcodeada en el componente.

---

## ☁️ Plan de Sincronización (Supabase) - *POSTERIOR*

1. **Lectura (Init)**: Al iniciar, una función `fetchInitialData` pedirá todas las tablas del `user_id` y llenará los 5 slices.
2. **Escritura (Optimistic UI)**: Cuando el usuario hace algo (ej: comprar), el store se actualiza **instantáneamente** en pantalla y enviamos el cambio a Supabase en segundo plano.
