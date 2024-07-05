const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require("./commonDefine");
const successHandle = require('./successHandle');
const errorHandle = require("./errorHandle");
let todos = [
    {
        'title': "我很帥",
        "uid": uuidv4()
    }
];

const requestListener = (req, res) => 
    {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        });
        
        if (req.url === '/todos' && req.method === 'GET')
        {
            successHandle(res, todos);
        }
        else if (req.url === '/todos' && req.method === 'POST')
        {
            req.on('end', () => {
                try {
                    let json_data = JSON.parse(body);
                    if (json_data.title !== undefined) {
                        console.log(json_data);
                        let todo = {
                            'title': json_data.title,
                            'uid': uuidv4()
                        }
                        todos.push(todo);
                        successHandle(res, todos);
                    }
                    else {
                        errorHandle(res, "物件格式錯誤");
                    }
                } catch (er) {
                    errorHandle(res, `error: ${er.message}`);
                }
            });
        }
        else if (req.url === '/todos' && req.method === 'DELETE')
        {
            todos.length = 0;
            successHandle(res, todos);
        }
        else if (req.url.startsWith('/todos/') && req.method === 'DELETE') 
        {
            let id = req.url.split('/').pop();
            let index = todos.findIndex(e => e.uid === id);
            if (index >= 0) {
                todos.splice(index, 1);
                successHandle(res, todos);
            }
            else {
                errorHandle(res, `找不到待辦事項 : ${id}`);
            }
        }
        else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
            req.on('end', () => {
                try {
                    const jsonData = JSON.parse(body);
                    if (jsonData.title === undefined) {
                        errorHandle(res, "物件格式錯誤");
                        return;
                    }
                    const id = req.url.split('/').pop();
                    const index = todos.findIndex(e => e.uid === id);
                    if (index < 0) {
                        errorHandle(res, `找不到待辦事項 : ${id}`);
                        return;
                    }
                    todos[index].title = jsonData.title;
                    successHandle(res, todos);
                } catch (er) {
                    errorHandle(res, `error: ${er.message}`);
                }
            });
        }
        else if (req.method === "OPTIONS")
        {
            res.writeHead(200, headers);
            res.end();
        }
        else
        {
            res.writeHead(404, headers);
            res.write(JSON.stringify(
                {
                    "Status": "Failed",
                    "Message": "找不到網頁" 
                }
            ));
            res.end();
        }
    }

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);

