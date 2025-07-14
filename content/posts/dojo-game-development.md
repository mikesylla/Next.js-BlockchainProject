---
title: 'Creating Your First Dojo Game'
date: '2025-01-10'
author: 'BlockchainDev'
tags: ['Dojo', 'Gaming', 'Onchain', 'Intermediate']
image: '/images/posts/dojo-game.jpg'
excerpt: 'Develop an onchain game using the Dojo framework with real-time state management'
blockchain: ['StarkNet', 'Dojo']
difficulty: 'intermediate'
github: 'https://github.com/yourusername/dojo-battle-game'
---

# Creating Your First Dojo Game

Dojo is a revolutionary framework for building onchain games. Let's create a simple battle game!

## What is Dojo?

Dojo provides:
- **Entity Component System (ECS)** architecture
- **Real-time state synchronization**
- **Provable game logic**
- **Scalable infrastructure**

## Setting Up Dojo

```bash
# Install Dojo
curl -L https://install.dojoengine.org | bash
dojoup

# Create new project
sozo init battle-game
cd battle-game
```

## Game Architecture

Our battle game will have:

```cairo
// models/player.cairo
#[derive(Model, Copy, Drop, Serde)]
struct Player {
    #[key]
    id: felt252,
    health: u32,
    attack: u32,
    defense: u32,
    level: u32,
}

// models/battle.cairo
#[derive(Model, Copy, Drop, Serde)]
struct Battle {
    #[key]
    id: felt252,
    player1: felt252,
    player2: felt252,
    winner: felt252,
    status: BattleStatus,
}
```

## Game Systems

```cairo
// systems/battle.cairo
#[dojo::contract]
mod battle_system {
    use super::{Player, Battle};

    #[external(v0)]
    fn create_battle(
        world: IWorldDispatcher,
        player1_id: felt252,
        player2_id: felt252
    ) {
        // Create battle logic
        let battle = Battle {
            id: world.uuid(),
            player1: player1_id,
            player2: player2_id,
            winner: 0,
            status: BattleStatus::Active,
        };
        
        set!(world, (battle));
    }

    #[external(v0)]
    fn attack(
        world: IWorldDispatcher,
        battle_id: felt252,
        attacker_id: felt252
    ) {
        // Attack logic with damage calculation
    }
}
```

## Frontend with React

```typescript
import { useDojo } from './hooks/useDojo';

export const BattleGame = () => {
  const { setup } = useDojo();
  
  const attack = async () => {
    await setup.systemCalls.attack(battleId, playerId);
  };

  return (
    <div className="battle-arena">
      <div className="player">
        <h3>Player 1</h3>
        <div>Health: {player1.health}</div>
      </div>
      <button onClick={attack}>Attack!</button>
      <div className="player">
        <h3>Player 2</h3>
        <div>Health: {player2.health}</div>
      </div>
    </div>
  );
};
```

Dojo makes onchain gaming accessible and fun to develop!
