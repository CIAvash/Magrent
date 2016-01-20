/*
 * Copyright (C) 2015  Siavash Askari Nasr
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

const generateTorrentUrl = (torrentHost, torrentHash, torrentFilename) => {
    let protocol = 'http';
    if (torrentHost === 'torrage.com') protocol = 'https';

    let extension = '.torrent';
    if (torrentHost === 'btcache.me') extension = '';

    if (torrentFilename && torrentHost === 'torcache.net')
        extension += '?title=' + torrentFilename;

    return protocol + '://' + torrentHost + '/torrent/' + torrentHash + extension;
};