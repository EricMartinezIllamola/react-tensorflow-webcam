import React, { useRef, useState, useEffect } from "react";
import "./players.css";

function App() {

    const [degrees, setDegrees] = useState(0);

    const prev = () => {
        setDegrees(degrees + 36);
    }

    const next = () => {
        setDegrees(degrees - 36);
    }

    return (
        <div className="body">
            <div className="container">
                <div className="btns2">
                    <div className="player">
                        <label>Name:</label>
                        <input></input>
                    </div>
                    <button className="continuar">Continuar</button>
                </div>
                <div className="box" style={{ transform: `perspective(1000px) rotateY(${degrees}deg)` }}>
                    <span ><img src={require("./avatar/1.jpg")}></img></span>
                    <span ><img src={require("./avatar/2.jpg")}></img></span>
                    <span ><img src={require("./avatar/3.jpg")}></img></span>
                    <span ><img src={require("./avatar/4.jpg")}></img></span>
                    <span ><img src={require("./avatar/5.jpg")}></img></span>
                    <span ><img src={require("./avatar/6.jpg")}></img></span>
                    <span ><img src={require("./avatar/7.jpg")}></img></span>
                    <span ><img src={require("./avatar/8.jpg")}></img></span>
                    <span ><img src={require("./avatar/9.jpg")}></img></span>
                    <span ><img src={require("./avatar/10.jpg")}></img></span>
                </div>
                <div className="btns">
                    <div className="btn prev" onClick={() => { prev() }}></div>
                    <div className="btn next" onClick={() => { next() }}></div>
                </div>
            </div>
        </div>
    )
}

export default App;