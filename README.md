# `@wizardsoftheweb/opensimplex-noise`

[![Build Status](https://travis-ci.org/wizardsoftheweb/opensimplex-noise.svg?branch=dev)](https://travis-ci.org/wizardsoftheweb/opensimplex-noise) [![Coverage Status](https://coveralls.io/repos/github/wizardsoftheweb/opensimplex-noise/badge.svg?branch=dev)](https://coveralls.io/github/wizardsoftheweb/opensimplex-noise?branch=dev)

This is a fairly straight-forward implementation of Kurt Spencer's [OpenSimplex Noise](http://uniblock.tumblr.com/post/97868843242/noise) (original [Java implementation](https://gist.github.com/KdotJPG/b1270127455a94ac5d19)). I started this project intending to build a simplex noise generator but then I remembered that Ken Perlin is a patent troll.

<!-- toc -->
- [Important Notes](#important-notes)
- [Installation](#installation)
  * [Dev version](#dev-version)
- [Usage](#usage)
- [Benchmarks](#benchmarks)
- [Motivation](#motivation)
- [Roadmap](#roadmap)
  * [Main Features](#main-features)
  * [Eventual features](#eventual-features)
<!-- tocstop -->

## Important Notes

* **The root LCG might require a license.** I did a bunch of research about this. Given that OpenSimplex actually had to be created, I think it's important to maintain provenance. The constants used in OpenSimplex's [linear congruential generator](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L58) come from [Donald Knuth's MMIX implementation](https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use) (although [searching "6364136223846793005l"](https://www.google.com/search?q=6364136223846793005l) yields Minecraft code and threads about OpenSimplex; the `long` suffix dramatically reduces the results). Given that it's on Wikipedia (and in Minecraft), I'm going to assume the numbers themselves are not licensed. If you're not comfortable making that assumption, I'll (eventually) add support to change the LCG (or you can make a PR with open source constants, which would be pretty neat).
* External libraries possibly necessary. JavaScript doesn't handle 64-bit integers natively. I might look at 32-bit generator later. I've got [`Bluebird`](https://www.npmjs.com/package/bluebird) in the production dependencies for now because I'd like to include `Bluebird` ([`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) with [`.finally`](http://bluebirdjs.com/docs/api/finally.html) and sequential execution via [`.each`](http://bluebirdjs.com/docs/api/each.html)) support eventually, but I might also strip it. We'll see.

## Installation

### Dev version
This is just until it's published.

```
npm install --save git+https://github.com/wizardsoftheweb/opensimplex-noise
```

## Usage

TODO: write documentation after the API is done

If you're desparate (as in "completely desparate and have absolutely no other option because your life depends on generating the docs for this repo you found on the internet"), you can build them via `npm`:
```bash
npm run build:docs
```
Chances are it's not going to work as intended. TypeDoc's got [an issue](https://github.com/TypeStrong/typedoc/pull/587) with configuration and I lost all motivation to fix this repo's config after figuring out the bug upstream.

## Benchmarks

I've tried to pull out specific sections of [the original](docs/OpenSimplexNoise.java) to compare against the TypeScript versions, in part to see where the TypeScript might need improvement.

```bash
npm run benchmark
```

* The benchmarks require Java, i.e.
    ```bash
    which javac
    # some non-empty path
    which java
    # some non-empty path
    ```
    For testing, I've been using `openjdk-8-jdk` on `Ubuntu 16.04.2 LTS` via `Windows 10 Pro`. I will eventually move this out of my gaming environment and into my work environment so that I can run real comparisons, but that's far enough in the future I'm not even including it in the roadmap. Yet.
* Benchmarks are slightly silly. Your benchmark is going to be different than mine. Don't use the results as objective proof of superiority, because they're not. I'm an average coder writing in a transpiled interpreted language not built to handle `long`s natively, so you should expect the Java version to run better. However, Java is an interpreted language, so this code could be occasionally faster.
* For the most part, the TypeScript hasn't been optimized. I have no doubt there's a ton of inefficient code slowing things down.
* I tried to make things one-to-one. For example, while comparing the LCG initialization, I run [this TypeScript](benchmarks/benchmarks.ts#L34):

    ```javascript
    const lcgSequence = new SequenceFromLcg64(0);
    for (let index = 0; index < PermutationArray.NUMBER_OF_LCG_INIT_STEPS; index++) {
        lcgSequence.step();
    }
    ```

    against [this Java](benchmarks/java/LcgInitialization.java#L5):

    ```java
    long seed = 0L;
    seed = seed * 6364136223846793005l + 1442695040888963407l;
    seed = seed * 6364136223846793005l + 1442695040888963407l;
    seed = seed * 6364136223846793005l + 1442695040888963407l;
    ```
    In general, I usually gave Java the benefit of the doubt when it came to slimming the code down.

## Motivation

I wanted to build this myself before using libraries to get a better understanding of the process. I have several applications that require a solid `n`-dimensional noise generator. [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) provides smoother, more controllable noise than, say, [diamond-square](https://en.wikipedia.org/wiki/Diamond-square_algorithm), and has the added benefit of sounding really pretentious. It's also anecdotally the gold standard and mathematically pretty neat.

However, simplex noise is under a pretty nasty patent. Like, really nasty. I don't support patenting algorithms. If the history of math has taught us anything, it's that someone smarter will come along and redo your work except better. For that reason, I decided to play with [OpenSimplex Noise](http://uniblock.tumblr.com/post/97868843242/noise), which does basically the same thing using a slightly different set of tools. It's slower, so I'll eventually add some benchmarks to illustrate that.

I highly doubt this will see much production beyond a couple of hobby projects. I'm building it primarily to be able to debug other implementations when I break them.

## Roadmap

These percentages are pretty arbitrary. Today's 47% could be tomorrow's 90% or vice versa.

### Main Features

Once all of these are finished, I'll release `v1`. Until then, `v0` should be used with caution, because it's not stable.

| Progess | Feature |
| ------: | ------- |
|      2% | Port `OpenSimplexNoise.java` |
|     10% | Break down `OpenSimplexNoise.java` into constituent tasks |
|    100% | Build and document an implementation of the LCG used in `OpenSimplexNoise.java` |
|    100% | Duplicate the LCG's output (and `long` manipulation) |
|    100% | Duplicate the `[0, 255]` permutation for 2D, 3D, and 4D |
|     20% | Benchmarks against Java version |
|      0% | Publish package on `npm` |
|      0% | Switch defaults (branch, badges) from `master` to `dev` |
|     80% | Add fancy `README` TOC |

### Eventual features

These are things I'd like to add, but probably won't be included in `v1`. If not, they'll most likely constitute one or more minor version increments.

| Progess | Feature |
| ------: | ------- |
|      0% | Find FOSS linear congruential generator parameters. |
|      0% | Break out LCG code into its own repo |
|      0% | Implement [reverse LCG](https://stackoverflow.com/a/16630535) |
|      0% | Tests against the original Java |
|      0% | Determine `Bluebird` usage or move it to `devDependencies` |
|      0% | Fix [TypeDoc config](https://github.com/TypeStrong/typedoc/pull/587) |
