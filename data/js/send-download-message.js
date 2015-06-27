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

const sendDownloadMessage = (data, srcName, type) => {
    let torrent;

    // Create torrent object
    if (type === 'magnet')
        torrent = magrent(data);
    else if (type === 'piratebay')
        torrent = piratebayTorrent(data);
    else if (type === 'panel')
        torrent = data;
    
    if (torrent) {
        // Create download object
        let download = {
            name: (torrent.filename ? decodeURIComponent(torrent.filename) : torrent.hash) + '.torrent',
            srcName: srcName
        };

        // Create download url based on type of source
        if (type === 'magnet') {
            download.url = 'https://' + srcName + '/torrent/' + torrent.hash + '.torrent';
        }
        else if (type === 'piratebay') {
            download.url =
                'http://' + srcName + '/' + torrent.hash + '/' +
                (torrent.filename ? torrent.filename : torrent.hash) + '.torrent';
        }
        else if (type === 'panel') {
            download.url = torrent.url;
        }

        // Send the message
        if (type === 'panel')
            self.port.emit('downloadTorrent', download);
        else
            self.postMessage(download);
    }
};