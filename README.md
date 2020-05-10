# PokerTH live

PokerTH live - Spectator tool

April note (for live.pokerth.net):  
*Login as Guest (username/password disabled)  
*Logins only work on Main FR Server

## Installation

You need [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) in order to clone and build the project.

Use git clone from Master branch.

```bash
git clone https://github.com/pokerth/pokerth-live.git
```

Then switch to the 001-webpack-html5 branch.

```bash
git checkout 001-webpack-html5
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

*Inspect html code at http://live.pokerth.net/ to know the websocket ip:port used

## License
GNU Affero General Public License
