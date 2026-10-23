// Dando Jugo - Índice de Datos Modular
// Cada conjunto de datos está completamente separado e independiente para consultas específicas.

import trivia from './trivia.json';
import minijuegos from './minijuegos.json';
import jugo from './jugo.json';
import hoja7Retos from './hoja7_retos.json';
import variables from './variables.json';
import modosJuego from './modos_juego.json';
import catalogoMinijuegos from './catalogo_minijuegos.json';
import werejuice from './werejuice.json';

/**
 * Función utilitaria para reemplazar variables dinámicas (#, $, %, &, /) por su valor de sorbos
 * @param {string} texto
 * @returns {string}
 */
export function resolverVariablesTexto(texto) {
  if (!texto) return '';
  let resultado = texto;
  for (const [simbolo, valor] of Object.entries(variables)) {
    resultado = resultado.replaceAll(simbolo, `${valor}`);
  }
  return resultado;
}

export {
  trivia,
  minijuegos,
  jugo,
  hoja7Retos,
  variables,
  modosJuego,
  catalogoMinijuegos,
  werejuice
};
