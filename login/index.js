var fs = require('fs');

function readUser(dir) {
    try {
        var res = fs.readFileSync(dir);
    } catch (error) {
        console.log('读取失败');
    }
};

function writeUser(dir, data) {
    try {
        fs.writeFileSync(dir, JSON.stringify(data))
    } catch (error) {
        console.log('写入失败');
    }
};

module.exports = {
    readUser,
    writeUser
}