$('form').submit(function() {
    $('#result').hide();
    let magnet = $('#magnet').val();
    let torrent = magrent(magnet, true);
    if(torrent) {
        // List of torrent cache sites
        let torrentSites = ['torrage.com', 'zoink.it', 'torcache.net', 'torrage.ws'];
        let torrentLinks = '';
        // Building torrent download links
        for(let i=0; i<torrentSites.length; i++) {
            torrentLinks += '<a target="_blank" class="torrentLink" href="http://' + torrentSites[i] + '/torrent/' + torrent[0] + '.torrent">' + torrentSites[i] + '</a>\n';
        }
        showResult('<p>' + (torrent.length === 1 ? '.torrent file' : '<span class="torrentName"></span>') + '</p>\n<p>' + torrentLinks + '</p>\n');
        // If torrent has a name
        if(torrent.length === 2) $('.torrentName').text(decodeURIComponent(torrent[1]));
    } else showResult('<p>Enter a valid magnet URI</p>');
    return false;
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
