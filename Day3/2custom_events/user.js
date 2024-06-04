const events = require('events');

//Using concept of inheritance-> The exported class should also inherited from EventEmitter class(base class).
module.exports = class extends events.EventEmitter{
    constructor(){
        //Within constructor, calling the constructor of base class using super() keyword..
        super();
    }
}