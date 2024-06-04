const events = require('events'); //importing events module
const user = require('./user.js');

//EMITTING AND HANDLING CUSTOM EVENTS
/************************************/


// let myEmitter = new events.EventEmitter(); //Here, EventEmitter is a class, so using constructor to assign instance of event emitter class
let myEmitter = new user(); //Since, user class internally inherits from EventEmitter class, so the result will be same.

//Listening to the emitted event.
myEmitter.on('userCreated',(id,name)=>{
    console.log(`User ${name} created with id-${id} successfully`)
});

//We can setup multiple listeners on the same event & perform different logics on each....
myEmitter.on('userCreated',(id, name)=>{
    console.log(`New user ${name} added to the database with id-${id}`);
})

myEmitter.emit("userCreated",101,"aakash"); //Using .emit() method, we emit a named event called 'userCreated
