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

const privateBrowsing = require('sdk/private-browsing');
const { browserWindows } = require('sdk/windows');
const { Cu } = require('chrome');
const { uniqName } = require('uniq-name');

const { Downloads } = Cu.import('resource://gre/modules/Downloads.jsm');
const { Task } = Cu.import('resource://gre/modules/Task.jsm');

const download = data => {
    Task.spawn(function () {
        let dl = yield Downloads.createDownload({
            source: {
                url: data.url,
                isPrivate: privateBrowsing.isPrivate(browserWindows.activeWindow)
            },
            target: uniqName(data.name, (yield Downloads.getPreferredDownloadsDirectory()))
        });
        let list = yield Downloads.getList(Downloads.ALL);
        yield list.add(dl);
        dl.start();
    });
};
exports.download = download;