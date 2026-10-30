# POM PASSAGE — A little shape goes a long way.

An original English HTML5 shape-changing delivery game. Stretch or squash Pom, compare the silhouette with a doorway, then send the little letter courier through. A bad fit rebounds gently and offers a direction cue. There are no lives, mandatory timer, purchases, accounts or ads.

## Play

Drag upward on the scene to stretch, downward to squash, or use the Flat → Tall slider. Body area stays constant: a taller shape is narrower. The faint doorway projection previews your actual shape, not an automatically supplied answer. Send Pom starts one journey. The current body ellipse must fit every visible aperture; a mismatch returns Pom to the platform without losing a letter. Feet and hands tuck before contact.

Keyboard: Left/Down squashes, Right/Up stretches, Space sends, P/Escape pauses. The native slider also supports its normal arrow keys. There is no input during the short send/rebound animation. Cancelling a pointer retains the last chosen shape and does not launch a delivery. Blur, hidden tabs and resize pause play and silence synthesized audio. Resume is explicit.

Nine fixed routes contain twenty-seven authored aperture configurations in three coordinated illustrated districts. The first three routes have arch windows; routes four to six introduce oval and diamond openings. The final three combine two aperture constraints, requiring one shape to fit both. These are a compact finite campaign using the same core action, not infinitely many unique worlds or a commercial-game port.

Each route awards a star for delivery, another for two bumps or fewer, and another for three perfect fits. A perfect fit is near the authored ideal proportion; the ordinary pass interval is wider. Best records are retained, never reduced or duplicated by replays. Mint paper unlocks at six stars and Lilac at eighteen. The travel book reopens completed routes and records their original stamp motifs. Cosmetic paper changes do not change collision rules.

## Saving and compatibility

Browser-local `pom-passage-v1` stores current route, chosen shape, delivered letters, perfect fits, bumps, pending journey time, best stamps and settings. Interrupted journeys are reconstructed with the same decision and animation phase, opening paused. Decorative particles and transient toast messages are not restored. Clearing browser data clears progress. Blocked storage permits play without reliable saving.

The game uses Canvas 2D, CSS and generated Web Audio, with no WebGL, external library, downloaded font, network service or image generation. Original drawing code creates the city, courier, props, motifs and animations. Drawing targets forty frames per second with DPR capped at 1.5 and at most eighty decorative particles; logic uses a fixed sixty-Hz step. Gentle Motion reduces ambient movement. Audio begins only after interaction, is bounded to sixteen voices and can be muted. These budgets do not certify every physical handset or sound quality by listening.

The fit model tests an axis-aligned body ellipse against arch, oval and diamond apertures. It is a proportion-fitting puzzle, not a cloth simulation, full rigid-body physics system or a free-roaming three-dimensional city. The animation and cutout clipping visualise those explicit rules.

## Files and rebuilding

Serve this folder over HTTP(S), including GitHub Pages. `index.html` and `standalone.html` inline all game code and CSS. The optional favicon is local. `index-source.html`, `style.css`, `model.js`, `art.js` and `game.js` are editable source. Run `node test-model.cjs`, then `python build.py` to produce playable files, a SHA256 manifest and the deterministic ZIP. File-URL handling varies by browser; HTTP(S) is recommended.

The model tests ordinary campaigns, geometry against an independent point-sampled ellipse oracle, recoverable bumps, busy/terminal input, best-only rewards, save guards and interrupted-flight continuation. Native browser play, responsive layout, screenshot review and public-file verification are separate checks. No platform rating or commercial-review outcome is guaranteed.

## References and scope

Gameplay selection inspected the Rezona catalogue and excluded already-produced batting, downhill skiing, fossil cleaning, football, coin pushing, rope cutting and rotating gravity rooms. [Narrow Man](https://rezona.ai/game/pgcserver/pv/yAUFAFyG/v1/dist/index.html) was actually opened. Its first-person cave, squeeze instruction and native forward movement were observed; no completed cave or successful narrow-passage traversal is claimed. The readable idea of changing one's silhouette to pass a gap informs this independently written, smaller, frontal shape-delivery game. No Rezona source, model, sound, screenshot or interface is included.

Art direction comes from the user's [flat-colour architectural atlas](https://mygamesartstyle.jupiterthewarlock.com/styles/flat-vector/). The enlarged first Chants of Sennaar architectural screenshot was actually viewed for warm/cool colour blocks, terraced architectural rhythm, narrow seams, clean silhouettes and restrained texture. Pom, the three postal districts, door shapes, stamps and complete interface are original. No commercial character, logo, full scene, screenshot or game asset is copied.

The imported Awesome Open Source Games reference skill was consulted. Its Shape Experiment entry concerns a shape-recognition reflex game and is not imported as this game's controller. All runtime game code and art here are original, rather than a claimed adaptation of an entire open-source game. The web, mobile, game-art and game-design skills informed implementation and verification. Original code and code-drawn art are MIT licensed; see `LICENSE.txt`.
