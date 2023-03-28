
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-browsertab.BrowserTab",
          "file": "plugins/cordova-plugin-browsertab/www/browsertab.js",
          "pluginId": "cordova-plugin-browsertab",
        "clobbers": [
          "cordova.plugins.browsertab"
        ]
        },
      {
          "id": "ionic-plugin-deeplinks.deeplink",
          "file": "plugins/ionic-plugin-deeplinks/www/deeplink.js",
          "pluginId": "ionic-plugin-deeplinks",
        "clobbers": [
          "IonicDeeplink"
        ],
        "runs": true
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-browsertab": "0.2.0",
      "ionic-plugin-deeplinks": "1.0.20"
    };
    // BOTTOM OF METADATA
    });
    