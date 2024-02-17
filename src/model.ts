// Costo de almacenamiento en la cadena de bloques NEAR, expresado en yoctoNEAR (1 NEAR = 1e24 yoctoNEAR)
export const STORAGE_COST: bigint = BigInt("1000000000000000000000");

/**
 * Clase que representa una donación
 * @param statement La declaración a verificar.
 * @param message El mensaje de error a mostrar si la declaración es falsa.
 */

export class Donation {
  // Identificador de la cuenta del donante
  account_id_donor: string;
  // Identificador de la cuenta del beneficiario
  account_id_beneficiary: string;
  // Monto total donado, expresado en yoctoNEAR
  total_amount: bigint;


/**
 * Constructor de la clase Donation
 * @param donor La dirección del donante.
 * @param beneficiary La dirección del beneficiario
 * @param donationAmount EL monto que ha donado
 */
constructor(donor: string, beneficiary: string, donationAmount: bigint) {
  // Asigna el identificador de la cuenta del donante
    this.account_id_donor = donor;
    // Asigna el identificador de la cuenta del beneficiario
    this.account_id_beneficiary = beneficiary;
    // Asigna el monto total donado
    this.total_amount = donationAmount;
  }
}
