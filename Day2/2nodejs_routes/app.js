const http = require('http');
const port = 8000;
const fs = require('fs');

const html = fs.readFileSync("./Home.html",'utf-8');
/*By default nodejs doesn't include static files so, though Home.css is 
included in Home.html the effect of css is neglected by nodejs...*/

const server = http.createServer((req, res)=>{
    const path = req.url;
    if(path==="/" || path === "/home"){
        /*The header of a response contains additional information about the response. For example:
        What kind of information is sent to client at what time and so on.
        To define a header for a response we can pass an object as a second arguement in respose.writeHead() method.
        The first parameter is status code. -->Specifying status code for response 200 means ok or success.. */
       
        res.writeHead(200,{
            'Content-Type':'text/html',
            'myheader': 'hello, world', //Specifying custom header...
        }); 
        res.end(html.replace('{{%CONTENT%}}',"This is home page"));
    }else if(path === "/contact"){
        res.writeHead(200,{
            'Content-Type':'text/html',
            'myheader': 'hello, world', 
        });
        res.end(html.replace('{{%CONTENT%}}',"This is contact page"));
    }else if(path==="/about"){
        res.writeHead(200,{
            'Content-Type':'text/html',
            'myheader': 'hello, world', 
        });
        res.end(html.replace('{{%CONTENT%}}',"This is about page"));
    }else{
        res.writeHead(404,{
            'Content-Type':'text/html',
            'myheader': 'hello, world', 
        }); //Status code 404 for resource not found.
        res.end(html.replace('{{%CONTENT%}}',"404 ERROR. Page not found!"));
    }
});

server.listen(port, '127.0.0.1',(err)=>{
    if(err){
        console.log("Internal error occured");
    }else{
        console.log("Server listening on port:", port);
    }
});