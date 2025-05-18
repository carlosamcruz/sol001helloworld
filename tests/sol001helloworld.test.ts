import assert from "assert";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Sol001helloworld } from "../target/types/sol001helloworld";
import { HelloWorldSolana } from "../target/types/hello_world_solana";

 
describe("HelloWorldSolana Tests", () => {
  // conexão com a blockchain
  anchor.setProvider(anchor.AnchorProvider.env());
 
  // dependências para os testes
  const program = anchor.workspace.HelloWorldSolana as Program<HelloWorldSolana>;

  //const program = anchor.workspace.sol001helloworld as Program<Sol001helloworld>;

  const helloWorldAccount = anchor.web3.Keypair.generate();
  const account2 = anchor.web3.Keypair.generate();
 
  //testes vão aqui

  //Este teste inicializa conta de dados do HelloWorld que será usada no teste seguinte
  it("Hello World initialize", async () => {
    const testMessage = "Hello World";

    console.log("Account Program: ", program.programId);

    console.log("Account 1: ", helloWorldAccount.publicKey);
    console.log("Account 2: ", account2.publicKey);
    console.log("Account 3: ", anchor.getProvider().publicKey);


    let tx = await program.methods.initialize(testMessage)
      .accounts({
        helloWorldAccount: helloWorldAccount.publicKey,
        user: anchor.getProvider().publicKey
        //user: account2.publicKey
      })
      .signers([helloWorldAccount])
      .rpc();
  
    const account = await program.account.helloWorldAccount.fetch(helloWorldAccount.publicKey);
    assert.ok(account.message === testMessage);
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

});
