export const collectionIndex = [
  {
    collectionId: "col_set_1",
    meta: {
      title: "Antes del desayuno",
      category: "rutinas",
    },
    behavior: {
      flow: "unordered",
      isUserEditable: true,
      activeDays: null
    },
    nodes: [
      { nodeId: "m_tomar_pastillas", next: null },
      { nodeId: "m_usar_bicicleta", next: null },
      { nodeId: "m_ver_tiktoks", next: null }
    ]
  },
  {
    collectionId: "col_set_2",
    meta: {
      title: "Medio día",
      category: "rutinas",
    },
    behavior: {
      flow: "unordered",
      isUserEditable: true,
      activeDays: null
    },
    nodes: [
      { nodeId: "m_hacer_comida", next: null },
      { nodeId: "m_ir_a_cobrar", next: null },
      { nodeId: "m_comida_economica", next: null },
      { nodeId: "m_lavar_ropa", next: null },
      { nodeId: "m_jugar", next: null },
      { nodeId: "m_masaje_corazon_nuca", next: null },
      { nodeId: "m_manualidades", next: null },
      { nodeId: "m_respiracion_cuadrada", next: null },
      { nodeId: "m_masaje_orejas", next: null },
      { nodeId: "m_ejercicios_nervio_vago", next: null }
    ]
  },
  {
    collectionId: "col_set_3",
    meta: {
      title: "Por la tarde",
      category: "rutinas",
    },
    behavior: {
      flow: "unordered",
      isUserEditable: true,
      activeDays: null
    },
    nodes: [
      { nodeId: "m_colorear_tarot", next: null },
      { nodeId: "m_subir_tiktok", next: null },
      { nodeId: "m_dormir_temprano", next: null },
      { nodeId: "m_ver_series_netflix", next: null }
    ]
  },
  {
    collectionId: "col_system_items",
    meta: {
      title: "Objetos Mágicos",
      category: "system",
    },
    behavior: {
      flow: "unordered",
      isUserEditable: false,
      activeDays: null
    },
    nodes: [
      { nodeId: "m_consumir_polvo_lunar", next: null }
    ]
  },
  {
    collectionId: "col_moon_cycle",
    meta: {
      title: "El Ciclo Lunar",
      category: "system",
    },
    behavior: {
      flow: "linear",
      isUserEditable: false,
      activeDays: null
    },
    nodes: []
  }
];
