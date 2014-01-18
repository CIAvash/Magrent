let result = document.getElementById('result');
let form = document.forms['magrent-form'];
let magnetInput = document.getElementById('magnet');
let submitBtn = document.getElementById('submit');

let showResult = output => {
    result.innerHTML = output;
    // result.style.opacity = 1;
    // result.classList.remove('fade-out');
    // result.classList.add('fade-in');
};

form.addEventListener('submit', function(e) {
    // result.style.opacity = 0;
    // result.classList.remove('fade-in');
    // result.classList.add('fade-out');
    let magnet = magnetInput.value;
    let torrent = magrent(magnet, true);
    if (torrent) {
        // List of torrent cache sites
        let torrentSites = ['torrage.com', 'zoink.it', 'torcache.net'];
        let torrentLinks = '';
        // Building torrent download links
        for(let i=0; i<torrentSites.length; i++) {
            torrentLinks += '<a target="_blank" class="torrentLink" href="http://' +
                escapeHTML(torrentSites[i]) +
                '/torrent/' +
                escapeHTML(torrent.hash) +
                '.torrent" data-name="' +
                (torrent.name ? escapeHTML(torrent.name) : '') +
                '" data-hash="' +
                escapeHTML(torrent.hash) +
                '">' +
                escapeHTML(torrentSites[i]) +
                '</a>\n';
        }
        showResult('<div class="fade-in"><p>' +
                   (!torrent.name ? '.torrent file' : '<span id="torrentName"></span>') +
                   '</p><p>' +
                   torrentLinks +
                   '</p></div>');
        // If torrent has a name
        if(torrent.name)
            document.getElementById('torrentName').textContent = decodeURIComponent(torrent.name);
    }
    else {
        showResult('<p class="fade-in">Enter a valid magnet URI</p>');
    }

    e.preventDefault();
});

result.addEventListener('click', function (e) {
    if (e.target.classList.contains('torrentLink')) {
        let data = e.target.dataset;
        self.port.emit('downloadTorrent', {
            name: (data.name ? decodeURIComponent(data.name) : data.hash) + '.torrent',
            url: e.target.href
        });
    }

    e.preventDefault();
});

self.port.on('convert', function(magnet) {
    if(magnetInput.value !== magnet) {
        magnetInput.value = magnet;
        submitBtn.click();
    }
});

self.port.on('focus', function() {
    magnetInput.focus();
});
