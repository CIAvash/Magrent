$('form').submit(function() {
    $('#result').hide();
    let magnet = $('#magnet').val();
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
        showResult('<p>' +
                   (!torrent.name ? '.torrent file' : '<span class="torrentName"></span>') +
                   '</p>\n<p>' +
                   torrentLinks +
                   '</p>\n');
        // If torrent has a name
        if(torrent.name) $('.torrentName').text(decodeURIComponent(torrent.name));
    }
    else {
        showResult('<p>Enter a valid magnet URI</p>');
    }

    return false;
});

$('#result').on('click', '.torrentLink', function (e) {
    let $this = $(this);
    self.port.emit('downloadTorrent', {
        name: $this.data('name') ? decodeURIComponent($this.data('name')) : '',
        hash: $this.data('hash'),
        url: $this.attr('href')
    });
    e.preventDefault();
});

function showResult(result) {
    $('#result').html(result);
    $('#result').stop(true, true).fadeIn('slow');
}

self.port.on('convert', function(magnet) {
    if($('#magnet').val() !== magnet) {
        $('#magnet').val(magnet);
        $('form').submit();
    }
});

self.port.on('focus', function() {
    $('#magnet').focus();
});
