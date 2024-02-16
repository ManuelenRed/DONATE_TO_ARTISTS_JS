// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, initialize, Vector } from 'near-sdk-js'
import { Donation, STORAGE_COST } from './model'
import { assert } from './utils'

@NearBindgen({})
class DonateToArtistContract {
  // Almacenara el donador, beneficiario y cuánto le ha donado
  donations: Vector<Donation> = new Vector<Donation>("v-donations");

  @call({ payableFunction: true})
  donate(beneficiary: string) {
    // Obtiene la cuenta que esta llamando al metodo y los $NEAR transferidos
    let donor = near.predecessorAccountId();
    let donationAmount: bigint = near.attachedDeposit() as bigint;
    
    let toTransfer = donationAmount;
    
    near.log(`Cuenta del beneficiario: ${beneficiary.substring}`)

    // Encuentra el registro de donación para el donante y el beneficiario en caso de que ya haya donado
    let donationIndex = this.findDonationIndex(donor, beneficiary);

    if (donationIndex >= 0) {
      // Actualiza la donación existente
      let existingDonation = this.donations[donationIndex];
      existingDonation.total_amount += donationAmount;
      this.donations.replace(donationIndex, existingDonation);

    } else {
      // Agrega una nueva donación

      assert(donationAmount > STORAGE_COST, `Attach at least ${STORAGE_COST} yoctoNEAR`);
      
      // Subtract the storage cost to the amount to transfer
      toTransfer -= STORAGE_COST

      let newDonation = new Donation(donor, beneficiary, toTransfer);
      this.donations.push(newDonation);
    }

    near.log(`Thank you ${donor} for donating ${donationAmount}! You donated a total of ${toTransfer} to ${beneficiary}`)

    const promise = near.promiseBatchCreate(beneficiary);
    near.promiseBatchActionTransfer(promise, toTransfer);
  }

    // Encuentra el índice de la donación en el vector
  findDonationIndex(donor: string, beneficiary: string) {
    for (let i = 0; i < this.donations.length; i++) {
      let donation = this.donations[i];
      if (donation.account_id_donor == donor && donation.account_id_beneficiary == beneficiary) {
        return i;
      }
    }
    return -1;
  }

  
}