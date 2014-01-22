const file = require('sdk/io/file');

const uniqName = (fileName, dir) => {
    const dotPosition = fileName.lastIndexOf('.');
    let fileExt = '';
    if (dotPosition !== -1) {
        fileExt = fileName.slice(dotPosition);
        fileName = fileName.slice(0, dotPosition);
    }

    fileName = file.join(dir, fileName);
    let filePath = fileName + fileExt;
    for (let i=1; file.exists(filePath); i++)
        filePath = fileName + '(' + i + ')' + fileExt;

    return filePath;
};
exports.uniqName = uniqName;