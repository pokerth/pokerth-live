# PokerTH live

PokerTH live - Spectator tool

## Installation

You need [git](https://git-scm.com/) and [Node.js](https://nodejs.org/) in order to clone and build the project.

Use git clone from Master branch.

```bash
git clone https://github.com/pokerth/pokerth-live.git
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

Change the websocket ip:port in the following file "/inc/net/neteventhandler.js"  

*If you run your own server, check in your server side "~/.pokerth/config.xml" for the corresponding values to edit there.

*If you just want connect to pokerth.net gameserver, inspect html/js code at https://live.pokerth.net/ to know the websocket ip:port used.

## License
GNU Affero General Public License
