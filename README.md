# warzone-bot
Discord Bot for fetching CoD MW/WZ Stats

## Installation
Using current LTS 14.15.1. Install [nvm](https://github.com/nvm-sh/nvm) for Mac/Ubuntu, use WSL Ubuntu if on Windows

macOS/Ubuntu:
```
$ nvm use
```

### To run bot locally
```
  npm start
```

### To watch bot
```
  npm run pm2:dev
```

## Commiting
Project uses `commitizen` and an emoji adapter to generate commits and keep a consistent commit style. After `npm i` you can commit anything added to your local staged changes by running `npm run cm` and following along the interactive prompt.
## Description
Repository defines two main processes called index.js (bot) and background process schedule.js (schedule).
File structure is folder-by-type and contains 5 sub packages
- config
- core
- commands
- events
- jobs

**The purposes of the subpackages are as follows.**
- `config` exports an object that defines discord-specific configuration values
- `core` exports business logic functions of the MW/WZ API
- `commands` follows a category/name scheme and each member exports a discord command object
- `events` every member exports a discord event object to be consumed by the bot process
- `jobs` every member export a job object to be consumed by the schedule background process
