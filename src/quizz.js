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

    const numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const [referencia, setReferencia] = useState(randomElement(numArray));
    const [seleccionados, setSeleccionados] = useState([]);
    const [s1, setS1] = useState(0);
    const [s2, setS2] = useState(0);
    const [s3, setS3] = useState(0);

    const [points, setPoints] = useState(0);
    const [partidas, setPartidas] = useState(0);

const comprobar = (data) => {
    if (partidas < 5) {
        if (data == referencia) {
            setPoints(points + 1);
        };
        setReferencia(randomElement(numArray));
        setPartidas(partidas + 1);
        console.log(partidas);
    };
};

    useEffect(() => {
        let newArray = numArray;
        seleccionados.push(referencia);
        newArray= newArray.filter(num => num !=referencia);
        seleccionados.push(randomElement(newArray));
        newArray= newArray.filter(num => num !=seleccionados[1]);
        seleccionados.push(randomElement(newArray));
        shuffleArray(seleccionados);
        setS1(seleccionados[0]);
        setS2(seleccionados[1]);
        setS3(seleccionados[2]);
    }, [referencia])

    return (
        <div>
            <div><p>{referencia}</p></div>
            <button onClick={comprobar(s1)}><img  src={require("./SignosNumeros/" + s1 + ".jpg")}></img></button>
            <button onClick={comprobar(s2)}><img  src={require("./SignosNumeros/" + s2 + ".jpg")}></img></button>
            <button onClick={comprobar(s3)}><img  src={require("./SignosNumeros/" + s3 + ".jpg")}></img></button>
            <div><p>{"Puntos: " + points}</p></div>
            <div><p>{"Partida: " + partidas + "/5"}</p></div>
        </div>
    )
}

export default App;