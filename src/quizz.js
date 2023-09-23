import React, { useRef, useState, useEffect } from "react";

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function App() {

    const numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
    // const numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


    const [referencia, setReferencia] = useState(randomElement(numArray));
    const [seleccionados, setSeleccionados] = useState([]);
    const [s1, setS1] = useState(0);
    const [s2, setS2] = useState(0);
    const [s3, setS3] = useState(0);

    const [points, setPoints] = useState(0);
    const [partidas, setPartidas] = useState(0);
    const [end, setEnd] = useState(false);

    const comprobar = (data) => {
        if (partidas < 5) {
            if (data === referencia) {
                setPoints(points + 1);
            }
            setReferencia(randomElement(numArray));
            setPartidas(partidas + 1);
        }
    }

    useEffect(() => {
        let newArray = [];
        newArray = numArray;
        setSeleccionados([]);
        seleccionados.push(referencia);
        newArray = newArray.filter(num => num !== referencia);
        seleccionados.push(randomElement(newArray));
        newArray = newArray.filter(num => num !== seleccionados[1]);
        seleccionados.push(randomElement(newArray));
        shuffleArray(seleccionados);
        setS1(seleccionados[0]);
        setS2(seleccionados[1]);
        setS3(seleccionados[2]);
        if (partidas === 5) {
            setEnd(true);
        }
    }, [referencia])

    // useEffect(() => {
        
    // }, [true])

    return (
        <div className="quizz">
            <div className="quizz_up">
                <div className="quizz_points">
                    <div><p>{"Puntos: " + points}</p></div>
                    <div><p>{"Partida: " + partidas + "/5"}</p></div>
                </div>
                <img className="quizz_num" src={require("./global/" + referencia + ".png")}></img>
                <img className={end? "quizz_mono quizz_mono_salta" :"quizz_mono"} src={require("./mascots/monosentado.png")}></img>
            </div>
            <div className="quizz_down">
                <button onClick={() => { comprobar(s1) }}><img className="quizz_numB" src={require("./global/" + s1 + "B.png")}></img></button>
                <button onClick={() => { comprobar(s2) }}><img className="quizz_numB" src={require("./global/" + s2 + "B.png")}></img></button>
                <button onClick={() => { comprobar(s3) }}><img className="quizz_numB" src={require("./global/" + s3 + "B.png")}></img></button>
            </div>

        </div>
    )
}

export default App;