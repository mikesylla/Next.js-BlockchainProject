---
title: "Setting Up Scaffold-Stark for Rapid Development"
date: "2025-01-13"
author: "Mike Sylla"
difficulty: "beginner"
estimatedTime: "30 minutes"
blockchain: ["StarkNet"]
tags: ["scaffold-stark", "starknet", "development", "setup"]
prerequisites: ["Node.js installed", "Basic command line knowledge"]
github: "https://github.com/mikesylla/scaffold-stark-tutorial"
excerpt: "Get up and running with Scaffold-Stark, the fastest way to build StarkNet applications."
---

# Setting Up Scaffold-Stark for Rapid Development

Scaffold-Stark is a powerful framework for building StarkNet applications quickly and efficiently.

## Installation

```bash
npx create-scaffold-stark my-dapp
cd my-dapp
npm install
```

## Project Structure

```
my-dapp/
├── contracts/
├── frontend/
├── scripts/
└── tests/
```

## Your First Contract

Let's create a simple counter contract:

```cairo
#[starknet::contract]
mod Counter {
    #[storage]
    struct Storage {
        counter: u256,
    }
    
    #[external(v0)]
    fn increment(ref self: ContractState) {
        self.counter.write(self.counter.read() + 1);
    }
    
    #[external(v0)]
    fn get_counter(self: @ContractState) -> u256 {
        self.counter.read()
    }
}
```

## Running Your App

```bash
npm run dev
```

Your StarkNet dApp is now running locally!