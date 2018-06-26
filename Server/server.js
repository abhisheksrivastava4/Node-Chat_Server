const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

const app = new express();

var fullPath =   path.join(__dirname ,'../public');

console.log(fullPath);

app.use(express.static(fullPath)); 

app.listen(port,()=>{
    console.log(`server up on port ${port}`);
});