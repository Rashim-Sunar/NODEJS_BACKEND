const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 8000;
const html = fs.readFileSync("./index.html",'utf-8');
let data = JSON.parse(fs.readFileSync('./about.json', 'utf-8'));
const aboutHTML = fs.readFileSync('./about.html','utf-8');
const aboutDetailsHTML = fs.readFileSync("./aboutDetails.html","utf-8");

const replaceHTML = require('./modules/replaceHTML');

//Server inherits from EVENT EMITTER
const server = http.createServer();
/*Whenever new request hit the server , the above server object emits an event 
  and we can listen to that emitted event by using .on() method*/
  //The first parameter is which event you want to listen
  //Second parameter is callback function.
server.on('request',(req,res)=>{
    if(path==="/" || path === "/home"){
        res.writeHead(200,{
            'Content-Type':'text/html',
            'myheader': 'hello, world', 
        }); 
        res.end(html.replace('{{%CONTENT%}}',"This is home page"));
    }else if(path === "/contact"){
        res.writeHead(200,{
            'Content-Type':'text/html',
            'myheader': 'hello, world', 
        });
        res.end(html.replace('{{%CONTENT%}}',"This is contact page"));
    }else if(path==="/about"){
        if(!query.id){
            let aboutHTMLArray = data.map((item)=>
                replaceHTML(aboutHTML, item)
            );
            aboutHTMLArray = aboutHTMLArray.join(''); 
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end((html.replace('{{%CONTENT%}}',aboutHTMLArray)));
        }else{
            let aboutDetail = data[query.id-1];
            let displayDetail = replaceHTML(aboutDetailsHTML, aboutDetail);
            res.end(html.replace("{{%CONTENT%}}", displayDetail));  
        }
         
    }else{
        res.writeHead(404,{
            'Content-Type':'text/html',
            'myheader': 'hello, world', 
        }); 
        res.end(html.replace('{{%CONTENT%}}',"404 ERROR. Page not found!"));
    }
})



server.listen(port, '127.0.0.1',(err)=>{
    if(err){
        console.log("Internal error occured");
    }else{
        console.log("Server listening on port:", port);
    }
});