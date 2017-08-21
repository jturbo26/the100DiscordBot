const fs = require('fs');
const path = require('path');
const file = require('../helper/file.js');

module.exports =
{
    format: function (fileName, ...replacements)
    {
        var filePath = path.join(__dirname, "templates", fileName);

        var fileContents = file.read(filePath);

        for (counter = 0; counter < replacements.length; counter++)
        {
            var pattern = "$[" + counter.toString() + "]";

            var replacement = replacements[counter];

            fileContents = fileContents.replace(new RegExp(pattern.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), "gim"), (typeof (replacement) == "string") ? replacement.replace(/\$/g, "$$$$") : replacement);
        }

        return fileContents;
    }
};