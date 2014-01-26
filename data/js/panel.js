/*
 * Copyright (C) 2014  Siavash Askari Nasr
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

let result = document.getElementById('result');
let form = document.forms['magrent-form'];
let magnetInput = document.getElementById('magnet');
let submitBtn = document.getElementById('submit');

let showResult = output => {
    result.innerHTML = output;
};

form.addEventListener('submit', function (e) {
    let magnet = magnetInput.value;
    let torrent = magrent(magnet);
    if (torrent) {
        // List of torrent cache services
        let torrentSites = ['torrage.com', 'zoink.it', 'torcache.net'];
        let torrentLinks = '';
        // Building torrent download links
        for (let i=0, sitesCount=torrentSites.length; i<sitesCount; i++) {
            torrentLinks += '<a target="_blank" class="torrentLink" href="http://' +
                escapeHTML(torrentSites[i]) +
                '/torrent/' +
                escapeHTML(torrent.hash) +
                '.torrent" data-fileName="' +
                escapeHTML(torrent.filename) +
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
        if (torrent.name)
            document.getElementById('torrentName').textContent = decodeURIComponent(torrent.name);
    }
    else {
        showResult('<p class="fade-in">Enter a valid hash or Magnet URI</p>');
    }

    e.preventDefault();
});

result.addEventListener('click', function (e) {
    if (e.target.classList.contains('torrentLink')) {
        let data = e.target.dataset;
        self.port.emit('downloadTorrent', {
            name: (data.filename ? decodeURIComponent(data.filename) : data.hash) + '.torrent',
            url: e.target.href
        });
    }

    e.preventDefault();
});

self.port.on('convert', function (magnet) {
    if (magnetInput.value !== magnet) {
        magnetInput.value = magnet;
        submitBtn.click();
    }
});

self.port.on('focus', function () {
    magnetInput.focus();
});