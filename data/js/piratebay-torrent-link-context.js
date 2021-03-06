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

self.on('context', (node) => {
    if (/.*thepiratebay\.[^.]*?\/torrent\/\d+(\/.*)?/.test(node.href))
        return true;
    else
        return false;
});

self.on("click", (node, data) => {
    sendDownloadMessage(node.href, data, "piratebay");
});