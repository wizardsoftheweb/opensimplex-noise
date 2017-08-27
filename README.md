# `@wizardsoftheweb/opensimplex-noise`

This is a fairly straight-forward implementation of Kurt Spencer's [OpenSimplex Noise](http://uniblock.tumblr.com/post/97868843242/noise) (original [Java implementation](https://gist.github.com/KdotJPG/b1270127455a94ac5d19)). I started this project intending to build a simplex noise generator but then I remembered that Ken Perlin is a patent troll.

## Important Notes

* **The root LCG might require a license.** I did a bunch of research about this. Given that OpenSimplex actually had to created, I think it's important to maintain provenance. The constants used in OpenSimplex's [linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use) come from Donald Knuth's MMIX (although [searching "6364136223846793005l"](https://www.google.com/search?q=6364136223846793005l) yields Minecraft code and threads about OpenSimplex; the `long` suffix dramatically reduces the results). Given that it's on Wikipedia (and in Minecraft), I'm going to assume the numbers themselves are not licensed. If you're not comfortable making that assumption, I'll (eventually) add support to change the LCG (or you can make a PR with open source constants, which would be pretty neat).
* Using a 64-bit LCG requires external libraries. I might look at 32-bit generator later.

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
|    100% | Build and document an implementation of `OpenSimplexNoise.java` |
|      0% | Publish package on `npm` |

### Eventual features

These are things I'd like to add, but probably won't be included in `v1`. If not, they'll most likely constitute one or more minor version increments.

| Progess | Feature |
| ------: | ------- |
|      0% | Find FOSS linear congruential generator parameters. |
|      0% | Benchmarks |
|      0% | Break out LCG code into its own repo |
|      0% | Implement [reverse LCG](https://stackoverflow.com/a/16630535) |
