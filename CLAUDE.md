# albina-website

## Node version

Node is pinned to **22.22.0** via `.nvmrc`. Source nvm and select it **once per
session** before build/test, then run commands directly:

```bash
. "$NVM_DIR/nvm.sh" && nvm use   # reads .nvmrc → 22.22.0
```

Don't repeat the full `export NVM_DIR=…; . nvm.sh; nvm use 22.22.0` prelude on
every command — the selected version persists for the shell session.

## Shell commands

The working directory persists between calls; don't prefix commands with
`cd …/albina-website && …`.
