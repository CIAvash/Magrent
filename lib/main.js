/*
 * Copyright (C) 2014, 2015  Siavash Askari Nasr
 *
 * This file is part of Magrent.
 *
 * Magrent is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Magrent is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Magrent.  If not, see <http://www.gnu.org/licenses/>.
 */

const contextMenu = require('sdk/context-menu');
const addon = require('sdk/self');
const clipboard = require('sdk/clipboard');
const prefs = require('sdk/simple-prefs');
const { Panel } = require('sdk/panel');
const { Request } = require('sdk/request');
const { notify } = require("sdk/notifications");
const tabs = require('sdk/tabs');
const { download } = require('downloads');

try {
    var { ActionButton } = require('sdk/ui/button/action');
}
catch (e) {
    var { Widget } = require('sdk/widget');
}

const capitalize = str => str[0].toUpperCase() + str.slice(1);

const downloadTorrent = data => {
    // Check if torrent exists
    Request({
        url: data.url,
        onComplete: response => {
            if (response.status === 200) {
                // Check the content type before downloading
                if (! /text\/html/.test(response.headers['Content-Type']))
                    download(data);
                else
                    tabs.open(data.url);
            }
            else if (response.status === 0 && data.srcName === 'torcache.net') {
                tabs.open(data.url);
            }
            else {
                let msg;

                switch (response.status) {
                case 404:
                    msg = 'Torrent not found';
                    break;
                case 0:
                    msg = 'Problem accessing torrent source';
                    break;
                default:
                    msg = 'HTTP status code: ' + response.status;
                }
                
                notify({
                    title: capitalize(addon.name) + ' - ' + data.srcName,
                    text: msg
                });
            }
        }
    }).head();
};

// Magnet icon for contex-menu items and action button
let magrentIcon = addon.data.url('img/bittorrent.png');

let downloadTorrentFileLabel = 'Download torrent file';

let piratebayURLPattern = /.*thepiratebay\.[^.]*?\/torrent\/\d+(\/.*)?/;

let downloadTorrentItem = contextMenu.Item({
    label: downloadTorrentFileLabel,
    image: magrentIcon,
    data: prefs.prefs['torrentSource'],
    context: contextMenu.SelectorContext('a[href^="magnet:?"]'),
    contentScriptFile: [
        addon.data.url('js/Nibbler.min.js'),
        addon.data.url('js/create-clean-names.js'),
        addon.data.url('js/magrent.js'),
        addon.data.url('js/generate-torrent-url.js'),
        addon.data.url('js/send-download-message.js')
    ],
    contentScript: 'self.on("click", (node, data) => {' +
        'sendDownloadMessage(node.href, data, "magnet");' +
        '});',
    onMessage: downloadTorrent
});

let downloadTorrentUsingHashItem = contextMenu.Item({
    label: downloadTorrentFileLabel,
    image: magrentIcon,
    data: prefs.prefs['torrentSource'],
    context: contextMenu.SelectionContext(),
    contentScriptFile: [
        addon.data.url('js/Nibbler.min.js'),
        addon.data.url('js/create-clean-names.js'),
        addon.data.url('js/magrent.js'),
        addon.data.url('js/hash-selection-context.js'),
        addon.data.url('js/generate-torrent-url.js'),
        addon.data.url('js/send-download-message.js')
    ],
    contentScript: 'self.on("click", (node, data) => {' +
        'sendDownloadMessage(window.getSelection().toString(), data, "magnet");' +
        '});',
    onMessage: downloadTorrent
});

let downloadPiratebayTorrentPageItem = contextMenu.Item({
    label: downloadTorrentFileLabel,
    image: magrentIcon,
    data: 'piratebaytorrents.info',
    context: [
        contextMenu.PageContext(),
        contextMenu.URLContext(piratebayURLPattern)
    ],
    contentScriptFile: [
        addon.data.url('js/create-clean-names.js'),
        addon.data.url('js/piratebay-torrent.js'),
        addon.data.url('js/generate-torrent-url.js'),
        addon.data.url('js/send-download-message.js')
    ],
    contentScript: 'self.on("click", (node, data) => {' +
        'sendDownloadMessage(document.URL, data, "piratebay");' +
        '});',
    onMessage: downloadTorrent
});

let downloadPiratebayTorrentLinkItem = contextMenu.Item({
    label: downloadTorrentFileLabel,
    image: magrentIcon,
    data: 'piratebaytorrents.info',
    context: contextMenu.SelectorContext('a'),
    contentScriptFile: [
        addon.data.url('js/create-clean-names.js'),
        addon.data.url('js/piratebay-torrent.js'),
        addon.data.url('js/generate-torrent-url.js'),
        addon.data.url('js/send-download-message.js'),
        addon.data.url('js/piratebay-torrent-link-context.js')
    ],
    onMessage: downloadTorrent
});

let sendToPanelItem = contextMenu.Item({
    label: 'Open in Magrent panel',
    image: magrentIcon,
    context: contextMenu.SelectorContext('a[href^="magnet:?"]'),
    contentScript: 'self.on("click", (node, data) => self.postMessage(node.href));',
    onMessage: magnet => {
        panel.port.emit('convert', magnet);
        panel.show();
    }
});

let sendHashToPanelItem = contextMenu.Item({
    label: 'Open in Magrent panel',
    image: magrentIcon,
    context: contextMenu.SelectionContext(),
    contentScriptFile: addon.data.url('js/hash-selection-context.js'),
    contentScript: 'self.on("click", (node, data) => {' +
        'self.postMessage(window.getSelection().toString())' +
        '});',
    onMessage: hash => {
        panel.port.emit('convert', hash);
        panel.show();
    }
});

let panel = Panel({
    width: 557,
    height: 125,
    contextMenu: true,
    contentURL: addon.data.url('panel.html'),
    contentScriptFile: [
        addon.data.url('js/Nibbler.min.js'),
        addon.data.url('js/escapeHTML.js'),
        addon.data.url('js/create-clean-names.js'),
        addon.data.url('js/magrent.js'),
        addon.data.url('js/piratebay-torrent.js'),
        addon.data.url('js/generate-torrent-url.js'),
        addon.data.url('js/send-download-message.js'),
        addon.data.url('js/panel.js')
    ]
});

// Put focus into text input when panel is shown
panel.on('show', function () {
    this.port.emit('focus');
});

panel.port.on('downloadTorrent', downloadTorrent);

panel.port.on('openTab', function (url) {
    tabs.open(url);
});

const magrentButtonHandler = () => {
    const clipboardContent = clipboard.get();
    if (clipboardContent) {
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

        // If the clipboard content is a magnet URI, hash or Piratebay URL, convert it automatically
        if (((hash.length === 40 || hash.length === 32) && /\b(?:[A-Z2-7]{32}|[A-F0-9]{40})\b/i.test(hash))
            || piratebayURLPattern.test(clipboardContent))
            panel.port.emit('convert', clipboardContent);
    }

    panel.show();
};

if (typeof ActionButton !== 'undefined') {
    ActionButton({
        id: 'magrent',
        label: 'Magrent',
        icon: magrentIcon,
        onClick: magrentButtonHandler
    });
}
else {
    Widget({
        id: 'magrent',
        label: 'Magrent',
        contentURL: magrentIcon,
        onClick: magrentButtonHandler
    });
}

prefs.on('torrentSource', prefName => downloadTorrentItem.data = prefs.prefs['torrentSource']);