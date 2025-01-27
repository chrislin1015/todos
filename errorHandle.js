const headers = require("./commonDefine");

function errorHandle(res, message) {
    res.writeHead(400, headers);
    res.write(JSON.stringify(
        {
            "Status": "Fail",
            "Message": message
        }));
    res.end();
}

module.exports = errorHandle;