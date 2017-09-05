const fs = require('fs');

const read = (filePath) =>
{
    return fs.readFileSync(filePath, 'utf8');
}

module.exports.read = read;