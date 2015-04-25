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
const { Cu, Ci, Cc} = require('chrome');
const { uniqName } = require('uniq-name');

const { Downloads } = Cu.import('resource://gre/modules/Downloads.jsm');
const { Task } = Cu.import('resource://gre/modules/Task.jsm');

const { notify } = require("sdk/notifications");
const { Services } = Cu.import('resource://gre/modules/Services.jsm');
const { FileUtils } = Cu.import('resource://gre/modules/FileUtils.jsm');
const utils = require('sdk/window/utils');
const pref = Services.prefs.getBranch('extensions.jid1-9tZMAIdeuiEjHg@jetpack.');

const download = data => {
    Task.spawn(function () {
				let dir = pref.getComplexValue('destDir', Ci.nsISupportsString).data;
				if (!dir) //use browser's settings
				{
					if (Services.prefs.getBoolPref("browser.download.useDownloadDir")) //use prefered directory
					{
						dir = (yield Downloads.getPreferredDownloadsDirectory());
					}
					else //ask where to save
					{
						let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
						fp.init(utils.getMostRecentBrowserWindow(), "Save .torrent", fp.modeSave);
						fp.appendFilter("torrent", "*.torrent");
						try
						{
							fp.defaultString = data.name;
							fp.defaultExtension = ".torrent";
							fp.displayDirectory = new FileUtils.File(Services.prefs.getComplexValue("browser.download.lastDir", Ci.nsISupportsString).data);
						}
						catch(e){}
						let rv = fp.show();
						if (rv == fp.returnOK || rv == fp.returnReplace)
						{
							data.name = fp.file.leafName;
							dir = fp.file.parent.path;
						}
						else
						{
							return; //user canceled save file dialog
						}
					}
				}
				if (!dir) //something went wrong
					dir = (yield Downloads.getPreferredDownloadsDirectory());

				let nsIFile = new FileUtils.File(dir);
				if (!nsIFile.exists())
					try
					{
						nsIFile.create(nsIFile.DIRECTORY_TYPE, FileUtils.PERMS_DIRECTORY);
					}
					catch(e)
					{
						notify({
								title: "Problem saving file into",
								text: dir
						});
						return;
					}

        let dl = yield Downloads.createDownload({
            source: {
                url: data.url,
                isPrivate: privateBrowsing.isPrivate(browserWindows.activeWindow)
            },
            target: uniqName(data.name, dir)
        });
        let list = yield Downloads.getList(Downloads.ALL);
        yield list.add(dl);
        dl.start();
    });
};
exports.download = download;