---
title: "Getting Started with Cairo Programming"
date: "2025-01-10"
author: "Mike Sylla"
tags: ["cairo", "starknet", "programming", "tutorial"]
difficulty: "beginner"
blockchain: ["StarkNet"]
github: "https://github.com/mikesylla/cairo-basics"
excerpt: "Your first steps into Cairo programming and StarkNet development."
---

# Getting Started with Cairo Programming

Cairo is a programming language for creating provable programs. Let's explore why it's revolutionary and how to get started.

## What is Cairo?

Cairo is designed for:
- **Provable computation**: Generate proofs that your program executed correctly
- **Scalability**: Enable efficient verification of complex computations
- **Safety**: Strong type system prevents common bugs

## Installation

```bash
curl -L https://github.com/starkware-libs/cairo/releases/latest/download/cairo-lang-installer.sh | bash
```

Add to your PATH:
```bash
export PATH="$HOME/.cairo/bin:$PATH"
```

## Hello, Cairo!

```cairo
use debug::PrintTrait;

fn main() {
    'Hello, Cairo!'.print();
}
```

## Basic Data Types

### Felt
The fundamental type in Cairo:
```cairo
let x: felt252 = 123;
let y = 456_felt252;
```

### Arrays
```cairo
let mut arr = ArrayTrait::new();
arr.append(1);
arr.append(2);
arr.append(3);
```

### Structs
```cairo
#[derive(Copy, Drop)]
struct Point {
    x: u32,
    y: u32,
}

let point = Point { x: 1, y: 2 };
```

## Functions

```cairo
fn add(x: felt252, y: felt252) -> felt252 {
    x + y
}

fn main() {
    let result = add(5, 3);
    result.print();
}
```

## Control Flow

```cairo
fn is_even(n: u32) -> bool {
    if n % 2 == 0 {
        true
    } else {
        false
    }
}
```

## Pattern Matching

```cairo
fn process_option(value: Option<u32>) -> u32 {
    match value {
        Option::Some(x) => x,
        Option::None => 0,
    }
}
```

## Next Steps

Now that you know the basics, you can:
1. Write your first StarkNet contract
2. Learn about Cairo's ownership system
3. Explore advanced features like traits and generics

## Resources

- [Cairo Book](https://book.cairo-lang.org/)
- [StarkNet Documentation](https://docs.starknet.io/)
- [Cairo by Example](https://cairo-by-example.com/)

Welcome to the world of provable computation!