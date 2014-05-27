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

self.on('click', function (node, data) {
    let torrent = magrent(node.href);
    if (torrent) {
        self.postMessage({
            name: (torrent.filename ? decodeURIComponent(torrent.filename) : torrent.hash) + '.torrent',
            url: 'http://' + data + '/torrent/' + torrent.hash + '.torrent',
            srcName: data
        });
    }
});