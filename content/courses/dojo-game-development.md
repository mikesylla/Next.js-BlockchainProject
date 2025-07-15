---
title: "Introduction to Dojo: The Future of Onchain Gaming"
date: "2025-01-11"
author: "Mike Sylla"
tags: ["dojo", "gaming", "starknet", "autonomous-worlds"]
difficulty: "beginner"
blockchain: ["StarkNet"]
github: "https://github.com/mikesylla/dojo-intro"
excerpt: "Discover Dojo, the revolutionary framework for building fully onchain games and autonomous worlds."
---

# Introduction to Dojo: The Future of Onchain Gaming

Dojo is pioneering the next generation of gaming - fully onchain games that create autonomous worlds.

## What is Dojo?

Dojo is a framework for building onchain games where:
- **All game logic runs on the blockchain**
- **Game state is permanently stored**
- **Players truly own their assets**
- **Games can run autonomously**

## Key Concepts

### World
The world is your game's universe - a smart contract that manages all game state.

### Systems
Systems contain your game logic - functions that modify the world state.

### Components
Components are data structures that define what entities can have.

### Entities
Entities are unique identifiers that can have components attached.

## Simple Example

```cairo
#[dojo::contract]
mod actions {
    use dojo_examples::models::{Position, Moves};
    
    fn spawn(world: IWorldDispatcher, player: ContractAddress) {
        set!(world, (
            Moves { player, remaining: 10 },
            Position { player, x: 0, y: 0 }
        ));
    }
    
    fn move(world: IWorldDispatcher, player: ContractAddress, direction: u8) {
        let mut position = get!(world, player, Position);
        let mut moves = get!(world, player, Moves);
        
        moves.remaining -= 1;
        
        match direction {
            0 => position.y -= 1, // North
            1 => position.x += 1, // East
            2 => position.y += 1, // South
            3 => position.x -= 1, // West
            _ => panic!("Invalid direction")
        }
        
        set!(world, (moves, position));
    }
}
```

## Getting Started

```bash
curl -L https://install.dojoengine.org | bash
dojoup
sozo init my-game
```

## Why Onchain Gaming Matters

Traditional games can disappear, but onchain games are permanent. They create new possibilities:
- **Persistent worlds** that outlive their creators
- **Composable games** that can interact with each other
- **Player-owned economies** with real value
- **Transparent mechanics** with no hidden algorithms

## The Future

Dojo is just the beginning. As the ecosystem grows, we'll see:
- Cross-game interoperability
- AI-driven autonomous worlds
- New economic models
- Unprecedented player ownership

Welcome to the future of gaming!