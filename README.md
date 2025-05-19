# 👋 Hello World Solana Program (Anchor)

This is a simple Solana smart contract using the [Anchor framework](https://book.anchor-lang.com/) that stores a **message on-chain**. The contract supports updating the message and allows the account to be **closed only when the message is `"finalize"`**.

---

## 🧰 Features

- 🟢 Initialize a message account.
- ✏️ Update the message with any new string.
- 🔐 Finalize (close) the account only if the message is `"finalize"`.
- 🔁 Lamports are refunded to the user upon finalization.

---

## 💡 Usage Guide

### 1. `initialize(message: String)`
Creates a new on-chain account to store a string message.

- 🔐 Requires `user` signature (payer).
- 💰 Allocates space for the message.

```ts
await program.methods
  .initialize("Hello Solana")
  .accounts({
    helloWorldAccount: account.publicKey,
    user: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([account])
  .rpc();
````

---

### 2. `update(new_message: String)`

Updates the stored message with a new value.

* ✅ Requires `user` signature.

```ts
await program.methods
  .update("New message")
  .accounts({
    helloWorldAccount: account.publicKey,
    user: wallet.publicKey,
  })
  .rpc();
```

---

### 3. `finalize()`

Closes the account **only if the message is `"finalize"`**, transferring rent lamports back to the user.

* ❗ Throws `InvalidFinalizationMessage` if message is not `"finalize"`.
* 🧹 Frees on-chain space and refunds lamports.

```ts
await program.methods
  .finalize()
  .accounts({
    helloWorldAccount: account.publicKey,
    user: wallet.publicKey,
  })
  .rpc();
```

---

## 🗃️ Account Structure

### `HelloWorldAccount`

| Field     | Type   | Description         |
| --------- | ------ | ------------------- |
| `message` | String | Stored message text |

---

## ❗ Custom Errors

* `InvalidFinalizationMessage`: Triggered if `finalize()` is called and the stored message is not `"finalize"`.

---

## 🧪 Testing Tips

* Test `initialize()` with a variety of message lengths.
* Try calling `finalize()` with and without setting the message to `"finalize"`.
* Use `update()` to overwrite existing messages multiple times.

---

## 🧱 Built With

* [Solana](https://solana.com/)
* [Anchor Framework](https://github.com/coral-xyz/anchor)
* [Rust](https://www.rust-lang.org/)

---

## 📜 License

MIT — Use freely, fork, and build your own variations!