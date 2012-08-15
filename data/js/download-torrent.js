self.on("click", function (node, data) {
    let bitih = magrent(node.href);
    if(bitih)
        window.open('http://torrage.com/torrent/' + bitih + '.torrent');
});
