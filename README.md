# PokerTH live

PokerTH live - Spectator tool

April 2020 note (for live.pokerth.net):  
*Login as Guest (username/password disabled)  
*Login only works for Main FR Server

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

*Inspect html code at http://live.pokerth.net/ to know the websocket ip:port used

## License
GNU Affero General Public License
