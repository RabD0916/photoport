import './App.css';
import Nav from'./nav';
import {useEffect, useState} from "react";
import React from "react";

function App() {

  const [data, setData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetch("/showMe")
        .then((res) => {
          return res.json();
        })
        .then(function (result) {
          setData(result);
        })
  },[]);

    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        window.addEventListener("scroll", updateScroll);
    }, []);


  return (
      <div className="App">
            <Nav/>
        <header className="App-header">
          <ul>
              <div>
                  <img className={scrollPosition > 20 ? "mount1" : "hidden"}  src="/img.png" alt="강아지" />
              </div>
            {data.map((v,idx)=><li key={`${idx}-${v}`}>{v}</li>)}
          </ul>
        </header>
      </div>
  );
}

export default App;