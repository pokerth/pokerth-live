let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.babel([
  'inc/license_prefix.js',
  'inc/game_defs.js',
  'inc/third_party/protobuf.js',
  'inc/third_party/jquery.timers-1.1.2.js',
  'inc/third_party/base64.js',
  'inc/config/configstorage.js',
  'inc/audio/soundplayer.js',
  'inc/audio/soundevents.js',
  'inc/net/scram_sha1.js',
  'inc/net/protocol.js',
  'inc/net/engine/nethelper.js',
  'inc/net/engine/nethand.js',
  'inc/net/engine/netgame.js',
  'inc/net/netcache.js',
  'inc/gui/gui_helper.js',
  'inc/gui/gametable/cards.js',
  'inc/gui/gametable/buttons.js',
  'inc/gui/gametable/gametable.js',
  'inc/gui/lobby/lobby_gamelist.js',
  'inc/gui/lobby/lobby_chat.js',
  'inc/gui/lobby/lobby_playerlist.js',
  'inc/gui/lobby/lobby.js',
  'inc/gui/login-dialog/login-dialog.js',
  'inc/gui/gui.js',
  'inc/net/neteventhandler.js'], 'inc/pokerth-live_min.js');
  mix.sass('styles/styles.scss', 'styles/styles.css')
    .options({
      processCssUrls: false
    });

