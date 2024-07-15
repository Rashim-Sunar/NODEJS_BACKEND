import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./App.css"

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:3000/api/jokes")  //needs to add proxy in package.json when axios is used (is diiferent for vite and npx create-react-app)
    //In case of vite, I have added a proxy in vite.config.js
        .then((response)=>{
          setJokes(response.data);
        }).catch((err)=>{
          console.warn(err)
        });

  }, [jokes]);
  return (
    <div>
      <h1>Learn to connect frontend and Backend..</h1>
      <p>JOKES: {jokes.length}</p>
      {
        jokes.map((joke, index) => (
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        ))
      }
    </div>
  )
}

export default App
