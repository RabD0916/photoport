import './App.css';
import 네비 from'./nav';
import {useEffect, useState} from "react";
import React from "react";

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/showMe")
        .then((res) => {
          return res.json();
        })
        .then(function (result) {
          setData(result);
        })
  },[]);


  return (
      <div className="App">
            <네비/>
        <header className="App-header">
          <ul>
            {data.map((v,idx)=><li key={`${idx}-${v}`}>{v}</li>)}
          </ul>
        </header>
      </div>
  );
}

export default App;