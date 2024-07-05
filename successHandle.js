const headers = require('./commonDefine');

function successHandle(res, todos) {
    res.writeHead(200, headers);
    res.write(JSON.stringify(
        {
            "Status": "Success",
            "Data": todos
        }
    ));
    res.end();
}

module.exports = successHandle;