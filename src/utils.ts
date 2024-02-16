/**
 * Verifica si una declaración es verdadera.
 * Si la declaración es falsa, lanza un error con un mensaje específico.
 * @param statement La declaración a verificar.
 * @param message El mensaje de error a mostrar si la declaración es falsa.
 */
export function assert(statement, message) {
  if (!statement) {
    throw Error(`Assertion failed: ${message}`);
  }
}
