// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./camara.css";
// import { drawRect } from "./draw_num_3";


function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  const numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const [referencia, setReferencia] = useState(randomElement(numArray));
  let [results, setResults] = useState([]);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(20);

  const [start, setStart] = useState(false);
  const [dz, setDz] = useState(false);

  // Detection Zone y Cuadrado
  let [x, setX] = useState(localStorage.getItem("x") ? parseInt(localStorage.getItem("x")) : 25);
  let [y, setY] = useState(localStorage.getItem("y") ? parseInt(localStorage.getItem("y")) : 25);
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(240);

  const labelMap = {
    0: { name: 'A', color: 'purple' },
    1: { name: 'B', color: 'red' },
    2: { name: 'C', color: 'yellow' },
    3: { name: 'D', color: 'lime' },
    4: { name: 'E', color: 'blue' },
    5: { name: 'F', color: 'orange' },
    6: { name: 'G', color: 'black' },
    7: { name: 'H', color: 'white' },
    8: { name: 'I', color: 'darkred' },
    9: { name: 'K', color: 'darkblue' },
    10: { name: 'L', color: 'purple' },
    11: { name: 'M', color: 'red' },
    12: { name: 'N', color: 'yellow' },
    13: { name: 'O', color: 'lime' },
    14: { name: 'P', color: 'blue' },
    15: { name: 'Q', color: 'orange' },
    16: { name: 'R', color: 'black' },
    17: { name: 'S', color: 'white' },
    18: { name: 'T', color: 'darkred' },
    19: { name: 'U', color: 'darkblue' },
    20: { name: 'V', color: 'purple' },
    21: { name: 'W', color: 'red' },
    22: { name: 'X', color: 'yellow' },
    23: { name: 'Y', color: 'lime' },
  }

  // Main function

  useEffect(() => {
    const runModel = async () => {
      let alphabet_model_03 = "https://raw.githubusercontent.com/EricMartinezIllamola/alphabet-model-03/main/model.json";
      let alphabet_model_05 = "https://raw.githubusercontent.com/EricMartinezIllamola/alphabet-model-05/main/model.json";

      const model = await tf.loadGraphModel(alphabet_model_05);
      console.log("Model loaded.");

      //  Loop and detect hands

      const myInterval = setInterval(() => {
        const detect = async (model) => {
          // Check data is available
          if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
          ) {

            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            canvasRef2.current.width = videoWidth;
            canvasRef2.current.height = videoHeight;

            // if (parseInt(localStorage.getItem("x")) != x) {
            //   x = parseInt(localStorage.getItem("x"));
            // }

            // if (parseInt(localStorage.getItem("y")) != y) {
            //   y = parseInt(localStorage.getItem("y"));
            // }

            // const frame = webcamRef.current.getScreenshot()
            const canvas = document.getElementById("canvas");

            // Draw Detection Zone
            const ctx = canvasRef.current.getContext("2d");
            ctx.drawImage(video, x, y, width, height, 0, 0, 640, 480);

            // Make Detections
            const img = tf.browser.fromPixels(canvas)
            const resized = tf.image.resizeBilinear(img, [56, 56])
            const expanded = resized.expandDims(0)
            const obj = await model.execute(expanded)
            const predictedValue = argMax(obj.arraySync()[0]);
            results.push(predictedValue);
            setResults(results.slice(-10));
            results = results.slice(-10);

            // Draw Cuadrado y Results

            const drawRect = (predictedValue, ctx, x, y, width, height) => {
              // Set styling
              ctx.strokeStyle = labelMap[predictedValue]['color']
              ctx.lineWidth = 1
              ctx.fillStyle = labelMap[predictedValue]['color']
              ctx.font = '70px Arial'

              // DRAW!!
              ctx.beginPath()
              ctx.rect(x, y, width, height);
              ctx.fillText(labelMap[predictedValue]['name'], (x + (width / 2.5)), (y + 310))
              ctx.stroke()
            }
            const ctx2 = canvasRef2.current.getContext("2d");
            requestAnimationFrame(() => { drawRect(predictedValue, ctx2, x, y, width, height) });

            tf.dispose(img);
            tf.dispose(resized);
            tf.dispose(expanded);
            tf.dispose(obj);
            tf.dispose(predictedValue);
          }
        };
        detect(model)
      }, 200);
      return () => clearInterval(myInterval)
    };
    runModel();
  }, []);

  const save = () => {
    localStorage.setItem("x", document.getElementById("x").value);
    localStorage.setItem("y", document.getElementById("y").value);
    setX(parseInt(localStorage.getItem("x")));
    setY(parseInt(localStorage.getItem("y")));

  }

  useEffect(() => {
    if (results.filter(x => x == referencia).length == 7) {
      setResults([]);
      if (timer > 0 && start) {
        setPoints(points + 1);
        setReferencia(randomElement(numArray));
      }
      else if (timer == 0 && start) {
        setReferencia(randomElement(numArray));
      }
    }
  }, [results]);

  useEffect(() => {
    timer > 0 && start && setTimeout(() => setTimer(timer - 1), 1000);
  }, [timer])


  if (start) {
    return (
      <div className="App">

        <Webcam
          className="web"
          ref={webcamRef}
          muted={true}
          // mirrored={true}  
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 500,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef2}
          id="canvas2"
          // mirrored={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 500,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          id="canvas"
          // mirrored={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: -2500,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
            // visibility: "hidden",
          }}
        />
        <img className="img_ejemplo" src={require("./SignosAlphabet/" + referencia + ".jpg")}></img>
        <div><p className="num_ejemplo">{labelMap[referencia]['name']}</p></div>
        <div><p className="points">{points}</p></div>
        <div><p className="timer">{timer < 10 ? "0" + timer : timer}</p></div>
        <button className="btn-exit" onClick={() => { }}>EXIT</button>
      </div>
    );
  }
  else if (!start && !dz) {
    return (
      <div className="App">

        <Webcam
          className="web"
          ref={webcamRef}
          muted={true}
          // mirrored={true}  
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 500,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef2}
          id="canvas2"
          // mirrored={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 500,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          id="canvas"
          // mirrored={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: -2500,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
            // visibility: "hidden",
          }}
        />
        {/* <img className="img_ejemplo" src={require("./SignosNumeros/" + referencia + ".jpg")}></img>
        <div><p className="num_ejemplo">{referencia}</p></div> */}
        <div><p className="points">{points}</p></div>
        <div><p className="timer">{timer < 10 ? "0" + timer : timer}</p></div>
        <button className="btn-start" onClick={() => { setStart(!start); setTimer(timer + 1); setReferencia(randomElement(numArray)) }}>START</button>
        <button className="btn-dz" onClick={() => { setDz(!dz); }}>Square</button>
        <button className="btn-exit" onClick={() => { }}>EXIT</button>
      </div>
    )
  }

  else if (!start && dz) {
    return (
      <section>
        <div className="App">
          <Webcam
            className="web"
            ref={webcamRef}
            muted={true}
            // mirrored={true}  
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              top: 100,
              left: 500,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />

          <canvas
            ref={canvasRef2}
            id="canvas2"
            // mirrored={true}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              top: 100,
              left: 500,
              right: 0,
              textAlign: "center",
              zindex: 8,
              width: 640,
              height: 480,
            }}
          />

          <canvas
            ref={canvasRef}
            id="canvas"
            // mirrored={true}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: -2500,
              right: 0,
              textAlign: "center",
              zindex: 8,
              width: 640,
              height: 480,
            }}
          />
          {/* <img className="img_ejemplo" src={require("./SignosNumeros/" + referencia + ".jpg")}></img>
        <div><p className="num_ejemplo">{referencia}</p></div> */}
        </div>
        <div><p className="points">{points}</p></div>
        <div><p className="timer">{timer < 10 ? "0" + timer : timer}</p></div>
        <form action="" onSubmit={() => { setDz(!dz); save() }}>
          <label name="x">X</label>
          <input type="number" name="x" id="x"></input>
          <label name="y">Y</label>
          <input type="number" name="y" id="y"></input>
          <label name="width">Width</label>
          <input type="number" name="width"></input>
          <label name="height">Height</label>
          <input type="number" name="height"></input>
          <button type="Submit" className="btn-save" >Save</button>
          {/* onClick={ () => { setDz(!dz)} } */}
        </form>
        <button className="btn-reset">Reset</button>
      </section>
    )
  }
}

export default App;