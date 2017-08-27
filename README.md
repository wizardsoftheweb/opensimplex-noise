# `@wizardsoftheweb/opensimplex-noise`

This is a fairly straight-forward implementation of Kurt Spencer's [OpenSimplex Noise](http://uniblock.tumblr.com/post/97868843242/noise) (original [Java implementation](https://gist.github.com/KdotJPG/b1270127455a94ac5d19)). I started this project intending to build a simplex noise generator but then I remembered that Ken Perlin is a patent troll.

## Motivation

I wanted to build this myself before libraries to get a better understanding of the process. I have several applications that require a solid `n`-dimensional noise generator. [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) provides a smoother, more controllable noise than, say, [diamond-square](https://en.wikipedia.org/wiki/Diamond-square_algorithm), and has the added benefit of sounding really pretentious. It's also anecdotally the gold standard and mathematically pretty neat.

However, simplex noise is under a pretty nasty patent. Like, really nasty. I don't support patenting algorithms. If the history of math has taught us anything, it's that someone smarter will come along and redo your work except better. For that reason, I decided to play with [OpenSimplex Noise](http://uniblock.tumblr.com/post/97868843242/noise), which does basically the same thing using a slightly different set of tools. It's slower, so I'll eventually add some benchmarks to illustrate that.

I highly doubt this will see much production beyond a couple of hobby projects. I'm building it primarily to be able to debug other implementations when I break them. I'm not going to put the time into this library to make it the fastest JS 4D generator, and there's a good chance the conversion from TS to JS will add suboptimal code.
