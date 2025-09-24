//import assert from "assert";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
//import { Sol001helloworld } from "../target/types/sol001helloworld";
import { HelloWorldSolana } from "../target/types/hello_world_solana";
import { assert, expect } from "chai";

 
describe("HelloWorldSolana Tests", () => {
  // conexão com a blockchain
  anchor.setProvider(anchor.AnchorProvider.env());
 
  // dependências para os testes
  const program = anchor.workspace.HelloWorldSolana as Program<HelloWorldSolana>;

  //const program = anchor.workspace.sol001helloworld as Program<Sol001helloworld>;

  const helloWorldAccount = anchor.web3.Keypair.generate();
  const account2 = anchor.web3.Keypair.generate();
 
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  async function airdrop(pubkey: anchor.web3.PublicKey, lamports = 2e9) {
    // 2 SOL em devnet; ajuste se o faucet limitar a 1 SOL
    const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash();
    const sig = await provider.connection.requestAirdrop(pubkey, lamports);
    await provider.connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
  }
  before(async () => {
    // Necessário se estiver em devnet (ou local validator desligado)
    await airdrop(account2.publicKey, 1e9);
    await airdrop(helloWorldAccount.publicKey, 1e9);
  });

  //testes vão aqui

  //Este teste inicializa conta de dados do HelloWorld que será usada no teste seguinte
  it("Hello World initialize", async () => {
    const testMessage = "Hello SVM";

    console.log("Account Program: ", program.programId);

    console.log("Account 1: ", helloWorldAccount.publicKey);
    console.log("Account 2: ", account2.publicKey);
    console.log("Account 3: ", anchor.getProvider().publicKey);


    let tx = await program.methods.initialize(testMessage)
      .accounts({
        helloWorldAccount: helloWorldAccount.publicKey,
        //user: anchor.getProvider().publicKey
        initializer: account2.publicKey
      })
      .signers([helloWorldAccount, account2])
      .rpc();
  
    const account = await program.account.helloWorldAccount.fetch(helloWorldAccount.publicKey);
    assert.ok(account.message === testMessage);

    console.log("Recorded owner:", account.owner.toBase58());
  });




  //Precisa que a conta de dados do HelloWorld tenha sido inicializada anteriormente
  it("Hello World Updata", async () => {
    const testMessage = "Hello World 2";

    let tx = await program.methods.update(testMessage)
      .accounts({
        helloWorldAccount: helloWorldAccount.publicKey,
        //user: anchor.getProvider().publicKey
        user: account2.publicKey
      })
      //.signers([helloWorldAccount])
      .signers([account2])
      .rpc();
  
    const account = await program.account.helloWorldAccount.fetch(helloWorldAccount.publicKey);
    assert.ok(account.message === testMessage);
  });

  it("Should not finalize the contract - Wrong Message", async () => {

    //Com este metodo eu posso pegar os erros sem necessidade de plugins extras;
    try {
      await program.methods
        .finalize()
        .accounts({
          helloWorldAccount: helloWorldAccount.publicKey,
          owner: anchor.getProvider().publicKey,
        })
        .rpc();
      
      // If we got here, the call didn't fail as expected
      assert.fail("Expected transaction to be reverted due to wrong message");
    } catch (err: any) {
      // Optional: check specific Anchor error code or message
      expect(err.message).to.include("The account message must be 'finalize' to finalize (close) the account.");
    }

  });

  it("Should NOT finalize the contract (Not Owner)", async () => {  

    //Update to finalize the contract
    const testMessage = "finalize";

    let tx = await program.methods.update(testMessage)
      .accounts({
        helloWorldAccount: helloWorldAccount.publicKey,
        //user: anchor.getProvider().publicKey
        user: account2.publicKey
      })
      //.signers([helloWorldAccount])
      .signers([account2])
      .rpc();
  
    const account = await program.account.helloWorldAccount.fetch(helloWorldAccount.publicKey);
    assert.ok(account.message === testMessage);

    try {
      await program.methods
        .finalize()
        .accounts({
          helloWorldAccount: helloWorldAccount.publicKey,
          owner: anchor.getProvider().publicKey,
        })
        .rpc();
      
      // If we got here, the call didn't fail as expected
      assert.fail("Expected transaction to be reverted due to wrong message");
    } catch (err: any) {
      // Optional: check specific Anchor error code or message
      expect(err.message).to.include("Only the owner can perform this action.");
    }
  });

  it("Should finalize the contract", async () => {  


    await program.methods
      .finalize()
      .accounts({
        helloWorldAccount: helloWorldAccount.publicKey,
        owner: account2.publicKey,
      })
      .signers([account2])
      .rpc();

    // ✅ Do not try to fetch the account now.
    // You can test indirectly, like checking that the account no longer exists:
    try {
      await program.account.helloWorldAccount.fetch(helloWorldAccount.publicKey);
      assert.fail("Should not be able to fetch closed account");
    } catch (e) {
      assert.include(e.message, "Account does not exist");
    }
  });
  
});