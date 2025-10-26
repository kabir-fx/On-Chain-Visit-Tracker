import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchUsersusersusersuserscounter,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('usersusersuserscounter', () => {
  let payer: KeyPairSigner
  let usersusersuserscounter: KeyPairSigner

  beforeAll(async () => {
    usersusersuserscounter = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Usersusersusersuserscounter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, usersusersuserscounter: usersusersuserscounter })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentUsersusersusersuserscounter = await fetchUsersusersusersuserscounter(rpc, usersusersuserscounter.address)
    expect(currentUsersusersusersuserscounter.data.count).toEqual(0)
  })

  it('Increment Usersusersusersuserscounter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      usersusersuserscounter: usersusersuserscounter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchUsersusersusersuserscounter(rpc, usersusersuserscounter.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Usersusersusersuserscounter Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ usersusersuserscounter: usersusersuserscounter.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchUsersusersusersuserscounter(rpc, usersusersuserscounter.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Usersusersusersuserscounter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      usersusersuserscounter: usersusersuserscounter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchUsersusersusersuserscounter(rpc, usersusersuserscounter.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set usersusersuserscounter value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ usersusersuserscounter: usersusersuserscounter.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchUsersusersusersuserscounter(rpc, usersusersuserscounter.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the usersusersuserscounter account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      usersusersuserscounter: usersusersuserscounter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchUsersusersusersuserscounter(rpc, usersusersuserscounter.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${usersusersuserscounter.address}`)
    }
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
