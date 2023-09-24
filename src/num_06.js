// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./camara_05.css";


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
  const canvasRef3 = useRef(null);
  const canvasRef4 = useRef(null);

  const numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [referencia, setReferencia] = useState(randomElement(numArray));
  let [results, setResults] = useState([]);
  let [results2, setResults2] = useState([]);
  const [points, setPoints] = useState(0);
  const [points2, setPoints2] = useState(0);
  const [timer, setTimer] = useState(90);

  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);

  // Detection Zone y Cuadrado
  const [x, setX] = useState(25);
  const [y, setY] = useState(25);
  const [x2, setX2] = useState(375);
  const [y2, setY2] = useState(25);
  const [width, setWidth] = useState(240);
  const [height, setHeight] = useState(240);

  // Main function

  useEffect(() => {
    const runModel = async () => {
      const num_model_04 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-04/main/model.json";
      const num_model_06 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-06/main/model.json";
      const num_model_06_B = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-06-B/main/model.json";

      const model = await tf.loadGraphModel(num_model_04);
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

            canvasRef3.current.width = videoWidth;
            canvasRef3.current.height = videoHeight;

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

            const canvas3 = document.getElementById("canvas3");

            // Draw Detection Zone
            const ctx3 = canvasRef3.current.getContext("2d");
            ctx3.drawImage(video, x2, y2, width, height, 0, 0, 640, 480);

            // Make Detections
            const img2 = tf.browser.fromPixels(canvas3)
            const resized2 = tf.image.resizeBilinear(img2, [56, 56])
            const expanded2 = resized2.expandDims(0)
            const obj2 = await model.execute(expanded2)
            const predictedValue2 = argMax(obj2.arraySync()[0]);
            results2.push(predictedValue2);
            setResults2(results2.slice(-10));
            results2 = results2.slice(-10);

            // Draw Cuadrado y Results
            const labelMap = {
              0: { name: '0', color: 'purple' },
              1: { name: '1', color: 'red' },
              2: { name: '2', color: 'yellow' },
              3: { name: '3', color: 'lime' },
              4: { name: '4', color: 'blue' },
              5: { name: '5', color: 'orange' },
              6: { name: '6', color: 'black' },
              7: { name: '7', color: 'white' },
              8: { name: '8', color: 'darkred' },
              9: { name: '9', color: 'darkblue' },
            }

            const drawRect = (predictedValue, predictedValue2, ctx2, ctx4, x, x2, y, y2, width, height) => {
              // Set styling
              ctx2.strokeStyle = labelMap[predictedValue]['color']
              ctx2.lineWidth = 1
              ctx2.fillStyle = labelMap[predictedValue]['color']
              ctx2.font = '70px Arial'

              // Set styling
              ctx2.strokeStyle = labelMap[predictedValue]['color']
              ctx2.lineWidth = 1
              ctx2.fillStyle = labelMap[predictedValue]['color']
              ctx2.font = '70px Arial'

              // DRAW!!
              ctx2.beginPath();
              ctx2.rect(x, y, width, height);
              ctx2.fillText(labelMap[predictedValue]['name'], (x + (width / 2.5)), (y + 310));
              ctx2.stroke();

              // DRAW!!
              ctx2.beginPath();
              ctx2.rect(x2, y2, width, height);
              ctx2.fillText(labelMap[predictedValue2]['name'], (x2 + (width / 2.5)), (y2 + 310));
              ctx2.stroke();

            }
            const ctx2 = canvasRef2.current.getContext("2d");
            const ctx4 = canvasRef4.current.getContext("2d");
            requestAnimationFrame(() => { drawRect(predictedValue, predictedValue2, ctx2, ctx4, x, x2, y, y2, width, height) });

            tf.dispose(img);
            tf.dispose(resized);
            tf.dispose(expanded);
            tf.dispose(obj);
            tf.dispose(predictedValue);

            tf.dispose(img2);
            tf.dispose(resized2);
            tf.dispose(expanded2);
            tf.dispose(obj2);
            tf.dispose(predictedValue2);
          }
        };
        detect(model)
      }, 200);
      return () => clearInterval(myInterval)
    };
    runModel();
  }, []);

  useEffect(() => {
    if (results.filter(x => x === referencia).length === 7) {
      setResults([]);
      if (timer > 0 && start) {
        setPoints(points + 1);
        setReferencia(randomElement(numArray));
      }
      else if (timer === 0 && start) {
        setReferencia(randomElement(numArray));
      }
    }
    else if (timer <= 0 && start) {
      setEnd(true);
    }
  }, [results]);

  useEffect(() => {
    if (results2.filter(x => x === referencia).length === 7) {
      setResults2([]);
      if (timer > 0 && start) {
        setPoints2(points2 + 1);
        setReferencia(randomElement(numArray));
      }
      else if (timer === 0 && start) {
        setReferencia(randomElement(numArray));
      }
    }
    else if (timer <= 0 && start) {
      setEnd(true);
    }
  }, [results2]);

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
          ref={canvasRef4}
          id="canvas4"
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

        <canvas
          ref={canvasRef3}
          id="canvas3"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: -3500,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

        <div className="left_side">
          <div className="left_up">
            <div className="left_up_mono"><img className={end ? "camara_mono camara_mono_salta" : "camara_mono"} src={require("./mascots/monohojas.png")}></img></div>
            <div className="left_up_points">
              <div><p className="timer">{timer < 10 ? "Time: 0" + timer : "Time: " + timer}</p></div>
              <div><p className="points">{"Points A: " + points}</p></div>
              <div><p className="points">{"Points B: " + points2}</p></div>
            </div>
          </div>
          <div className="left_center">
            <img className="num_ejemplo" src={require("./global_camara/" + referencia + ".png")}></img>
            <img className="img_ejemplo" src={require("./global_camara/" + referencia + "B.png")}></img>
          </div>
        </div>
        <button className="btn-exit" onClick={() => { }}>EXIT</button>
      </div>
    );
  }
  else if (!start) {
    return (
      <div className="App">

        <Webcam
          className="web"
          ref={webcamRef}
          muted={true}
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
          ref={canvasRef4}
          id="canvas4"
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

        <canvas
          ref={canvasRef3}
          id="canvas3"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: -3500,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

        <div className="left_side">
          <div className="left_up">
            <div className="left_up_mono"><img className="camara_mono" src={require("./mascots/monohojas.png")}></img></div>
            <div className="left_up_points">
              <div><p className="timer">{timer < 10 ? "Time: 0" + timer : "Time: " + timer}</p></div>
              <div><p className="points">{"Points A: " + points}</p></div>
              <div><p className="points">{"Points B: " + points2}</p></div>
            </div>
          </div>
          <div className="left_start">
            <button className="btn_start" onClick={() => { setStart(!start); setTimer(timer + 1); setReferencia(randomElement(numArray)) }}>START</button>
            <button className="btn_exit" onClick={() => { }}>MENU</button>
          </div>
        </div>
      </div>
    )
  }
}

export default App;