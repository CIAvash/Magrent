self.on("click", function (node, data) {
    let torrent = magrent(node.href, true);
    if (torrent) {
        self.postMessage({
            name: torrent.name ? decodeURIComponent(torrent.name) : '',
            hash: torrent.hash,
            url: 'http://' + data + '/torrent/' + torrent.hash + '.torrent'
        });
    }
});