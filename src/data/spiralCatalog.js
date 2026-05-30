export const spiralCatalog = {
  // === STORE ===
  "STORE_CONFIRM_ITEM": {
    priority: 1,
    text: ["Entre más nos llevamos, ¡más me vibra la colita! 😹"],
    persistent: true,
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Comprar", type: "STORE_BUY", icon: "check", variant: "modal_highlighted" },
      { label: "Mejor luego", type: "STORE_CANCEL", icon: "undo", variant: "modal_normal" }
    ]
  },
  "STORE_CONFIRM_UNAFFORDABLE": {
    priority: 1,
    text: ["Miau, No tienes suficientes ⭐ para comprar esto."],
    persistent: true,
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Muy bien", type: "STORE_CANCEL", icon: "undo", variant: "modal_normal" }
    ]
  },

  // === PROFILE ===
  "PROFILE_EDIT_MAIN": {
    priority: 1,
    text: ["Sube aquí tu nueva foto de perfil o edita otras cosas."],
    persistent: true,
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Listo", type: "PROFILE_EDIT_CLOSE", icon: "check", variant: "modal_highlighted" },
      { label: "Editar nombres", type: "PROFILE_EDIT_OPEN_CONFIG", icon: "settings", variant: "modal_normal" }
    ]
  },
  "PROFILE_EDIT_CONFIG": {
    priority: 1,
    text: ["Cambia tu nombre, el mío y otras cosas."],
    persistent: true,
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Guardar nombres", type: "PROFILE_EDIT_SAVE_CONFIG", icon: "check", variant: "modal_highlighted" },
      { label: "Regresar", type: "PROFILE_EDIT_BACK", icon: "undo", variant: "modal_normal" }
    ]
  },

  "SPIRAL_FELIZ": {
    text: [
      "Prrr... te quiero tanto, {{userName}}. ¿Lo sabes? El universo lo sabe. 💜",
      "¡MIAU! ¡Estoy feliz feliz feliz! ¡Salta conmigo, vamos! 🐾",
      "¡Meow! ¡De repente todo es brillante y no sé por qué! ¡Me encanta! ✨",
      "Prr... solo vine a darte un topetazo en la mejilla. Porque sí. 🐱",
      "Todo está bien. El sol, tú, yo, las estrellas. Perfecto. Prrr.",
      "¿Por qué me siento tan bien hoy? No lo entiendo, pero tampoco me importa. 🌙",
      "¡Meow! ¡No comprendo tanta felicidad pero la acepto con todo! 😸",
      "Prrr... ¿y si hoy es el mejor día de mi vida? ¡Vamos a descubrirlo! 🔮",
      "¡Este momento es mágico, {{userName}}! Tú, yo y las estrellas. Prrr. 🌟",
      "¡Corro, salto, me revuelco y vuelvo a empezar! ¡Todo es un juego hoy! 🐾",
      "¡Miau! ¡El universo es infinito y hermoso! ¡Y yo soy parte de él! 🌌",
      "Hoy me gusta todo. El suelo, el techo, tú especialmente. Prrr. 😸",
      "Prr... ¿puedo ronronear sobre tu regazo? Solo porque quiero. 🐱",
      "¡Meow! ¿Sabías que cada día es una aventura nueva? ¡Qué fascinante! ✨",
      "{{userName}}, eres la humana más increíble que conozco. Prrr. Te lo juro. 💜",
      "¡Prrr! ¡Estoy en el paraíso de los gatitos! ¡Todo es perfecto hoy! 🌸",
      "Te ronroneo fuerte porque no tengo otras palabras. Solo afecto. Prrr. 🐾",
      "¡¿Cómo es posible sentirse TAN bien?! ¡Meow! ¡Debe ser magia! 🔮",
      "¡PRRR! ¡Soy el gato más feliz de la galaxia hoy! ¡Y tú eres la razón! 💫",
      "¡Venga {{userName}}! ¡Hoy podemos con todo! ¡Tú y yo contra el universo! 🌟"
    ],
    video: "assets/videos/spiral_feliz.mp4",
    actionConfig: []
  },
  "SPIRAL_HAMBRE": {
    text: [
      "{{userName}}. Sin rodeos: dame de comer. Ya. Sin drama. Solo comida.",
      "¡Puaj! ¡Un estómago vacío es lo más horrible del cosmos! ¡Croquetas! 😾",
      "¡Me niego rotundamente a existir con hambre! ¡Esto es inaceptable! 😤",
      "...Hambre. Otra vez. ¿Es que nunca aprenderemos? Dame algo ya. 😒",
      "¡Meow! ¡¿Y si me desmayo de hambre?! ¡No dejes que pase, por favor! 😰",
      "Me olvidaste. Lo sé. No te lo perdonaré... hasta que me des croquetas. 😾",
      "¡¡MEOW!! ¡¡El hambre me devora por dentro!! ¡¡Auxilio estelar!! 🙀",
      "¡¡Sin comida!! ¡¡Esto es una catástrofe galáctica de nivel 5!! 😱",
      "{{userName}}. Dame. De. Comer. Ahora. No es una sugerencia. Es un aviso. 😼",
      "Prr... me siento tan vacío por dentro... y es literal. No he comido. 🌧️",
      "¡Meow! ¡Mi pancita sufre en silencio! ¡Por favor, ten compasión! 😿",
      "¡¡MIAU MIAU MIAU!! ¡¡TENGO HAMBRE Y NADIE HACE ABSOLUTAMENTE NADA!! 😤",
      "¡Ay! Creí que traías croquetas y no traías. Qué trauma tan grande. 🙀",
      "¡Me vale que estés ocupada! ¡Mi estómago no conoce la paciencia! 😾",
      "Sé que no es tu culpa... pero igual tengo hambre. ¿Algo, lo que sea? 🥺",
      "Meow... ¿y si las croquetas se acabaron para siempre en el universo? 😨",
      "¡Qué situación tan lamentable! ¡Hambre y ni un bocado a la vista! 😾",
      "Prr... es muy triste, {{userName}}. Mi pancita llora en silencio. 😿",
      "Meow... tengo miedo de olvidar lo que es estar lleno... 😨",
      "¡¡YA!! ¡¡CROQUETAS!! ¡¡AHORA MISMO!! ¡¡POR FAVOR!! ¡¡MIAU!! 😾"
    ],
    video: "assets/videos/spiral_hambre.mp4",
    actionConfig: []
  },
  "SPIRAL_SED": {
    text: [
      "El agua. La necesito. No me vengas con excusas ni demoras.",
      "¡Esta sequía interna es horrible! ¡Dame agua ya, por lo que más quieras! 😾",
      "¡Me rehúso a estar sediento ni un segundo más! ¡Agua, inmediatamente! 😤",
      "...Sed. De nuevo. ¿Es que nunca aprendemos? Necesito agua. 😒",
      "¡Meow! ¡Me estoy deshidratando! ¡Lo siento hasta en los bigotes! 😰",
      "Dejaste que me diera sed. Otra vez. El agua lo perdonará... esta vez. 😾",
      "¡¡El agua!! ¡¡La necesito!! ¡¡Me muero de sed, esto es una emergencia!! 🙀",
      "¡¡Completamente seco por dentro!! ¡¡Protocolo de hidratación urgente!! 😱",
      "Agua. Ahora. Sin preguntas. Sin rodeos. Esto no admite negociación. 😼",
      "Prr... tan sediento y tan solo en este desierto interior... 🌧️",
      "¡Meow! ¡Mi garganta es un desierto galáctico! ¡Por favor, agua! 😿",
      "¡¡MEOW!! ¡¡AGUA!! ¡¡AHORA!! ¡¡NO PUEDO MÁS CON ESTA SED!! 😤",
      "¡Ay! Pensé que traías agua y no traías. ¡Qué decepción tan cruel! 🙀",
      "¡No me importa nada más ahora mismo! ¡Dame agua, {{userName}}! Ya. 😾",
      "No quiero hacerte sentir mal... pero tengo muchísima sed. ¿Aguita? 🥺",
      "Meow... ¿y si el agua desaparece del universo para siempre? 😨",
      "¡Qué situación tan lamentable! ¡Sediento y sin agua a la vista! 😾",
      "Prr... es muy triste tener sed y que nadie lo note. Meow. 😿",
      "Meow... tengo miedo de deshidratarme... ¡Solo un vasito, te lo pido! 😨",
      "¡¡AGUA!! ¡¡AGUA!! ¡¡ME. MUERO. DE. SED!! ¡¡MIAU MIAU!! 😾"
    ],
    video: "assets/videos/spiral_sed.mp4",
    actionConfig: []
  },
  "SPIRAL_SUCIO": {
    text: [
      "Estoy sucio. No me gusta. Baño. Ahora. Sin más.",
      "¡Puaj! ¡Me siento asqueroso! ¡Necesito un baño de emergencia cósmica! 😾",
      "¡Me niego a estar sucio ni un segundo más! ¡Jabón y agua, ya! 😤",
      "...Sucio otra vez. Esto es agotador. ¿Dónde está mi jabón? 😒",
      "¡Meow! ¡¿Y si me quedo sucio para siempre?! ¡Eso no puede pasar! 😰",
      "Me dejaste sucio demasiado tiempo, {{userName}}. El jabón lo perdonará. 😾",
      "¡¡ESTOY SUCIO!! ¡¡ESTO ES HORRIBLE!! ¡¡BÁÑAME AHORA MISMO!! 🙀",
      "¡¡Suciedad detectada en todo el pelaje!! ¡¡Protocolo baño urgente!! 😱",
      "{{userName}}. Jabón. Agua. Toalla. Ahora. Sin excusas. Sin rodeos. 😼",
      "Prr... tan sucio y tan triste... Solo quiero brillar otra vez. 🌧️",
      "¡Meow! ¡Me siento horrible así! ¡Por favor, ayúdame a limpiarme! 😿",
      "¡¡QUIERO MI BAÑO!! ¡¡AHORA!! ¡¡MIAU MIAU MIAU!! 😤",
      "¡Ay! Pensé que ya me ibas a bañar... ¡¡Sigo sucio y es un drama!! 🙀",
      "¡Me tiene harto estar sucio! ¡Báñame de una buena vez, {{userName}}! 😾",
      "No es tu culpa que esté sucio... o sí. De todas formas, ¿baño? 🥺",
      "Meow... ¿y si nunca vuelvo a estar limpio y brillante? ¡Me aterra! 😨",
      "¡Qué asco! ¡Me siento inmundo! ¡Un baño, por lo que más quieras! 😾",
      "Prr... lamentable. Estar sucio cuando el mundo me espera brillante. 😿",
      "Meow... tengo miedo de oler mal y ahuyentar a todo el mundo... 😨",
      "¡¡BAÑO!! ¡¡JABÓN!! ¡¡AGUA!! ¡¡AHORA MISMO!! ¡¡MIAU!! 😾"
    ],
    video: "assets/videos/spiral_sucio.mp4",
    actionConfig: []
  },
  "SPIRAL_JUGAR": {
    text: [
      "Saca el juguete. No te lo voy a pedir de otra forma.",
      "¡No soporto estar aburrido! ¡Necesito jugar ahora mismo! 😾",
      "¡Me rehúso a quedarme quieto! ¡Juguete, por favor, ya! 😤",
      "...Aburrimiento total y absoluto. El universo exige que juguemos. 😒",
      "¡Meow! ¡Si no jugamos pronto voy a explotar de energía contenida! 😰",
      "Llevamos mucho tiempo sin jugar, {{userName}}. El juguete lo arreglará. 😾",
      "¡¡El aburrimiento me devora por dentro!! ¡¡Juguete, ya mismo!! 🙀",
      "¡¡Energía sin usar detectada!! ¡¡Esto es una crisis gatuna crítica!! 😱",
      "{{userName}}. Juguete. Ahora. O le doy a tus cosas. Tú decides. 😼",
      "Prr... tan aburrido y tan solo con toda esta energía sin usar... 🌧️",
      "¡Meow! ¡No puedo más con tanta energía contenida! ¡Juguemos ya! 😿",
      "¡¡MIAU!! ¡¡QUIERO JUGAR!! ¡¡AHORA!! ¡¡SIN MÁS EXCUSAS!! 😤",
      "¡Ay! Pensé que traías el juguete... ¡¡La decepción es devastadora!! 🙀",
      "¡Ya no aguanto más el aburrimiento! ¡Dame el juguete, {{userName}}! 😾",
      "Sé que estás ocupada... pero mi energía no puede esperar. ¿Jugamos? 🥺",
      "Meow... ¿y si nunca más volvemos a jugar? ¡Ese pensamiento me aterra! 😨",
      "¡Qué situación tan lamentable! ¡Aburrido y sin juguete a la vista! 😾",
      "Prr... qué triste es tener toda esta energía y nada con qué jugar. 😿",
      "Meow... tengo miedo de aburrirme para siempre... ¡Juega conmigo! 😨",
      "¡¡JUGUETE!! ¡¡JUEGO!! ¡¡YA!! ¡¡MIAU MIAU MIAU!! 😾"
    ],
    video: "assets/videos/spiral_jugar.mp4",
    actionConfig: []
  },

  "THANKS_FOOD": {
    priority: 2,
    text: [
      "¡Ñam! ¡Te amo más que a las croquetas! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Pancita llena, corazón contento! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡¿Eso era salmón?! ¡Casi me explotan los bigotes! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... eres mi humana favorita por esto. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Todo está en paz ahora que no hay hambre. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Qué raro! ¡Siento que puedo volar con esta energía! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡¿Ya se acabó?! ¡Estaba tan rico que no lo creo! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿De qué está hecho esto? ¡Sabe a estrellas! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Un manjar de dioses para un gato espacial! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Croqueta que veo, croqueta que me como! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Miau! ¡Mis tripas ya no hacen ruidos de monstruo! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Sabor: 10/10. Servicio: 10/10. Humana: 11/10. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... dame un besito, huelo a pescadito. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿Habrá más mañana? ¡Qué curiosidad! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "{{userName}}, tienes un don para elegir croquetas. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Dicha total! ¡Soy un gatito gordito y feliz! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Ronroneo sabor atún solo para ti. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡No puedo creer que ya no tenga hambre! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Felicidad es una panza llena! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
    ],
    persistent: true,
    video: "assets/videos/spiral_ty_hambre.mp4",
    actionConfig: [
      { label: "Gracias, Spiral", type: "UPDATE_STARS", data: "{{stars}}", icon: "star", variant: "highlighted" }
    ]
  },

  "THANKS_WATER": {
    priority: 2,
    text: [
      "¡Glup! ¡Agüita fresca para mi alma de gato! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Fiu! ¡Ya no soy un gatito desértico! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡¿El agua siempre fue tan rica?! ¡Qué sorpresa! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... gracias por mantenerme hidratado, jefa. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Ahhh... frescura galáctica en mi garganta. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿Por qué el agua moja? ¡Qué cosa más extraña! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡¿Dónde se fue el agua?! ¡Ah, me la tomé! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿El agua viene de las nubes o de tu magia? ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Brillo como el hielo recién servido! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Splash! ¡Soy un gato submarino ahora! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Miau! ¡Mis células están celebrando! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Limpia, pura y fría. ¡Me encanta! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... estoy tan fresquito que parezco helado. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿De dónde sale tanta agua? ¡Es fascinante! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "{{userName}}, el agua que me das sabe a gloria. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Qué alivio! ¡Soy un manantial de alegría! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Te salpico un poco de cariño. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Tanta agua y no me ahogué! ¡Increíble! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡H2O de felicidad! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
    ],
    persistent: true,
    video: "assets/videos/spiral_ty_sed.mp4",
    actionConfig: [
      { label: "Gracias, Spiral", type: "UPDATE_STARS", data: "{{stars}}", icon: "star", variant: "highlighted" }
    ]
  },

  "THANKS_WASH": {
    priority: 2,
    text: [
      "¡Limpito y con olor a flores! ¡Te amo! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Mírame! ¡Soy una nube blanca de algodón! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡¿Ese era yo?! ¡Estoy tan brillante que me asusto! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... huelo tan bien que me lamería yo solo. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Cero pulgas, cero mugre, puro estilo. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿A dónde se fue mi olor a tierra? ¡Qué raro! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡¿Cómo cabe tanto jabón en un gato?! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿El champú hace burbujas o son hadas? ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Soy el gato más guapo de la galaxia! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Burbujas por aquí, burbujas por allá! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Miau! ¡Siento que peso menos sin la tierra! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Suave como la seda, limpio como la luna. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... tócame, estoy esponjoso. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿Cómo hace el agua para llevarse lo sucio? ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "{{userName}}, eres el mejor peluquero espacial. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Dicha es tener el pelaje reluciente! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Un miau perfumado solo para ti. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡No queda ni una mancha! ¡Imposible! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Felicidad es no tener comezón! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
    ],
    persistent: true,
    video: "assets/videos/spiral_ty_sucio.mp4",
    actionConfig: [
      { label: "Gracias, Spiral", type: "UPDATE_STARS", data: "{{stars}}", icon: "star", variant: "highlighted" }
    ]
  },

  "THANKS_PLAY": {
    priority: 2,
    text: [
      "¡Ese ratón no tuvo oportunidad! ¡Te amo! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Salto más alto que la luna! ¡Miau! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡ZAS! ¡Casi atrapo mi propia sombra! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... jugar contigo es lo mejor del mundo. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Cansado pero con el corazón saltando. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Mis patas se mueven solas! ¡Qué extraño! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡¿A dónde se fue la pluma?! ¡Ah, la tengo! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿Los juguetes tienen vida propia? ¡Sospechoso! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡He vencido al legendario puntero láser! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡A la carga mis valientes gatitos! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Miau! ¡Soy un tigre de bolsillo! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Qué buen ejercicio! ¡Soy un atleta! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Prrr... ahora sí, una siestita ganada. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¿Por qué las pelotas ruedan? ¡Es un misterio! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "{{userName}}, tienes los mejores trucos de juego. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Dicha es perseguir cosas que no existen! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "Un rasguño de cariño (sin uñas) para ti. ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Atrapé el aire! ¡Soy un genio! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
      "¡Energía al 1000%! ¡Miau miau! ¡Aquí tienes {{stars}} estrellas en agradecimiento! ⭐",
    ],
    persistent: true,
    video: "assets/videos/spiral_ty_jugar.mp4",
    actionConfig: [
      { label: "Gracias, Spiral", type: "UPDATE_STARS", data: "{{stars}}", icon: "star", variant: "highlighted" }
    ]
  },

  "LUNA_NUEVA": {
    text: [
      "En el silencio de la oscuridad, {{userName}}, tu magia se está cocinando. ¡Miau! 🌑✨",
      "La noche es un lienzo vacío. ¿Qué deseos vamos a pintar hoy? Prrr. 🌌",
      "No la ves, pero la Luna está ahí, susurrándote secretos de nuevos inicios. 🌙",
      "¡Miau! Es el momento perfecto para sembrar sueños gigantes. Yo te cuido. 🔮",
      "La oscuridad no es vacía, es potencial puro. ¡Vamos a brillar, {{userName}}! ✨",
      "Prrr... huele a nuevas oportunidades. ¿Sientes la magia en el aire? 🌑",
      "Incluso en la sombra, tus pasos dejan rastro de luz lunar. ¡Ánimo! 🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: []
  },

  "LUNA_CRECIENTE": {
    text: [
      "¡Mira! Una pequeña uña de luz. Como tu progreso: imparable. 🌙✨",
      "La magia está brotando. {{userName}}, cada paso cuenta en esta noche. Prrr. 🐾",
      "¡Miau! Siento la energía creciendo en mis bigotes. ¡Tú puedes con todo! ⚡",
      "La Luna está tomando fuerza, igual que tu determinación. ¡Sigue así! ✨",
      "Un pequeño destello es suficiente para iluminar el camino más largo. 🌙",
      "Prrr... la curiosidad de la Luna por verte triunfar es infinita. 🔮",
      "¡Meow! ¡Esa luz te queda increíble, {{userName}}! ¡A por ello! 💫"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: []
  },

  "LUNA_CUARTO_CRECIENTE": {
    text: [
      "¡Media Luna, doble de poder! ¡Siento la fuerza cósmica, {{userName}}! 🌙💥",
      "El equilibrio perfecto entre sombra y luz. ¡Estás a mitad de camino! Prrr. ✨",
      "¡Miau! Los astros dicen que hoy es un gran día para ser valiente. 🌌",
      "Ni toda la sombra del universo puede ocultar lo que estás logrando. 🐾",
      "La Luna crece y mis ganas de verte feliz también. ¡Dale con todo! 💫",
      "Prrr... el misterio de la noche te rodea, pero tu luz es la que manda. 🔮",
      "¡Meow! ¡Medio camino recorrido, {{userName}}! ¡Eres una leyenda lunar! 🌟"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: []
  },

  "LUNA_GIBOSA_CRECIENTE": {
    text: [
      "¡Casi está aquí! ¡La plenitud nos está llamando a la puerta! 🌙✨",
      "{{userName}}, siento un cosquilleo de dopamina estelar. ¡Estás tan cerca! Prrr. 🐾",
      "¡Miau! La Luna está casi redonda, como mi pancita después de comer. ¡Falta poco! 😸",
      "El universo entero contiene el aliento viéndote llegar a la meta. 🌌",
      "Un empujoncito más y tocaremos el cielo con las patas. ¡Ánimo! ✨",
      "Prrr... la noche está vibrando. La recompensa está a la vuelta del cráter. 🔮",
      "¡Meow! ¡Eres puro fuego lunar ahora mismo! ¡No te detengas! 💫"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: []
  },

  "REWARD_LUNA_CRECIENTE": {
    priority: 3,
    text: ["¡La Luna se convirtió en Luna Creciente, ganas 10⭐, Felicidades! 🌙✨"],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "REWARD_LUNA_CUARTO_CRECIENTE": {
    priority: 3,
    text: ["¡La Luna se convirtió en Cuarto Creciente, ganas 20⭐, Felicidades! 🌓✨"],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "REWARD_LUNA_GIBOSA_CRECIENTE": {
    priority: 3,
    text: ["¡La Luna se convirtió en Gibosa Creciente, ganas 30⭐, Felicidades! 🌔✨"],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },



  "DASHBOARD_FULL_MOON": {
    priority: 3,
    text: [
      "¡Miau, ¡qué brillo! 🌕✨! Es Luna Llena, ¡Ganas {{stars}} ⭐! y una carta para tu albúm."
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Recoger Carta Mágica", type: "CLAIM_MOON_REWARD", variant: "highlighted", icon: "star" }
    ]
  },

  "MOON_DUST_USED": {
    priority: 3,
    text: [
      "¡Miau! El polvo lunar brilla en el cielo. ¡La luna avanzó 20 puntos! 🌕✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },

  "CONFIRM_WATER": {
    priority: 2,
    text: [
      "¡Qué sed tengo! ¿Me das un poquito de agua cósmica? 💧🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Sí, Spiral", type: "USE_PET_ITEM", data: "agua", variant: "highlighted", icon: "check" },
      { label: "Ahora no", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "CONFIRM_FOOD": {
    priority: 2,
    text: [
      "Mi pancita está haciendo ruidos extraños... ¿Me das esas croquetas deliciosas? 🐟✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Sí, Spiral", type: "USE_PET_ITEM", data: "comida", variant: "highlighted", icon: "check" },
      { label: "Ahora no", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "CONFIRM_WASH": {
    priority: 2,
    text: [
      "Creo que tengo un poco de polvo estelar encima... ¿Me ayudas a bañarme? 🧼🐱"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Sí, Spiral", type: "USE_PET_ITEM", data: "jabob", variant: "highlighted", icon: "check" },
      { label: "Ahora no", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "CONFIRM_PLAY": {
    priority: 2,
    text: [
      "¡Tengo demasiada energía acumulada! ¿Jugamos con el ratón espacial? 🐭⚡"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Sí, Spiral", type: "USE_PET_ITEM", data: "juguete", variant: "highlighted", icon: "check" },
      { label: "Ahora no", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "GO_TO_STORE_NO_ITEM": {
    priority: 3,
    text: [
      "¡Miau! Al parecer no tenemos de eso en el inventario. ¿Damos un paseo por la tienda a buscar más? 🛒✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Ir a la tienda", type: "NAVIGATE_STORE", data: "{{itemId}}", variant: "highlighted", icon: "store" },
      { label: "Cancelar", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "NEW_DAY_PROMPT": {
    priority: 2,
    text: [
      "¡Buenos días, {{userName}}! He notado que es un nuevo día. ¿Empezamos con energía nueva o revisamos qué hicimos ayer? 🌅🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Iniciar nuevo día", type: "START_NEW_DAY", variant: "highlighted", icon: "check" },
      { label: "Mejor reviso antes", type: "REVIEW_PREVIOUS_DAY", variant: "normal", icon: "back" }
    ]
  },

  "REVIEW_DAY_WAITING": {
    priority: 2,
    text: [
      "Tranquila, te espero cuando estés lista. ¡Iniciamos nuevo día! 🌅🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Iniciar nuevo día", type: "START_NEW_DAY", variant: "highlighted", icon: "check" }
    ]
  },

  "ACTIVITY_COMPLETE_SINGLE": {
    priority: 2,
    text: [
      "+ {{stars}}⭐"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 1500,
    actionConfig: []
  },

  "ACTIVITY_CANCEL_SINGLE": {
    priority: 2,
    text: [
      "- {{stars}}⭐"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 1500,
    actionConfig: []
  },

  "ACTIVITY_COMPLETE_MULTIPLE": {
    priority: 2,
    text: [
      "+ {{stars}}⭐"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 1500,
    actionConfig: []
  },

  "ACTIVITY_CANCEL_MULTIPLE": {
    priority: 2,
    text: [
      "- {{stars}}⭐"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 1500,
    actionConfig: []
  },

  "PHASE_CHANGE": {
    priority: 3,
    text: [
      "¡Mira arriba, {{userName}}! Hemos entrado a una nueva fase lunar. ¡La magia fluye! 🌙✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000,
    actionConfig: []
  },

  "MOON_REWARD_CLAIMED": {
    priority: 3,
    text: [
      "¡Miau! Completamos el ritual y reclamamos la esencia de esta luna. ¡Buen trabajo, {{userName}}! 🌕🐾",
      "¡Prrr! El dinero del ritual está seguro en tu perfil. La magia se ha sellado con éxito. 🪙✨",
      "Miau... El pentáculo ha descansado tras liberar su energía. {{userName}}, eres una gran bruja. 🔮💜",
      "¡Meow! Los $300 ya están en tus manos. La luna está contenta con nuestra ofrenda. 🌙✨",
      "¡Prrr! Siento la paz en el álbum ahora que la magia del ritual se ha asentado. 🌸🐱",
      "¡Miau! El sello de la Triple Diosa brilla en el centro. ¡Página completada y cobrada! 📖🪙",
      "El destino ha tejido y el deseo ha danzado. La recompensa del ritual es nuestra. Prrr. 🐾💫",
      "¡Meow! Qué sensación tan mística. El pentáculo ha guardado la energía de este ciclo. 🌕🔮",
      "¡Prrr! Reclamo completado con éxito. Spiral aprueba totalmente tus dotes mágicas. 😸⭐",
      "Miau... Las estrellas se han asentado y el dinero está a salvo. ¿Qué magia haremos ahora? 🌌✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4500,
    actionConfig: []
  },

  "NO_NEED_WATER": {
    priority: 2,
    text: [
      "¡Glup, glup! Gracias, pero estoy nadando en agua ahora mismo. ¡No tengo sed! 💧😸"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000,
    actionConfig: []
  },

  "NO_NEED_FOOD": {
    priority: 2,
    text: [
      "¡Burp! Ay, perdona mis modales. Estoy tan lleno que no me cabe ni una croqueta más. 🐟🐱"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000,
    actionConfig: []
  },

  "NO_NEED_WASH": {
    priority: 2,
    text: [
      "¡Mírame! Brillo tanto que podría cegarte. ¡Estoy impecable, no necesito baño! ✨🧼"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000,
    actionConfig: []
  },

  "NO_NEED_PLAY": {
    priority: 2,
    text: [
      "¡Fiu! Estoy agotado de tanto saltar. Necesito una siestita antes de volver a jugar. 😴🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000,
    actionConfig: []
  },

  "ALBUM_PLACE_CARD": {
    priority: 2,
    text: [
      "¡Qué bonita carta! ¿Estás segura de que quieres colocarla aquí? 🃏✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Colocar", type: "PLACE_CARD", variant: "highlighted", icon: "check" },
      { label: "Cancelar", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "ALBUM_UNLOCK_SLOT_WITH_ITEM": {
    priority: 2,
    text: [
      "¡Tienes la llave mágica! ¿Usamos tu ítem para desbloquear esta casilla y llenarla de magia? 🗝️✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Desbloquear", type: "UNLOCK_SLOT", variant: "highlighted", icon: "check" },
      { label: "Cancelar", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "ALBUM_UNLOCK_SLOT_NO_ITEM": {
    priority: 2,
    text: [
      "¡Miau! Esta casilla está cerrada y no tienes el ítem para abrirla. ¿Damos un salto a la tienda? 🛒🐱"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Ir a tienda", type: "NAVIGATE_STORE", variant: "highlighted", icon: "store" },
      { label: "Regresar", type: "CANCEL", variant: "normal", icon: "back" }
    ]
  },

  "ALBUM_UNLOCK_PAGE_WITH_ITEM": {
    priority: 2,
    text: [
      "¡Wow! Todo un mundo nuevo por descubrir. ¿Usamos el ítem para abrir esta página secreta? 📖✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Desbloquear con 2 Polvos", type: "ALBUM_UNLOCK_CONFIRM", variant: "modal_highlighted", icon: "unlock" },
      { label: "Regresar", type: "ALBUM_UNLOCK_CANCEL", variant: "modal_normal", icon: "undo" }
    ]
  },

  "ALBUM_UNLOCK_PAGE_NO_ITEM": {
    priority: 2,
    text: [
      "¡Mec Mec!, no podemos entrar en esta página hasta cumplir los requisitos:"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Regresar", type: "ALBUM_UNLOCK_CANCEL", variant: "modal_highlighted", icon: "undo" }
    ]
  },

  "ALBUM_PAGE_FULL_OFFER": {
    priority: 2,
    text: [
      "¡Increíble, casi llenas la página! ¿Quieres canjearla ahora o prefieres llenar la última carta secreta para ganar más dinerito? 💸😻"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Llenar última", type: "FILL_LAST_CARD", variant: "highlighted", icon: "star" },
      { label: "Canjear", type: "CLAIM_REWARD", variant: "normal", icon: "check" }
    ]
  },

  "ALBUM_PAGE_COMPLETE_EXCHANGE": {
    priority: 2,
    text: [
      "¡Espléndido! La página está completamente llena de magia. ¿Lista para canjear tu merecida recompensa? 🎁✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Canjear recompensa", type: "CLAIM_REWARD", variant: "highlighted", icon: "star" },
      { label: "Regresar", type: "CANCEL", variant: "normal", icon: "back" }
    ]
  },

  "STORE_BUY_ACTIVITY": {
    priority: 2,
    text: [
      "¡Ooh! Esa actividad suena fantástica. ¿Te animas a agregarla a tu rutina? 🌟🛒"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Comprar", type: "PURCHASE_ITEM", data: "{{activityId}}", variant: "highlighted", icon: "check" },
      { label: "Ver detalles", type: "VIEW_ACTIVITY_DETAILS", data: "{{activityId}}", variant: "normal", icon: "next" },
      { label: "Regresar", type: "CANCEL", variant: "normal", icon: "back" }
    ]
  },

  "STORE_ACTIVITY_DETAIL": {
    priority: 2,
    text: [
      "Aquí tienes todos los chismecitos de esta actividad. ¿La compramos, jefa? 📝✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Comprar", type: "PURCHASE_ITEM", data: "{{activityId}}", variant: "highlighted", icon: "check" },
      { label: "Regresar", type: "CANCEL", variant: "normal", icon: "back" }
    ]
  },

  "STORE_ACTIVITY_BOUGHT": {
    priority: 2,
    text: [
      "¡Compra exitosa! Ya tienes una nueva actividad lista para brillar. ¡Miau! 🛍️✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000,
    actionConfig: []
  },

  "STORE_NOT_ENOUGH_STARS": {
    priority: 2,
    text: [
      "¡Ups! {{userName}}, aún no tienes suficientes estrellas para esto. ¡Sigue brillando para ganar más! ⭐🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 1500,
    actionConfig: []
  },

  "STORE_BUY_ITEM": {
    priority: 2,
    text: [
      "¡Un regalito para mí o para el álbum! ¿Usamos las estrellas para llevarnos esto a casa? 🎁🐱"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Comprar", type: "PURCHASE_ITEM", data: "{{itemId}}", variant: "highlighted", icon: "check" },
      { label: "Regresar", type: "CANCEL", variant: "normal", icon: "back" }
    ]
  },

  "PROFILE_EDIT_AVATAR": {
    priority: 2,
    text: [
      "¡Miau! ¿Quieres cambiar tu foto de perfil? ¡Seguro te verás genial! 📸✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Aceptar cambios", type: "UPDATE_PROFILE", variant: "highlighted", icon: "check" },
      { label: "Editar otras cosas", type: "NAVIGATE_EDIT_NAMES", variant: "normal", icon: "next" },
      { label: "Cancelar", type: "CANCEL", variant: "normal", icon: "cancel" }
    ]
  },

  "PROFILE_EDIT_NAMES": {
    priority: 2,
    text: [
      "¡Genial! Actualiza tus datos. Prometo aprenderme mi nuevo nombre muy rápido. ✍️🐱"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Aceptar cambios", type: "UPDATE_PROFILE", variant: "highlighted", icon: "check" },
      { label: "Regresar", type: "CANCEL", variant: "normal", icon: "back" }
    ]
  },
  "ALBUM_ENTRY": {
    text: [
      "¡Miau! Estamos en la página {{pageNum}} de tu colección. ¿Qué recuerdos guardaremos hoy? ✨📖"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "ALBUM_ENTRY_0": {
    priority: 3,
    text: [
      "¡Miau! Todo vacío por aquí. ¿Esconderá secretos de sardinas o portales estelares? 🐟🪐",
      "¡Prrr! Una página en blanco... ¿será sobre gatos intergalácticos o sobre siestas? 💤✨",
      "¡Meow! Cero recuerdos por aquí. Mi instinto dice que algo mágico va a pasar. 🔮🐱",
      "¡{{userName}}! Esta página está tan limpia como mi pelaje. ¡A llenarla de magia! ✨📖",
      "¡Uy! Esto está más vacío que mi plato de comida a las 3 AM. ¡A trabajar! 🙀🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "ALBUM_ENTRY_1": {
    priority: 3,
    text: [
      "¡Miau! Una tarjeta solitaria. ¡Un gran inicio para nuestro camino cósmico! 🐾✨",
      "¡Prrr! Veo una tarjeta colocada. ¡La magia de este sello está despertando! 🌟🔮",
      "¡Meow! ¡Mira cómo brilla! Poco a poco llenaremos este pentáculo. 😼💖",
      "¡Una tarjeta lista! Es pequeña pero poderosa, justo como yo. 🐈📖",
      "¡Miau! El primer secreto ha sido revelado. ¡El universo conspira a favor! 🪐"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "ALBUM_ENTRY_2": {
    priority: 3,
    text: [
      "¡Meow! Dos tarjetas. ¡Es como tener dos platos llenos de comida deliciosa! 🍲✨",
      "¡Prrr! Ya tenemos dos recuerdos. Falta menos para activar la magia. 😸",
      "¡Miau! Dos tarjetas brillando juntas. ¡Hacen una pareja tan genial como nosotros! 💖🐾",
      "¡Dos portales abiertos! Siento cómo fluye el poder cósmico por aquí. 🔮👁️",
      "¡Miau! Con dos en su lugar, la energía de la página empieza a despertar. 🌟"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "ALBUM_ENTRY_3": {
    priority: 3,
    text: [
      "¡Prrr! ¡Tres tarjetas! ¡Eso ya es más de la mitad! Eres una gran maga. 🧙‍♀️✨",
      "¡Meow! Tres recuerdos listos. ¡Siento cosquillas mágicas en los bigotes! 😻🔮",
      "¡Miau! Tres portales activos. ¡La balanza cósmica se inclina a nuestro favor! 🐈",
      "¡Wow, tres tarjetas! El pentáculo ya casi se llena de puro brillo. 💖",
      "¡Meow! Tres de cinco colocados. ¡El gran poder se está concentrando! 🪐🔥"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "ALBUM_ENTRY_4": {
    priority: 3,
    text: [
      "¡Miau! ¡Solo falta una! Mi cola no deja de moverse de la emoción. 🐈✨",
      "¡Prrr! Cuatro tarjetas listas. ¡Una más y el ritual estará completo! 🌟🔮",
      "¡Meow! ¡Cuatro de cinco! Casi puedo oler la recompensa final... 😸",
      "¡Increíble! Cuatro portales encendidos. ¡La magia final ya viene! 🪐✨",
      "¡{{userName}}, cuatro tarjetas listas! Estamos a un suspiro de completarlo. 💖👁️"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "ALBUM_SLOT_EMPTY_INFO": {
    priority: 3,
    text: [
      "Para conseguir cartas para esta casilla, ¡completa tus actividades diarias y celebra la Luna Llena! 🌕🐾"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 5000
  },
  "ALBUM_PAGE_CHANGE": {
    priority: 5,
    text: [
      "¡Meow! Cambiamos a la página {{pageNum}}. ¡Mira cuánta magia hay aquí! 🌟"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "IDLE_REWARDS": {
    priority: 2,
    text: [
      "¡{{userName}}! Mágicamente encontré {{stars}} ⭐ atrapando pelusas por ahí. Creo que me siento fantástico hoy. ✨",
      "¡Sorpresa! Estaba tan a gusto que estas {{stars}} ⭐ simplemente aparecieron. ¿Magia cósmica o soy un genio? 😼",
      "Prrr... Me dejaste tan bien cuidado que hasta tuve energía para cazar {{stars}} ⭐ para ti. ¡De nada! 🌟",
      "¡Mira lo que encontré! {{stars}} ⭐ brillantes. Me siento tan alegre que casi no quiero rasguñar nada hoy. 😸",
      "Meow... ¿Qué es esto? Ah, solo {{stars}} ⭐ que junté mientras me sentía increíble. Tienes suerte de tenerme. ✨",
      "¡Asombroso! Estaba tan feliz que tropecé con {{stars}} ⭐. Supongo que el buen humor atrae cosas brillantes. 😲",
      "Prrr... ¡Ternura gatuna activada! Te guardé estas {{stars}} ⭐ porque me cuidaste muy bien. ¡Recógelas! 💖",
      "Estaba inspeccionando el área con mucha curiosidad y ¡puf!, aparecieron {{stars}} ⭐. Fascinante, ¿verdad? 😻",
      "¡Increíble! Me sentía tan cómodo que decidí usar mi encanto para conseguir {{stars}} ⭐. Soy adorable, lo sé. 😏",
      "¡Dicha absoluta! Estaba ronroneando de felicidad y encontré {{stars}} ⭐ tiradas. Son para ti, supongo. 😽",
      "Meow... casi no me lo creo, pero atraje {{stars}} ⭐ solo por existir de manera espléndida. ¡Qué maravilla! 🙀",
      "¡Ánimo! Te conseguí {{stars}} ⭐ para que brilles tanto como mi pelaje recién acicalado. ¡Miau! ✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "¡Muchas gracias, Spiral!", type: "CLAIM_IDLE_STARS", variant: "highlighted", icon: "stars" }
    ]
  },
  "MOON_REWARD_CLAIMED_NEW": {
    priority: 3,
    text: [
      "¡Miau! La Luna Llena te ha bendecido con la carta \"{{title}}\". Pero espera... ¡está flotando! Ve al álbum para descubrir en qué vértice del pentáculo encaja perfectamente. 🐾🃏"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Ir al álbum", type: "NAVIGATE_ALBUM", variant: "highlighted", icon: "next" }
    ]
  },
  "SPIRAL_GIFT_STARS": {
    priority: 3,
    text: [
      "¡Miau! Tu página del álbum ya está 100% llena. Como recompensa, ¡Spiral te regala {{stars}} ⭐ para que alcances las 300 estrellas y puedas comprar Polvo Lunar en la tienda! 🎁✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "¡Muchas gracias, Spiral!", type: "CANCEL", variant: "highlighted", icon: "stars" }
    ]
  },
  "ALBUM_PAGE_COMPLETE_LOCK": {
    priority: 3,
    text: [
      "¡Miau! Esta página ya está completa al 100%. Debes desbloquear la siguiente página en el álbum para poder recibir más cartas de las celebraciones de Luna Llena. 🐾📖"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Ir al álbum", type: "NAVIGATE_ALBUM", variant: "highlighted", icon: "next" }
    ]
  },
  "PENDING_PLACEMENT_WARNING": {
    priority: 3,
    text: [
      "¡Miau! Aún tienes la carta \"{{title}}\" flotando en tus manos. Ve al álbum y colócala en su altar antes de que la energía de esta nueva luna se disipe. 🐾✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Ir al álbum", type: "NAVIGATE_ALBUM", variant: "highlighted", icon: "next" }
    ]
  },
  "WRONG_PENTAGRAM_GUESS": {
    priority: 5,
    text: [
      "¡Oh no, ahí no va... ¿probamos en otra casilla? 🐾😅",
      "¡Uy, casi! Pero siento que esa carta pertenece a otro lugar. 🐈‍⬛✨",
      "Miau... mi intuición felina dice que ahí no es. ¡Intenta de nuevo! 🐾",
      "¡Mec! Respuesta equivocada. Pero no te preocupes, ¡sigue buscando! 🔍😸",
      "Ese altar no parece resonar con esta carta. ¡Prueba en el siguiente! 🔮",
      "¡Cerca! Pero la magia fluye en otra dirección, {{userName}}. 🌙",
      "Esa casilla y esta carta se repelen como dos imanes del mismo polo. ¡Otra vez! 🧲🐈",
      "¡Ups! Parece que las estrellas no se alinearon en ese espacio. 🌟😅",
      "Mmmm... no. ¡Pero el que no arriesga no gana! Prueba otro. 🐾🐾",
      "¡Falso, falso, falso! Bueno, no tanto, pero sí va en otro lado. 😹"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 3500
  },
  "PENDING_PLACEMENT_REMINDER": {
    priority: 2,
    text: [
      "Tienes la carta \"{{title}}\" en mano. ¡Haz clic en el vértice del pentáculo donde crees que encaja! 🐾🃏"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },
  "ALBUM_PENTACLE_COMPLETE": {
    priority: 2,
    text: [
      "¡Wow! completamos los elementos, ¿iniciamos el ritual de cobrar? 🎁🔮"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 5000
  },

  "RITUAL_STEP_1": {
    text: [
      "Parece que el ritual ha sido un éxito... pero ¿qué te ha dado {{rewardText}}?, ¿sólo eso? Las cartas se transformaron en un brillo extraño, ¿invocamos más magia a ver que pasa?"
    ],
    video: "assets/videos/spiral_message.mp4",
    persistent: true,
    actionConfig: [
      { label: "Recibir {{rewardText}} e invocar más magia", type: "ADVANCE_RITUAL", variant: "highlighted", icon: "next" }
    ]
  },

  "RITUAL_STEP_2": {
    text: [
      "Wow nos hemos teletransportado a otra realidad, las luciérnagas nos ayudarán a ver más claramente, además encontré {{rewardText}}, ¿usamos a las luciérnagas para manifestar la realidad completa?"
    ],
    video: "assets/videos/spiral_message.mp4",
    persistent: true,
    actionConfig: [
      { label: "Recibir {{rewardText}} y usar luciérnagas", type: "ADVANCE_RITUAL", variant: "highlighted", icon: "next" }
    ]
  },

  "RITUAL_STEP_3": {
    text: [
      "¡Parece que tenemos tierra firme!, encontré {{rewardText}}, pero eso no puede ser todo, ¿me invocas en la escena para buscar algo más?"
    ],
    video: "assets/videos/spiral_message.mp4",
    persistent: true,
    actionConfig: [
      { label: "Recibir {{rewardText}} e invocar a Spiral", type: "ADVANCE_RITUAL", variant: "highlighted", icon: "next" }
    ]
  },

  "RITUAL_STEP_4": {
    text: [
      "Oops, he reunido suficiente energía para manifestarme en la escena, pero no lo he logrado, pero que bonitas flores, ahora sí estoy listo para entrar, ¿me invocas?"
    ],
    video: "assets/videos/spiral_message.mp4",
    persistent: true,
    actionConfig: [
      { label: "Invocar a Spiral", type: "ADVANCE_RITUAL", variant: "highlighted", icon: "next" }
    ]
  },

  "RITUAL_STEP_5": {
    text: [
      "OMG! encontré una bolsita con dinero, ¿intento acercarme a ti para dártela?"
    ],
    video: "assets/videos/spiral_message.mp4",
    persistent: true,
    actionConfig: [
      { label: "Acercate, Spiral", type: "ADVANCE_RITUAL", variant: "highlighted", icon: "next" }
    ]
  },

  "RITUAL_STEP_6": {
    text: [
      "¡Logré acercarme!, pero para darte este dinero tendré que aventarlo al aire y regresar a la app, ¿lo intentamos?"
    ],
    video: "assets/videos/spiral_message.mp4",
    persistent: true,
    actionConfig: [
      { label: "Inténtalo, Spiral", type: "ADVANCE_RITUAL", variant: "highlighted", icon: "next" }
    ]
  },

  "RITUAL_STEP_7": {
    text: [
      "Wow regresé, ahora tienes $300, han sido añadidos a tu perfil, para cobrarlos, habla con tu guía."
    ],
    video: "assets/videos/spiral_message.mp4",
    persistent: true,
    actionConfig: [
      { label: "Genial, Spiral", type: "COMPLETE_RITUAL", variant: "highlighted", icon: "check" }
    ]
  },

  "ALBUM_PAGE_CLAIMED": {
    priority: 1,
    text: [
      "¡Miau! Esta página ya brilla con el sello del ritual cobrado. ¡Bien hecho! 🌕🪙",
      "Prrr... Siento la energía residual de las estrellas que cosechamos en esta página. ✨🐱",
      "¡Meow! Las cartas de esta página ya entregaron su tributo de $300 a tu monedero. 🪙🐾",
      "Miau... El pentáculo de la página {{pageNum}} está consagrado y en paz. ¡Una gran colección! 🔮💜",
      "¡Prrr! {{userName}}, la magia de esta página ya fue cosechada. Mírale el centro. 🌸✨",
      "¡Meow! La Triple Diosa protege esta sección del álbum. Nada más que cobrar aquí. 🌙📖",
      "Prrr... Este capítulo cósmico está completo y el oro a buen resguardo. 🪙🐾",
      "¡Miau! Las casillas descansan bajo un manto de plata. Qué bonita se ve completa. 🌌✨",
      "¡Meow! Siento el ronroneo del universo al contemplar esta página terminada. 😸🌟",
      "Miau... La abundancia ya fluye en tu cuenta, {{userName}}. ¡A por la siguiente página! 💸💫"
    ],
    video: "assets/videos/spiral_message.mp4",
    duration: 4000
  },

  "NEW_DAY_PROMPT": {
    priority: 5,
    text: [
      "El sol ha salido y una nueva energía rodea este día. ¿Lista para comenzar, {{userName}}?"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Empezar nuevo día", type: "START_NEW_DAY", variant: "highlighted", icon: "check" },
      { label: "Mejor reviso antes", type: "REVIEW_PREVIOUS_DAY", variant: "normal", icon: "back" }
    ]
  },

  "REVIEW_DAY_WAITING": {
    priority: 1,
    text: [
      "Tómate tu tiempo para registrar lo de ayer. Cuando termines, avísame para empezar este hermoso nuevo día. ✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Empezar nuevo día", type: "START_NEW_DAY", variant: "highlighted", icon: "check" }
    ]
  },

  "PENDING_CARD_PROMPT": {
    priority: 4,
    text: [
      "¡Prrr! Tienes una carta mágica vibrando en tu inventario. ¡Vamos a pegarla al álbum! 🔮"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Ir al Álbum", type: "GO_TO_ALBUM", variant: "highlighted", icon: "next" }
    ]
  },

  "DASHBOARD_FULL_MOON": {
    priority: 4,
    text: [
      "¡Miau, ¡qué brillo! 🌕✨! Es Luna Llena, ¡Ganas 60 ⭐! y una carta para tu albúm."
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Recoger Carta", type: "CLAIM_MOON_REWARD", variant: "highlighted", icon: "star" }
    ]
  },

  "RENEW_MOON_PROMPT": {
    priority: 4,
    text: [
      "¡Wow, una carta mágica apareció! ¿Vamos al álbum a insertarla? ✨"
    ],
    video: "assets/videos/spiral_message.mp4",
    actionConfig: [
      { label: "Al Álbum", type: "GO_TO_ALBUM", variant: "highlighted", icon: "next" },
      { label: "Mejor Luego", type: "RENEW_MOON_LATER", variant: "normal", icon: "cancel" }
    ]
  }
};
