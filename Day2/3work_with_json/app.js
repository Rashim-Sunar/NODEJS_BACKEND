const http = require('http');
const fs = require('fs');
const url = require('url');
//Above modules are called core modules...
const port = 8000;
const html = fs.readFileSync("./index.html",'utf-8');
let data = JSON.parse(fs.readFileSync('./about.json', 'utf-8'));
const aboutHTML = fs.readFileSync('./about.html','utf-8');
const aboutDetailsHTML = fs.readFileSync("./aboutDetails.html","utf-8");
//Importing user-defined module or custom modules...
const replaceHTML = require('./modules/replaceHTML');

/*let aboutHTMLArray = data.map((item) => {
    let output = aboutHTML.replace('{{%title%}}' ,item.title);   
    output = output.replace('{{%body%}}',item.body);
    output = output.replace('{{%ID%}}',item.id);
    return output;
});  */

//Creating reusable code for both about.html and aboutDetails.html
/*function replaceHTML(template, details){
    let output = template.replace('{{%title%}}' ,details.title);   
    output = output.replace('{{%body%}}',details.body);
    output = output.replace('{{%ID%}}',details.id);
    output = output.replace('{{%userId%}}', details.userId);
    return output;
}*/

const server = http.createServer((req, res)=>{
    // const path = req.url;
    // const x = url.parse(req.url, true); 
    // console.log(x)
    //Parsing query string and pathname from url.
    let {query, pathname: path} = url.parse(req.url, true); //.parse method return an object containing the path and query strings too.
    // console.log(query);
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
            aboutHTMLArray = aboutHTMLArray.join('');  //removing comma separating array element..
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end((html.replace('{{%CONTENT%}}',aboutHTMLArray)));
            // console.log(aboutHTMLArray);
        }else{
            let aboutDetail = data[query.id-1];
            // console.log(aboutDetail);
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
});

server.listen(port, '127.0.0.1',(err)=>{
    if(err){
        console.log("Internal error occured");
    }else{
        console.log("Server listening on port:", port);
    }
});