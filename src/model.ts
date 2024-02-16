export const STORAGE_COST: bigint = BigInt("1000000000000000000000")

export class Donation {
  account_id_donor: string;
  account_id_beneficiary: string;
  total_amount: bigint;

  constructor(donor: string, beneficiary: string, donationAmount: bigint) {
    this.account_id_donor = donor;
    this.account_id_beneficiary = beneficiary;
    this.total_amount = donationAmount; // Convertimos el número a string  }
  }
}