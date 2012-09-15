self.on("click", function (node, data) {
    let torrent = magrent(node.href);
    if(torrent)
        window.open('http://torrage.com/torrent/' + torrent.hash + '.torrent');
});
