// To input array in format off..
// 4 2
// 1 4
// 2 9

const readline = require('readline');
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let arr = [];

rl.on("line", (line)=>{
    let newLine = line.split("");
    newLine = newLine.map(elem => parseInt(elem, 10));
    arr = [...arr, ...newLine];
});

rl.on('close', () => {
    console.log(arr);
    console.log(typeof(arr[1]))
});
