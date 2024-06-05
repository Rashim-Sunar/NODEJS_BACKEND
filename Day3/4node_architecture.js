// What is process?
--> A process is what facilitates the execution of a program. In simple words, a process    
is just a program which is currently executing.For eg: if we open a calculator app,
a process called calculator.exe is created for that program to facilitate the execution.

As we know a nodejs is written in C++, so when we run a nodejs application, a node process
is created for that application which is run on that machine.


// What is THREAD?
--> A thread is what is responsible for executing a program code in the process.
By default, every process has one main thread.
Simply, thread is where the code of a program gets executed.
Note: nodejs application is executed in one single thread.


// Exploring the mechanism of running node application in single thread.....
-->All the modules which are required or immported runs on the "MAIN THREAD". All the top 
level codes i.e which are not inside any callback functions also run in main thread.

All other codes, which run asynchronously like file system functions, they are not executed
in the main thread, they are executed in the background which is called "THREAD POOL".
For eg: .readFile(), http.createServer(), etc.

Once the job of reading file asynchronously is completed, the callback function inside 
it is pushed to the "EVENT LOOP". The callback function inside EVENT LOOP don't get
executed immediately, it waits inside the event loop and gets executed only when the main
thread is empty.
At last the callback is pushed to main thread where it is finally executed.

If the callback again contains a heavy task like reading a file asynchronously, then 
again that task is pushed to thread pool.

By default nodejs has four additional threads in thread pool as shown in
5nodejs_architecture.png.

All the file dealing task, crptography(like password hashing), compression related task,
DNS are uploaded to thread pool.