# Filosofía Core: Arquitectura y Desarrollo

Este documento establece la visión a largo plazo y las reglas estrictas de desarrollo de la aplicación. Cualquier IA, agente o desarrollador que modifique este código debe adherirse **estrictamente** a los siguientes principios.

## 1. La Visión del "Core" (Estilo WordPress)
El objetivo final no es solo hacer que esta aplicación funcione, sino construir una **base de código estandarizada, modular y reutilizable**. 
Queremos un *Core* tan robusto y fluido que permita, en un futuro, crear nuevas páginas o aplicaciones enteras de manera rápida y sin generar "código espagueti". Todo debe sentirse como piezas de LEGO que encajan perfectamente.

## 2. Sistemas Centralizados (Zero Orphan Code)
- **Nada flota fuera del sistema:** Todos los mensajes, alertas, notificaciones y diálogos interactivos de Spiral DEBEN fluir a través del `MESSAGE_ENGINE` (`enqueueMessage`, `setScopedEphemeralMessage`) y existir en `spiralCatalog.js`.
- Se prohíbe crear modales, pop-ups o mensajes "huérfanos" que ignoren la arquitectura global. Si un componente necesita hablar con el usuario, debe usar los conductos oficiales.

## 3. Composición sobre Configuración (El patrón de UI)
- **La UI tiene el control visual:** El motor de mensajes (`MESSAGE_ENGINE`) proporciona los datos base (texto, prioridades, IDs lógicas). Pero si una página requiere una interfaz interactiva compleja (ej. tarjetas de progreso, inventarios visuales), **la propia página inyecta ese contenido** (como un "child" o "prop") en el medio del componente visual oficial (`<SpiralMessage>`).
- **Cero Sobreingeniería Global:** No modificamos componentes globales genéricos (como `<SpiralMessage>`) para que entiendan lógica específica de una sola página. La página se encarga de su propia lógica pesada y solo usa el componente visual como un lienzo.

## 4. Limpieza y Simplicidad
- **1. Prioridad al Usuario:** Si hay una solución más simple, directa y que beneficie la experiencia del usuario final, esa es la correcta.
- **2. Sin Piedad con el Código Muerto:** Si un estado, pantalla o texto (ej. candados gigantes invisibles) ya no es accesible debido a cambios en el flujo, se borra inmediatamente. No dejamos vestigios.
- **3. Textos Dinámicos:** Evitamos el código "hardcodeado" cuando depende de variables del estado de Zustand. La UI debe reaccionar automáticamente al estado (ej. leyendo `{prevPage?.title}` en vez de *"Página anterior"*).

## 5. Reglas Estrictas de Intervención (Agentes IA)
Cada vez que se aborde un cambio, se debe respetar el siguiente protocolo:
- **TRIVIAL** (Números, strings, CSS existente, borrado de código muerto evidente): Ejecuta de forma directa y limpia.
- **COMPLEJO** (Cambios en Zustand, creación de lógicas nuevas, modificaciones multi-archivo): **DETENTE**. Solicita autorización expresa del usuario antes de codificar.
- **ALCANCE**: Cero sobreingeniería. Cero alucinaciones. Se resuelve **ÚNICA Y EXCLUSIVAMENTE** lo solicitado.
- **TERMINAL**: PROHIBIDO ejecutar scripts que modifiquen el entorno o compilaciones (ej. `npm run build`) sin que se pidan. Solo se deben sugerir.
