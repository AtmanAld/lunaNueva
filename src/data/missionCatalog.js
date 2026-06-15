export const missionCatalog = {
  m_tomar_pastillas: {
    id: "m_tomar_pastillas",
    meta: {
      title: "Tomar pastillas",
      description: "Toma tus pastillas diarias como esté indicado.",
      category: "Wellness"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 15 }], points: [{ type: "moon_points", amount: 4 }] }
    },
    content: { hasMultimedia: false }
  },
  m_usar_bicicleta: {
    id: "m_usar_bicicleta",
    meta: {
      title: "Usar bicicleta",
      description: "Sal a montar en bicicleta para hacer cardio y despejar la mente.",
      category: "Ejercicio"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 50 }], points: [{ type: "moon_points", amount: 8 }] }
    },
    content: { hasMultimedia: false }
  },
  m_ver_tiktoks: {
    id: "m_ver_tiktoks",
    meta: {
      title: "Ver tiktoks",
      description: "Disfruta un rato viendo videos cortos en TikTok.",
      category: "Recreación"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 10 }], points: [{ type: "moon_points", amount: 2 }] }
    },
    content: { hasMultimedia: false }
  },
  m_hacer_comida: {
    id: "m_hacer_comida",
    meta: {
      title: "Hacer comida",
      description: "Prepara una comida saludable en casa.",
      category: "Preparación"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 50 }], points: [{ type: "moon_points", amount: 10 }] }
    },
    content: { hasMultimedia: false }
  },
  m_ir_a_cobrar: {
    id: "m_ir_a_cobrar",
    meta: {
      title: "Ir a cobrar",
      description: "Realiza tus cobros o transacciones financieras pendientes.",
      category: "Finanzas"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 28, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 130 }], points: [{ type: "moon_points", amount: 5 }] }
    },
    content: { hasMultimedia: false }
  },
  m_comida_economica: {
    id: "m_comida_economica",
    meta: {
      title: "Comida económica",
      description: "Elige una opción de comida económica para cuidar tus finanzas.",
      category: "Finanzas"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 3, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 50 }], points: [{ type: "moon_points", amount: 4 }] }
    },
    content: { hasMultimedia: false }
  },
  m_lavar_ropa: {
    id: "m_lavar_ropa",
    meta: {
      title: "Lavar la ropa",
      description: "Lava y organiza tu ropa de la semana.",
      category: "Limpieza"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 6, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 5 }], points: [{ type: "moon_points", amount: 1 }] }
    },
    content: { hasMultimedia: false }
  },
  m_jugar: {
    id: "m_jugar",
    meta: {
      title: "Jugar (celular o pc)",
      description: "Dedica un tiempo a jugar tu videojuego favorito.",
      category: "Recreación"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 10 }], points: [{ type: "moon_points", amount: 3 }] }
    },
    content: { hasMultimedia: false }
  },
  m_colorear_tarot: {
    id: "m_colorear_tarot",
    meta: {
      title: "Colorear carta de tarot",
      description: "Pinta o diseña tu carta de Tarot para reconectar con tu lado artístico.",
      category: "Creatividad"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 40 }], points: [{ type: "moon_points", amount: 10 }] }
    },
    content: { hasMultimedia: false }
  },
  m_subir_tiktok: {
    id: "m_subir_tiktok",
    meta: {
      title: "Subir video a tiktok",
      description: "Graba, edita y sube un video a tu canal de TikTok.",
      category: "Creatividad"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 30 }], points: [{ type: "moon_points", amount: 7 }] }
    },
    content: { hasMultimedia: false }
  },
  m_dormir_temprano: {
    id: "m_dormir_temprano",
    meta: {
      title: "Dormir antes de la 1:00 am",
      description: "Duérmete a una hora adecuada para cuidar tu ciclo de sueño.",
      category: "Wellness"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 20 }], points: [{ type: "moon_points", amount: 6 }] }
    },
    content: { hasMultimedia: false }
  },
  m_ver_series_netflix: {
    id: "m_ver_series_netflix",
    meta: {
      title: "Ver series en Netflix",
      description: "Toma un merecido descanso de una hora para ver tu serie favorita en Netflix.",
      category: "Entretenimiento"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 4 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 10 }], points: [{ type: "moon_points", amount: 1 }] }
    },
    content: { hasMultimedia: false }
  },
  m_masaje_corazon_nuca: {
    id: "m_masaje_corazon_nuca",
    meta: {
      title: "Masaje de corazón-nuca (5 min)",
      description: "Relájate y estimula tu nervio vago con un suave masaje de 5 minutos desde el pecho hasta la nuca.",
      category: "Nervio vago"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 10 }], points: [{ type: "moon_points", amount: 1 }] }
    },
    content: { hasMultimedia: false }
  },
  m_manualidades: {
    id: "m_manualidades",
    meta: {
      title: "Manualidades",
      description: "Dedica una hora a crear, pintar o construir algo con tus manos para dejar fluir tu imaginación.",
      category: "Creatividad"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 3 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 40 }], points: [{ type: "moon_points", amount: 8 }] }
    },
    content: { hasMultimedia: false }
  },
  m_respiracion_cuadrada: {
    id: "m_respiracion_cuadrada",
    meta: {
      title: "Respiración cuadrada",
      description: "Realiza ciclos de respiración cuadrada para calmar tu sistema nervioso y encontrar tu centro.",
      category: "Nervio vago"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 10 }], points: [{ type: "moon_points", amount: 1 }] }
    },
    content: { hasMultimedia: false }
  },
  m_masaje_orejas: {
    id: "m_masaje_orejas",
    meta: {
      title: "Masaje en las orejas",
      description: "Frota y masajea suavemente tus orejas para estimular el nervio vago y liberar la tensión acumulada.",
      category: "Nervio vago"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 10 }], points: [{ type: "moon_points", amount: 1 }] }
    },
    content: { hasMultimedia: false }
  },
  m_ejercicios_nervio_vago: {
    id: "m_ejercicios_nervio_vago",
    meta: {
      title: "Ejercicios nervio vago",
      description: "Realiza movimientos y ejercicios específicos para tonificar tu nervio vago, promoviendo una relajación profunda.",
      category: "Nervio vago"
    },
    availability: { timeWindow: { activeDays: null } },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "calendar", cooldownDays: 1, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 10 }], points: [{ type: "moon_points", amount: 1 }] }
    },
    content: { hasMultimedia: false }
  },
  m_consumir_polvo_lunar: {
    id: "m_consumir_polvo_lunar",
    meta: {
      title: "Consumir polvo lunar",
      description: "Inhala o usa polvo lunar para acelerar la fase de la luna.",
      category: "Mágico"
    },
    availability: {
      requiresCost: [{ item: "polvo_lunar", amount: 1 }],
      timeWindow: { activeDays: null }
    },
    execution: {
      objectiveType: "interaction",
      targetValue: 1,
      recurrence: { isRepeatable: true, resetType: "immediate", cooldownDays: 0, maxCompletions: 1 }
    },
    outcomes: {
      onComplete: { currencies: [{ type: "stars", amount: 20 }], points: [{ type: "moon_points", amount: 20 }] }
    },
    content: { hasMultimedia: false }
  }
};
