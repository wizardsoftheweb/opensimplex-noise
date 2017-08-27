# `@wizardsoftheweb/simplex-noise`

This is yet another [simplex implementation](http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf). It's a TypeScript port of the [Java implementation](http://staffwww.itn.liu.se/~stegu/simplexnoise/SimplexNoise.java) by Stefan Gustavson and Peter Eastman. Both the linked files are preserved for posterity in the `docs` directory on the off chance that their original host goes offline. All due credit goes to Stefan Gustavson.

If you're looking for a library to use in your codebase, I'd recommend [`simplex-noise`](https://www.npmjs.com/package/simplex-noise) because it appears to have been designed with performance in mind.

## Motivation

I wanted to build this myself before libraries to get a better understanding of the process. I have several applications that require a solid `n`-dimensional noise generator. [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) provides a smoother, more controllable noise than, say, [diamond-square](https://en.wikipedia.org/wiki/Diamond-square_algorithm), and has the added benefit of sounding really pretentious. It's also anecdotally the gold standard and mathematically pretty neat.

I highly doubt this will see much production beyond a couple of hobby projects. I'm building it primarily to be able to debug other implementations when I break them. I'm not going to put the time into this library to make it the fastest JS 4D generator, and there's a good chance the conversion from TS to JS will add suboptimal code.
