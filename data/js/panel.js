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

form.addEventListener('submit', e => {
    let torrent;
    let input = magnetInput.value;
    let srcIsPiratebay = /.*thepiratebay\.[^.]*?\/torrent\/\d+(\/.*)?/.test(input);

    if (srcIsPiratebay)
        torrent = piratebayTorrent(input);
    else
        torrent = magrent(input);

    if (torrent) {
        let torrentLinks = '';

        if (srcIsPiratebay) {
            let srcName = 'piratebaytorrents.info';
            let torrentName = torrent.filename ? torrent.filename : torrent.hash;

            torrentLinks = '<a target="_blank" class="torrentLink" href="http://' +
                escapeHTML(srcName) +
                '/' +
                escapeHTML(torrent.hash) +
                '/' +
                escapeHTML(torrentName) +
                '.torrent" data-fileName="' +
                escapeHTML(torrentName) +
                '" data-hash="' +
                escapeHTML(torrent.hash) +
                '" data-srcName="' +
                escapeHTML(srcName) +
                '">' +
                escapeHTML(srcName) +
                '</a>\n';
                
        }
        else {
            // List of torrent cache services
            let torrentSites = ['torrage.com', 'torcache.net', 'thetorrent.org'];

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
                    '" data-srcName="' +
                    escapeHTML(torrentSites[i]) +
                    '">' +
                    escapeHTML(torrentSites[i]) +
                    '</a>\n';
            }
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
        showResult('<p class="fade-in">Enter a valid Magnet URI, Hash or Piratebay URL</p>');
    }

    e.preventDefault();
});

result.addEventListener('click', e => {
    if (e.target.classList.contains('torrentLink')) {
        let data = e.target.dataset;
        data.url = e.target.href;
        sendDownloadMessage(data, data.srcname, 'panel');
    }

    e.preventDefault();
});

self.port.on('convert', magnet => {
    if (magnetInput.value !== magnet) {
        magnetInput.value = magnet;
        submitBtn.click();
    }
});

self.port.on('focus', () => magnetInput.focus());