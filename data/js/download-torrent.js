self.on('click', function (node, data) {
    let torrent = magrent(node.href);
    if (torrent) {
        self.postMessage({
            name: (torrent.filename ? decodeURIComponent(torrent.filename) : torrent.hash) + '.torrent',
            url: 'http://' + data + '/torrent/' + torrent.hash + '.torrent'
        });
    }
});