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

const piratebayTorrent = tpbURL => {
    const tpbTorrentPattern = /^.*thepiratebay\.[^.]*?\/torrent\/(\d+)(?:\/([^#]*))?/;
    const tpbTorrentMatch = tpbTorrentPattern.exec(tpbURL);

    if (tpbTorrentMatch) {
        let torrent = {};
        let torrentNames = { name: '', filename: '' };

        torrent.hash = tpbTorrentMatch[1];

        if (tpbTorrentMatch[2])
            torrentNames = createCleanNames(tpbTorrentMatch[2]);

        torrent.name = torrentNames.name;
        torrent.filename = torrentNames.filename;

        return torrent;
    }
    else
        return false;
};