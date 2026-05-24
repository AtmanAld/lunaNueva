/**
 * Utilidades para manejo de fechas en Luna Nueva
 * Evita problemas de desfase horario (UTC vs Local)
 */

/**
 * Retorna la fecha local actual en formato YYYY-MM-DD
 */
export const getLocalDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/**
 * Comprueba si la fecha actual es cronológicamente posterior a la última guardada
 */
export const isChronologicallyNewDay = (lastDateStr, currentDateStr) => {
  if (!lastDateStr) return true;
  // Comparamos como strings YYYY-MM-DD (funciona para orden cronológico)
  return currentDateStr > lastDateStr;
};

/**
 * Calcula la diferencia en días entre dos fechas (formato YYYY-MM-DD)
 */
export const calculateDaysDifference = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  // Reseteamos las horas para evitar problemas de husos horarios
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = end - start;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
