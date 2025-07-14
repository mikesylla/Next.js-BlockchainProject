---
title: 'Getting Started with Cairo Programming'
date: '2025-01-15'
author: 'BlockchainDev'
tags: ['Cairo', 'StarkNet', 'Beginner', 'Tutorial']
image: '/images/posts/cairo-tutorial.jpg'
excerpt: 'Learn the fundamentals of Cairo and build your first StarkNet contract'
blockchain: ['StarkNet', 'Cairo']
difficulty: 'beginner'
github: 'https://github.com/yourusername/cairo-tutorial'
---

# Getting Started with Cairo Programming

Cairo is a programming language for writing provable programs, where one party can prove to another that a certain computation was executed correctly. It's the native language for StarkNet smart contracts.

## What is Cairo?

Cairo stands for **CPU Algebraic Intermediate Representation**. It's designed to prove the integrity of computations, making it perfect for:

- StarkNet smart contracts
- Zero-knowledge proofs
- Scalable blockchain applications

## Setting Up Your Development Environment

First, let's install Cairo:

```bash
# Install Cairo
curl -L https://github.com/starkware-libs/cairo/releases/download/v2.4.0/cairo-lang-2.4.0-x86_64-unknown-linux-musl.tar.gz | tar -xz
sudo mv cairo-lang-2.4.0-x86_64-unknown-linux-musl/bin/* /usr/local/bin/
```

## Your First Cairo Contract

Here's a simple Cairo contract that stores and retrieves a value:

```cairo
#[starknet::contract]
mod SimpleStorage {
    #[storage]
    struct Storage {
        stored_data: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_value: u256) {
        self.stored_data.write(initial_value);
    }

    #[external(v0)]
    fn set(ref self: ContractState, value: u256) {
        self.stored_data.write(value);
    }

    #[external(v0)]
    fn get(self: @ContractState) -> u256 {
        self.stored_data.read()
    }
}
```

## Key Concepts

### Felt252
Cairo's fundamental data type is `felt252` - a field element:

```cairo
fn main() -> felt252 {
    let x: felt252 = 10;
    let y: felt252 = 20;
    x + y
}
```

### Arrays and Memory
Working with arrays in Cairo:

```cairo
use array::ArrayTrait;

fn array_example() -> Array<felt252> {
    let mut arr = ArrayTrait::new();
    arr.append(1);
    arr.append(2);
    arr.append(3);
    arr
}
```

## Next Steps

1. Practice with simple contracts
2. Learn about StarkNet's architecture
3. Explore advanced Cairo features
4. Deploy to StarkNet testnet

Cairo opens up a world of possibilities for scalable, provable computation. Start small and gradually build more complex applications!
