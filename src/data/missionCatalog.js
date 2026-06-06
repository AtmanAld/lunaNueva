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
      onComplete: { currencies: [{ type: "stars", amount: 40 }], points: [{ type: "moon_points", amount: 6 }] }
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
