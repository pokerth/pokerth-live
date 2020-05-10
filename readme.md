# PokerTH live

PokerTH live - Spectator tool

April note (for live.pokerth.net):
*Login as Guest (username/password disabled)
*Logins do work only on the Main FR Server

## Installation

You need [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) in order to clone and build the project.

Use git clone from Master branch.

```bash
git clone https://github.com/pokerth/pokerth-live.git
```

Then switch to the 001-webpack-html branch.

```bash
git checkout 001-webpack-html
```

Now install neccesary dependencies.

```bash
npm install
```

Time to compile pokerTH live.
```bash
npm run prod
```

## Configuration

Change the websocket ip:port in "pokerth-live/inc/net/neteventhandler.js" file.

*Take html of http://live.pokerth.net/ as example how to init the spec tool.

## License
GNU Affero General Public License