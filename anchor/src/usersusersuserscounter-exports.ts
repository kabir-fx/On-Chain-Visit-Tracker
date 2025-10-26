// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Usersusersusersuserscounter, USERSUSERSUSERSUSERSCOUNTER_DISCRIMINATOR, USERSUSERSUSERSCOUNTER_PROGRAM_ADDRESS, getUsersusersusersuserscounterDecoder } from './client/js'
import UsersusersusersuserscounterIDL from '../target/idl/usersusersuserscounter.json'

export type UsersusersusersuserscounterAccount = Account<Usersusersusersuserscounter, string>

// Re-export the generated IDL and type
export { UsersusersusersuserscounterIDL }

export * from './client/js'

// Explicitly export instruction functions
export { getInitializeInstruction } from './client/js/generated/instructions/initialize'
export { getIncrementInstruction } from './client/js/generated/instructions/increment'
export { getDecrementInstruction } from './client/js/generated/instructions/decrement'
export { getSetInstruction } from './client/js/generated/instructions/set'
export { getCloseInstruction } from './client/js/generated/instructions/close'

export function getUsersusersusersuserscounterProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getUsersusersusersuserscounterDecoder(),
    filter: getBase58Decoder().decode(USERSUSERSUSERSUSERSCOUNTER_DISCRIMINATOR),
    programAddress: USERSUSERSUSERSCOUNTER_PROGRAM_ADDRESS,
  })
}
