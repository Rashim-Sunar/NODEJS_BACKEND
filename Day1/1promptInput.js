//Readline Module -> Used to take input and give output on prompt

const readline = require('readline');
rl = readline.createInterface({
    input: process.stdin,  //To input from user via prompt
    output: process.stdout //To display data on prompt
});

rl.question("Please enter your name:", (name)=> {
    console.log("You entered: "+name);
    rl.close(); //To close the interface after information is logged..
});

/*When the interface is closed it emits a closed event and we can listen that event
do something after the closed event happen..*/

rl.on('close', () => {
    console.log("Interface closed");
    process.exit(0); //To exit the program
})