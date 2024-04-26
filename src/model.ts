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

export class Project {
  // Nombre del proyecto
  name: string;
  // Dueño del proyecto
  account_id_owner: string;
  // Descripcion del proyecto
  description: string;
  // Total donado
  total_amount: bigint;

  constructor(name: string, owner: string, description: string) {
    // Asignamos el nombre del proyecto
    this.name = name;
    // Asignamos el identificador del dueño del proyecto
    this.account_id_owner = owner;
    // Asignamos la descripcion del proyecto
    this.description = description;
  }
}

export class ProyectFunding {
  // Asignamos el identificador del donador
  donor: string;
  // Asignamos el proyecto que se fondea
  proyect: Project;
  // Asignamos el monto que se ha donado
  total_amount: bigint;

  constructor(donor: string, proyect: Project, donatioAmount: bigint){
    // Asignamos el identificador del donador
    this.donor = donor;
    // Asignamos el proyecto que se fondea
    this.proyect = proyect;
    // Asignamos el monto que se ha donado
    this.total_amount = donatioAmount;
  }
}

