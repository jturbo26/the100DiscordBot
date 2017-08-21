var fs = require('fs');

module.exports =
{
    read: function (filePath)
    {
        return fs.readFileSync(filePath, 'utf8');
    }
};