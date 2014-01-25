const contextMenu = require('sdk/context-menu');
const addon = require('sdk/self');
const clipboard = require('sdk/clipboard');
const prefs = require('sdk/simple-prefs');
const { Panel } = require('sdk/panel');
const { Widget } = require('sdk/widget');
const { Request } = require('sdk/request');
const { notify } = require("sdk/notifications");
const { download } = require('downloads');

const capitalize = str => str[0].toUpperCase() + str.slice(1);

const downloadTorrent = data => {
    // Check if torrent exists
    Request({
        url: data.url,
        onComplete: function (response) {
            if (response.status === 200) {
                download(data);
            }
            else if (response.status === 404) {
                notify({
                    title: capitalize(addon.name),
                    text: 'Torrent not found'
                });
            }
            else {
                notify({
                    title: capitalize(addon.name),
                    text: 'HTTP status code: ' + response.status
                });
            }
        }
    }).head();
};

// Magnet icon for contex-menu items and widget
let magrentIcon = addon.data.url('img/Magnet.png');

let downloadTorrentItem = contextMenu.Item({
    label: 'Download torrent file',
    image: magrentIcon,
    data: prefs.prefs['torrentSource'],
    context: contextMenu.SelectorContext('a[href^="magnet:?"]'),
    contentScriptFile: [addon.data.url('js/Nibbler.min.js'),
                        addon.data.url('js/escapeHTML.js'),
                        addon.data.url('js/magrent.js'),
                        addon.data.url('js/download-torrent.js')],
    onMessage: downloadTorrent
});

let sendToPanelItem = contextMenu.Item({
    label: 'Open in Magrent panel',
    image: magrentIcon,
    context: contextMenu.SelectorContext('a[href^="magnet:?"]'),
    contentScript: 'self.on("click", function (node, data) {' +
        'self.postMessage(node.href);' +
        '});',
    onMessage: magnet => {
        panel.port.emit('convert', magnet);
        panel.show();
    }
});

let panel = Panel({
    width: 577,
    height: 140,
    contentURL: addon.data.url('panel.html'),
    contentScriptFile: [addon.data.url('js/Nibbler.min.js'),
                        addon.data.url('js/escapeHTML.js'),
                        addon.data.url('js/magrent.js'),
                        addon.data.url('js/panel.js')]
});

// Put focus into text input when panel is shown
panel.on('show', function () {
    this.port.emit('focus');
});

panel.port.on('downloadTorrent', downloadTorrent);

Widget({
    id: 'magrent',
    label: 'Magrent',
    contentURL: magrentIcon,
    onClick: () => {
        const clipboardContent = clipboard.get();
        let hash;
        if (/^magnet:\?/i.test(clipboardContent)) {
            const magnetPattern = /xt=urn:btih:([a-z0-9]+)/i;
            const hashMatch = magnetPattern.exec(clipboardContent);
            if (hashMatch)
                hash = hashMatch[1];
        }
        else {
            hash = clipboardContent;
        }

        // If the clipboard content is a magnet URI or hash, convert it automatically
        if ((hash.length === 32 && /[A-Z2-7]{32}/.test(hash)) ||
            (hash.length === 40 && /[A-F0-9]{40}/.test(hash))) {
                panel.port.emit('convert', clipboardContent);
        }

        panel.show();
    }
});

prefs.on('torrentSource', prefName =>
         downloadTorrentItem.data = prefs.prefs['torrentSource']
        );