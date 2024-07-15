const express = require('express');
const port = 8000;
const app = express();
const path = require('path');
const multer = require('multer');

app.use(express.urlencoded({extended: false})); //middleware to use form data....

// const upload = multer({dest: 'uploads/'}); //upload here is a middleware....
//Above destination, file will be corrupted i.e.in server we can't read the file.
//So we are making the diskStorage...

const storage = multer.diskStorage({
    destination: function(req, file, cb){  //cb here is callback
        return cb(null, './uploads'); // 1st parameter is error so null here..
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({storage});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


//UPLOADING SINGLE FILE
// app.post("/profile", upload.single("profileImage"), (req, res) => {
//     console.log("Body:",req.body);
//     console.log("File",req.file);
//     return  res.redirect("/");
// });

// UPLOADING MULTIPLE FILES 
app.post("/profile", upload.fields([{name: 'profileImage'}, {name: 'coverImage'}]), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/");
})

app.listen(port, ()=>{
    console.log("Server listening on port", port);
})