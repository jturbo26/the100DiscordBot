const fs = require('fs');
const path = require('path');
const file = require('../helper/file.js');

const format = (fileName, ...replacements) =>
{
    const filePath = path.join(__dirname, 'templates', fileName);

    let fileContents = file.read(filePath);

    for (counter = 0; counter < replacements.length; counter++)
    {
        const pattern = '$[' + counter.toString() + ']';

        let replacement = replacements[counter];

        fileContents = fileContents.replace(new RegExp(pattern.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), 'gim'), (typeof (replacement) == 'string') ? replacement.replace(/\$/g, '$$$$') : replacement);
    }

    return fileContents;
}

module.exports.format = format;