---
title: Faster Lua Execution in C# Part 2. Optimizing Lua Tables
subTitle: "Improving execution speed of Lua in C#"
publishDate: null
author: "Braedon Wooding"
description: ""
categories:
    - Performance
    - Compilers
languages:
    - Lua
technologies:
    - SolarSharp
    - MoonSharp
keywords: {}
slug: optimizing-lua-tables
draft: true
---

This series of articles is split into 5 parts.  So feel free to check out the other articles!

- Part 1. Will cover the overview
- (this part) Part 2. Lua Tables
- Part 3. DynValues (LuaValues) the core value type & Closures
- Part 4. Instruction Formats & OpCodes/Interpreter Execution Loops
- Part 5. Future, we have some awesome performance improvements here too.

# Overview of Lua's Table Structure

Lua has a singular data collection/structure, this covers:
- Structs
- Lists/Arrays
- Associative Maps (hashmaps/dictionaries)
- Sets
- Queues
- and more!

It works by containing both a (sparse) array segment and a hashmap segment.  The array segment holds the integer keys, where the hash set segment holds the rest.  The array segment importantly starts from index `1` not `0`.



## Sparse Arrays

> This doesn't really matter for above but is worth pointing out.

Lua doesn't store *all* the integer keys in the array segment, this is because it is a sparse array.  It works by defining the array's length such that at-least 50% of all slots are filled, any items outside of that length (or negative keys) are placed into the hash set segment.

This does mean that inserting or removing items could result in this condition being broken and a ton of allocations/moving being performed.

One of the minor differences in SolarSharp is that we will place `0` in the Sparse Array segment (even though it's outside the bounds of an array and won't be counted as part of it's length).  This is because we actually have our arrays start from `0` (this reduces math operations on index for the only cost of an extra allocation).

### Faster Sparse Arrays

As a "future" improvement that is made ontop of the compiler, we optimize sparse arrays further, this is done by storing the integer keys that are spare in a separate dictionary and separately storing the negative from the positive keys (they are stored in the same collection it's just split into 2 sections).

This enables us to directly just iterate through valid candidates when the array segment is increasing in length.

## Size of a table

A Lua table will take around 56/32 bytes.

> This is my rough calculation based on the source code [here](https://github.com/lua/lua/blob/fd0e1f530d06340f99334b07d74e5133ce073787/lobject.h).

We can also find this by using [`getsize`](https://github.com/siffiejoe/lua-getsize) which will directly tell you the size

```
Lua 5.3.2  Copyright (C) 1994-2015 Lua.org, PUC-Rio
> getsize = require "getsize"
> getsize({})
56	0	0
```

Which matches my rough calculation!

SolarSharp tables have 2 components;
- Array Segment (24 bytes)
- Map Segment (16 )

But it also has some miscellaneous data
- Precomputed length
- Array reference (8 bytes)
- Map reference (8 bytes)