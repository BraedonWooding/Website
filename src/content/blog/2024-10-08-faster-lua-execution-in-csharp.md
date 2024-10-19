---
title: Faster Lua Execution in C# Part 1. Overview
subTitle: Rewriting MoonSharp
publishDate: 2024-10-08
author: Braedon Wooding
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
slug: faster-lua-execution
draft: true
---

I've been working on a puzzle game for a few months and in classic programming style ended up getting distracted completely!  It started when I looked into a solution to allow me to design puzzles without needing to restart the engine (and to potentially allow custom user designed levels) this resulted in me visting embedded languages and Lua.

I've had previous experience in this region and in particular have used [MoonSharp](https://www.moonsharp.org/) which is actually a complete rewrite of Lua *in C#* rather than just a proxy/p-invoke wrapper.

The reasoning behind this is that it makes integration with your language a lot simpler in particular;
- A singular GC (rather than having both the CLR & Lua's GCs running in parallel)
- Unified types (no need to wrangle/cast types between Lua & C#)
- Faster / simpler integration code (i.e. it's easier to call from Lua into C# and vice-versa and concepts like iterators are unified)

But the downside (apparently) is that performance is worse!  This has always been pretty surprising to me because it doesn't really pass the smell test.  For example, the [Benchmarks Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/box-plot-summary-charts.html) pretty regularly shows C# within 30% of C/C++ and at worst it's 3x slower.  But MoonSharp is regularly 3-7x slower than a C implementation and in some extreme cases is upwards of 300x slower.  You can see benchmarks of the different lua versions [here](https://braedonwooding.github.io/solarsharp/dev/bench/).

# Overview of core performance issues

Sadly there are a lot of issues with MoonSharp's implementation of Lua, with some of them being core to it's architecture, this resulted in a pretty gigantic undertaking (and many weeks of work) which was originally unexpected.

For this reason I'm going to split this article into a few parts;

- (this part) Part 1. Will cover the overview
- [Part 2. Lua Tables](/blog/optimizing-lua-tables)
- Part 3. DynValues (LuaValues) the core value type & Closures
- Part 4. Instruction Formats & OpCodes/Interpreter Execution Loops
- Part 5. Future, we have some awesome performance improvements here too.

## Brief Aside

Before I go into the details here, I want to point out something very important.  While some of these decisions seem quite questionable I'm not here to judge, software engineering works best in a blameless culture; software is meant to change and be improved!  A lot of these decisions likely made development quicker, and that is a valuable tradeoff.

## Hypothesis

It's nice to start with a hypothesis to compare to once all is said is done.

From early investigations, I'm expecting us to be able to get our performance within 30% of NLua/Kera/Neo on *most* benchmarks.

## Performance Issues DynValue

The issue is that the core data type in MoonSharp; DynValue is a reference type (class) and is quite large at 32 bytes.  In particular it consists of the following structure;

```csharp
// 4 bytes
int m_RefId;
// 4 bytes
int m_HashCode;
// 1 byte
bool m_ReadOnly;
// 8 bytes
double m_Number;
// 8 bytes
object m_Object;
// Enum (4 bytes)
DataType m_Type;
```

Overall, this results (presuming re-ordering to get perfect packing) a structure of 29 bytes, this will be rounded up to 32 bytes (to achieve 8 byte alignment).

This means that straight up you have 2x the memory requirements of Lua.  This doesn't include the overhead from an object nor the fact that any table will not be able to store the values inline meaning tables require an extra 8 bytes per value.  This also hurts the cache since it means that an array of numbers are likely to be spread out over the memory space (cache locality).

Changing this however, requires severe architectural changes because; UpValues in MoonSharp rely on DynValues being reference types.

This ultimately meant that any changes to them would require sweeping changes to closures.

I was able to reduce the size of DynValues (now named LuaValues) to just 16 bytes, which is the minimum they can be because you can't overlap un-managed (doubles) & managed (objects) in unions in C#.

## Lua Tables

Lua Tables in MoonSharp are designed quite weirdly they are all linked lists!  They have 3 separate linked lists; one for arrays, one for strings, one for non-strings (DynValues).

> The string collection was potentially to get around the issues due to DynValue performance.

Linked lists are just naturally bad for performance in particular for an array segment of a Lua Table.  As an example, the benchmark table_array_insert_indexed takes almost 600,000 ms to run in MoonSharp which is a factor of 290x over Lua wrappers (which just take 2s), by just changing the Table implementation this dropped to only 5s which is a factor of around 2.5x.

```lua
-- table_array_insert_indexed.lua
local t = {}

for i=1,10000,1 do
    table.insert(t, i)
end
```

There are similar performance issues in most array benchmarks.  This was a nice motivator early on since improving performance by around 116x is awesome!

Check out the specific article on [Lua Tables](/blog/optimizing-lua-tables) for more!

> Also talk about tombstones

## Performance Issue 1. GC

This is a really hard one to measure and the lua benchmarks don't really do this justice.

> TODO: Add a new benchmark that covers this.

DynValues being used *everywhere* results in lots of garbage being created.  This is problematic for games where ideally you want the core game loops to almost never allocate.

# Reflection

This project blew way out of original goals and ended up being a significantly larger time sink then I originally intended.

While I'm happy with the final results.  I think there is some good reflection on this.

1. DynValue migration was too heavy and too ingrained, just doing the table & instruction changes are much more scoped and wouldn't have required so much work.  Getting within 2-3x of Lua is perfectly fine for my usecases and the GC impact of dynvalues could be reduced by just adding a pool of DynValues to reduce allocation load.
2. Just because code is long living does not make it performant, there are some easy low hanging fruit here (tables for example) that could have been implemented.
3. Getting the benchmarking suite setup early was a great move and it enabled me to verify that changes have an impact on performance.
