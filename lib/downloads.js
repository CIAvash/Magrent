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