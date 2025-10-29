import {
  address,
  airdropFactory,
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  getAddressEncoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  Instruction,
  KeyPairSigner,
  lamports,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  COUNTER_PROGRAM_ADDRESS,
  getInitializeCounterInstruction,
  getMarkUserVisitInstruction
} from '../src'
import { describe, it, beforeAll, expect } from 'vitest'
import { fetchCounter, fetchUserVisit } from '../src/client/js'

const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('First user visits the counter program', () => {
  let payer: KeyPairSigner
  let counterPdaAddress: string
  const airdrop = airdropFactory({ rpc, rpcSubscriptions });

  beforeAll(async () => {
    payer = await generateKeyPairSigner()

    await airdrop({
      commitment: 'confirmed',
      recipientAddress: payer.address,
      lamports: lamports(10_000_000n),
    });

    // Cal. the counter PDA address using the same seeds as the program
    const counterPda = await getProgramDerivedAddress({
      programAddress: COUNTER_PROGRAM_ADDRESS,
      seeds: [new Uint8Array(Buffer.from('counter'))],
    })

    counterPdaAddress = counterPda[0]
  })

  describe('Initialize Counter', () => {
    it('should initialize the counter successfully', async () => {
      expect.assertions(3)

      const ix = getInitializeCounterInstruction({
        payer: payer,
        counter: address(counterPdaAddress),
      })

      // ACT
      await sendAndConfirm({ ix, payer })

      // ASSERT
      const counterAccount = await fetchCounter(rpc, address(counterPdaAddress))

      expect(counterAccount.data.count).toEqual(0n)
      expect(counterAccount.data.bump).toBeDefined()
      expect(typeof counterAccount.data.bump).toBe('number')
    })

    it('should fail to initalize counter twice', async () => {
      const ix = getInitializeCounterInstruction({
        payer: payer,
        counter: address(counterPdaAddress),
      })

      // ACT & ASSERT
      await expect(sendAndConfirm({ ix, payer })).rejects.toThrow()
    })
  })

  describe('Mark user visit', () => {
    let user1: KeyPairSigner
    let user1PdaAddress: string

    let user2: KeyPairSigner
    let user2PdaAddress: string

    beforeAll(async () => {
      user1 = await generateKeyPairSigner()

      await airdrop({
        commitment: 'confirmed',
        recipientAddress: user1.address,
        lamports: lamports(10_000_000n),
      });

      const user1Pda = await getProgramDerivedAddress({
        // programAddress: address(user1.address),
        programAddress: COUNTER_PROGRAM_ADDRESS,
        seeds: [
          getBytesEncoder().encode(new Uint8Array(Buffer.from('user_visit'))),

          // Encode the address as Uint8Array
          getAddressEncoder().encode(user1.address),
        ],
      })

      user1PdaAddress = user1Pda[0]

      user2 = await generateKeyPairSigner()

      await airdrop({
        commitment: 'confirmed',
        recipientAddress: user2.address,
        lamports: lamports(10_000_000n),
      });

      const user2Pda = await getProgramDerivedAddress({
        programAddress: COUNTER_PROGRAM_ADDRESS,
        seeds: [
          getBytesEncoder().encode(new Uint8Array(Buffer.from('user_visit'))),

          // Encode the address as Uint8Array
          getAddressEncoder().encode(user2.address),
        ],
      })

      user2PdaAddress = user2Pda[0]
    })
    it('should increment the count of counter successfully', async () => {
      expect.assertions(3)

      const ix = getMarkUserVisitInstruction({
        user: user1,
        counter: address(counterPdaAddress),
        userVisit: address(user1PdaAddress),
      })

      // ACT
      await sendAndConfirm({ ix, payer: user1 })

      // ASSERT
      const counterAccount = await fetchCounter(rpc, address(counterPdaAddress))
      expect(counterAccount.data.count).toEqual(1n)

      const userVisitAccount = await fetchUserVisit(rpc, address(user1PdaAddress))
      expect(userVisitAccount.data.hasVisited).toBe(true)
      expect(userVisitAccount.data.user).toBe(user1.address)
    })

    it('should not allow the same user to increment the count again', async () => {
      expect.assertions(1)

      const ix = getMarkUserVisitInstruction({
        user: user1,
        counter: address(counterPdaAddress),
        userVisit: address(user1PdaAddress),
      })

      // ACT & ASSERT
      await expect(sendAndConfirm({ ix, payer: user1 })).rejects.toThrow()
    })

    it('should increment the count of counter from a different user', async () => {
      expect.assertions(3)

      const ix = getMarkUserVisitInstruction({
        user: user2,
        counter: address(counterPdaAddress),
        userVisit: address(user2PdaAddress),
      })

      // ACT
      await sendAndConfirm({ ix, payer: user2 })

      // ASSERT
      const counterAccount = await fetchCounter(rpc, address(counterPdaAddress))
      expect(counterAccount.data.count).toEqual(2n)

      const userVisitAccount = await fetchUserVisit(rpc, address(user2PdaAddress))
      expect(userVisitAccount.data.hasVisited).toBe(true)
      expect(userVisitAccount.data.user).toBe(user2.address)
    })

  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
