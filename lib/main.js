const contextMenu = require("sdk/context-menu");
const data = require("sdk/self").data;
const clipboard = require("sdk/clipboard");
let prefs = require("sdk/simple-prefs");

// Magnet icon for contex-menu items and widget
let magrentIcon = data.url('img/Magnet.png');

let downloadTorrentItem = contextMenu.Item({
    label: "Download .torrent file",
    image: magrentIcon,
    data: prefs.prefs['torrentSource'],
    context: contextMenu.SelectorContext('a[href^="magnet:?"]'),
    contentScriptFile: [data.url("js/Nibbler.min.js"), data.url("js/escapeHTML.js"), data.url("js/magrent.js"), data.url("js/download-torrent.js")]
});

let sendToPanelItem = contextMenu.Item({
    label: "Open in Magrent panel",
    image: magrentIcon,
    context: contextMenu.SelectorContext('a[href^="magnet:?"]'),
    contentScript: 'self.on("click", function (node, data) {' +
        'self.postMessage(node.href);' +
        '});',
    onMessage: function(magnet) {
        panel.port.emit('convert', magnet);
        panel.show();
    }
});

let panel = require("panel").Panel({
    width: 577,
    height: 165,
    contentURL: data.url('panel.html'),
    contentScriptFile: [data.url("js/jquery.min.js"), data.url("js/Nibbler.min.js"), data.url("js/escapeHTML.js"), data.url("js/magrent.js"), data.url("js/panel.js")]
});

// Put focus into text input when panel is shown
panel.on('show', function() {
    this.port.emit('focus');
});

require("widget").Widget({
    id: "magrent",
    label: "Magrent",
    contentURL: magrentIcon,
    onClick: function() {
        let clipboardContent = clipboard.get();
        let hashPattern = /xt=urn:btih:(?:[a-f0-9]{40}|[a-z2-7]{32})/i;
        // If the clipboard content is a magnet URI, converts it automatically
        if(/^magnet:\?/.test(clipboardContent) && hashPattern.test(clipboardContent))
            panel.port.emit('convert', clipboardContent);
        panel.show();
    }
});

prefs.on('torrentSource', function(prefName) {
    downloadTorrentItem.data = prefs.prefs['torrentSource'];
});