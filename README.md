# Hello World Solana (Anchor)

This is a simple **Solana smart contract** (program) built using the [Anchor framework](https://book.anchor-lang.com/) that demonstrates basic account initialization and data update on-chain.

## 🧠 Overview

The `hello_world_solana` program stores a simple `String` message on-chain using a custom `HelloWorldAccount`. It provides two main instructions:

- `initialize`: Creates the account and sets the initial message.
- `update`: Allows the user to update the message stored in the account.

## 🧾 Program Instructions

### 📦 `initialize(ctx, message: String)`

- **Purpose**: Creates and initializes a new `HelloWorldAccount` with a message.
- **Accounts**:
  - `hello_world_account` - The new account to store the message.
  - `user` - The signer and payer of the transaction.
  - `system_program` - Solana system program required for account creation.

### ✏️ `update(ctx, new_message: String)`

- **Purpose**: Updates the message in an existing `HelloWorldAccount`.
- **Accounts**:
  - `hello_world_account` - The account that holds the current message.
  - `user` - The signer paying the transaction fee (not necessarily the owner).

## 🧱 Account Structure

```rust
#[account]
pub struct HelloWorldAccount {
    pub message: String,
}
````

> In the `Initialize` instruction, the space allocated is `8 + 32` bytes. Adjust if you expect longer messages.

## 🚀 Getting Started

### Prerequisites

* [Rust + Cargo](https://www.rust-lang.org/tools/install)
* [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
* [Anchor CLI](https://www.anchor-lang.com/docs/installation)

### Build the Program

```bash
anchor build
```

### Deploy the Program

To localnet:

```bash
anchor localnet
```

To devnet:

```bash
anchor deploy --provider.cluster devnet
```

### Run Tests (if implemented)

```bash
anchor test
```

## 📁 Project Structure

```
├── Anchor.toml                      # Anchor configuration file
├── programs/
│   └── hello_world_solana/
│       └── src/lib.rs              # Smart contract source code
├── tests/
│   └── hello_world_solana.ts      # Test file (optional)
└── migrations/                     # Deployment scripts
```

## ✅ TODOs

* [ ] Add test cases in `tests/hello_world_solana.ts`
* [ ] Create a simple web frontend (React + Solana Wallet Adapter)
* [ ] Adjust account space to support dynamic message sizes

## 📚 References

* [Solana Documentation](https://docs.solana.com/)
* [Anchor Book](https://book.anchor-lang.com/)
* [Rust Docs](https://doc.rust-lang.org/)

---

MIT License © 2025