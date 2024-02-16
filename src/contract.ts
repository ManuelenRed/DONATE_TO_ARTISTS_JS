// Importa las funciones y clases necesarias de NEAR SDK
import { NearBindgen, near, call, view, initialize, Vector } from 'near-sdk-js'

// Importa la clase Donation y la constante STORAGE_COST desde el archivo model.ts
import { Donation, STORAGE_COST } from './model'

// Importa la función assert desde utils.ts
import { assert } from './utils'

// Anotación para indicar que esta clase se vinculará con NEAR
@NearBindgen({})
class DonateToArtistContract {
  // Vector para almacenar las donaciones, la clase esta en el archivo model.ts
  donations: Vector<Donation> = new Vector<Donation>("v-donations");

  // Función que permite a un usuario hacer una donación
  @call({ payableFunction: true })
  donate({ beneficiary }: { beneficiary: string }) {
    // Obtiene la cuenta que llama al método y los NEAR transferidos
    let donor = near.predecessorAccountId();
    let donationAmount: bigint = near.attachedDeposit() as bigint;

    // Almacena el monto que se va a donar descontando el costo de almacenamiento si aplica
    let toTransfer = donationAmount;
    
    // Registra en el log la cuenta del beneficiario
    near.log(`Cuenta del beneficiario: ${beneficiary}`)

    // Llama a la funcion que busca en el vector si el donante ya le ha donado al artista antes y almacena el indice en el vector
    let donationIndex = this.findDonationIndex(donor, beneficiary);

    // Si el donante ya ha donado obtiene un indice positivo, actualiza la donación existente con el monto que transfirio en el vector
    if (donationIndex >= 0) {
      let existingDonation = this.donations[donationIndex];
      existingDonation.total_amount += donationAmount;
      this.donations.replace(donationIndex, existingDonation);

    } else {
      // Si es una nueva donación, verifica que el monto sea mayor al costo de almacenamiento y envia los datos a la función en utils.ts
      assert(donationAmount > STORAGE_COST, `Attach at least ${STORAGE_COST} yoctoNEAR`);
      
      // Resta el costo de almacenamiento al monto a transferir
      toTransfer -= STORAGE_COST

      // Crea una nueva donación y la agrega al vector
      let newDonation = new Donation(donor, beneficiary, toTransfer);
      this.donations.push(newDonation);
    }

    // Registra en el log un mensaje de agradecimiento para validar los datos
    near.log(`Thank you ${donor} for donating ${donationAmount}! You donated a total of ${toTransfer} to ${beneficiary}`)

    // Crea un batch de promesas para transferir los fondos al beneficiario, lo que indica que si alguna función no se ejecuta ninguna lo hará
    const promise = near.promiseBatchCreate(beneficiary);
    near.promiseBatchActionTransfer(promise, toTransfer);
  }

  // Encuentra el índice de la donación en el vector, recorriendo de acuerdo al tamaño del vector de donaciones
  findDonationIndex(donor: string, beneficiary: string) {
    for (let i = 0; i < this.donations.length; i++) {
      let donation = this.donations[i];
      near.log(`Donador recorrido: ${donation}`)
      // en caso de encontrar una considencias retorna el indice
      if (donation.account_id_donor == donor && donation.account_id_beneficiary == beneficiary) {
        return i;
      }
    }
    // sino hay considencias retorna -1
    return -1;
  }  
}
