self.on("click", function (node, data) {
    let torrent = magrent(node.href);
    if(torrent)
        window.open('http://' + escapeHTML(data) + '/torrent/' + escapeHTML(torrent.hash) + '.torrent');
});