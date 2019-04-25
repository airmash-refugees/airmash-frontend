
# airmash-frontend

This repository contains the last available copy of the Airmash frontend app,
as extracted from archive.org, with a bunch of edits intended to make things
more readable and maintainable:

- Tidied HTML (HTML tidy, introduced a bunch of bugs, was kindof a mistake)
- Identified all the third party JS library versions in use and replaced them
  with canonical upstream releases, except for pixi.js which appears to have
  some kind of patches applied. Using official pixi.js breaks the HUD
  rendering.
- Carved up all the original JS into files living under ``js/``. Each file
  represents what appears to be one of the original source modules.
- Reindented all the JS, and applied some highly selective use of
  ``jsnice.org`` to improve readability of some functions, particularly in
  graphics. The Git log details each use individually.
- Modified the connection code to not rely on airma.sh DNS layout. Instead
  it takes the websocket URL directly from `games` JSON file, which currently
  points at Steamroller's US dev server. These edits appear individually in the
  Git log, and have been tagged with ``// DERPS`` in the JS.
- Hidden the login/logout links since there is no longer any backend to handle
  them


### This repository contains proprietary code

The original Airmash game was never published as free software, and so the
8,000 lines of non-library JS are covered by copyright. The copyright owner
appears disinterested in updating Airmash, but that does not mean their rights
have disappeared. Don't copy code you find here into projects you care about!

The existence of this repository is not even a grey area -- it's directly
infringing. But it seems such infringement is the only option we have left to
keep the game alive.

Pristine copies of the original assets are available under the
[archive.org-original](https://github.com/derps-airmash/airmash-frontend/tree/archive.org-original)
tag.

### Patches welcome

One reason I love Airmash so much is because it was such a beautiful piece of
code. They managed to fit a compelling multiplayer action game in a web
browser, that's really a work of art. I'd love to preserve that art as much as
possible, but it's also important for the remaining Airmash players to work
together to preserve what remains of the game.

So with that said, please assume quite a permissive policy with regard to what
can be merged into this repository, and please understand this repository
belongs to everyone.
