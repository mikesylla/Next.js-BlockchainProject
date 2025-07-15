---
title: "Cairo Programming Fundamentals"
date: "2025-01-14"
author: "Mike Sylla"
difficulty: "intermediate"
estimatedTime: "1 hour"
blockchain: ["StarkNet"]
tags: ["cairo", "starknet", "zero-knowledge", "intermediate"]
prerequisites: ["Basic programming knowledge", "Understanding of blockchain", "Familiarity with Rust or Python"]
github: "https://github.com/mikesylla/cairo-tutorial"
excerpt: "Master the fundamentals of Cairo programming for StarkNet development and zero-knowledge applications."
---

# Cairo Programming Fundamentals

Cairo is a programming language for creating provable programs. Let's explore its unique features and syntax.

## What Makes Cairo Special

- **Zero-Knowledge Proofs**: Generate proofs of computation
- **Scalability**: Efficient execution on StarkNet
- **Safety**: Strong type system and memory safety

## Basic Syntax

```cairo
%builtins output

from starkware.cairo.common.serialize import serialize_word

func main{output_ptr : felt*}():
    serialize_word(1234)
    return ()
end
```

## Working with Felt

The fundamental data type in Cairo is `felt` (field element):

```cairo
func calculate_sum(a : felt, b : felt) -> (result : felt):
    return (a + b)
end
```

## Next Steps

Continue with our advanced Cairo tutorial to build your first StarkNet contract.