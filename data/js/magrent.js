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

// Constructing base32 and base16 encoder/decoder
const base32 = new Nibbler({
    dataBits: 8,
    codeBits: 5,
    keyString: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    pad: '='
});

const base16 = new Nibbler({
    dataBits: 8,
    codeBits: 4,
    keyString: '0123456789ABCDEF'
});

const magrent = input => {
    let hash;
    let torrentName = '';
    let fileName = '';

    if (/^magnet:\?/i.test(input)) {
        // Pattern for matching Bittorrent info hash
        const magnetPattern = /xt=urn:btih:([a-z0-9]+)/i;
        const hashMatch = magnetPattern.exec(input);
        if (hashMatch)
            hash = hashMatch[1];
        else
            return false;

        // Pattern for matching display name in magnet URI
        let magNamePattern = /dn=(.+?)(?=(?:&\w+=)|$)/m;
        let magnetName = magNamePattern.exec(input);        
        if (magnetName) {
            torrentName = magnetName[1].replace(/[+.\-]+/g, ' ');
            // Replace separators with '.' and make sure it's a valid filename
            fileName = decodeURIComponent(magnetName[1]).replace(/[+\-|:\\\/*?<>"_ .]+/g, '.');
        }
    }
    else {
        hash = input;
    }

    
    hash = hash.toUpperCase();

    if (/^[A-Z2-7]{32}$/.test(hash)) {
        // If hash is base32, convert it to base16
        hash = base16.encode(base32.decode(hash));
    }
    else if (!(/^[A-F0-9]{40}$/.test(hash))) {
        return false;
    }

    return {
        hash: hash,
        name: torrentName,
        filename: fileName
    };
};