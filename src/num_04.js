// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./draw_num_3";


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

  const numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [referencia, setReferencia] = useState(3);
  let [results, setResults] = useState([]);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(20);
  const [start, setStart] = useState(false);

  // Main function

  useEffect(() => {
    const runModel = async () => {
      const num_model_04 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-04/main/model.json";
      const num_model_06 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-06/main/model.json";

      const model = await tf.loadGraphModel(num_model_06);
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

            // const frame = webcamRef.current.getScreenshot()
            const canvas = document.getElementById("canvas");

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            ctx.drawImage(video, 25, 25, 320, 240, 0, 0, 640, 480);

            // Make Detections
            const img = tf.browser.fromPixels(canvas)
            const resized = tf.image.resizeBilinear(img, [56, 56])
            const expanded = resized.expandDims(0)
            const obj = await model.execute(expanded)
            const predictedValue = argMax(obj.arraySync()[0]);
            results.push(predictedValue);
            setResults(results.slice(-5));
            results = results.slice(-5);

            // Draw mesh
            const canvas2 = document.getElementById("canvas2");
            const ctx2 = canvasRef2.current.getContext("2d");

            requestAnimationFrame(() => { drawRect(predictedValue, ctx2) });

            tf.dispose(img);
            tf.dispose(resized);
            tf.dispose(expanded);
            tf.dispose(obj);
            tf.dispose(predictedValue);
          }
        };
        detect(model)
      }, 500);
      return () => clearInterval(myInterval)
    };
    runModel();
  }, []);

  useEffect(() => {
    if (results.filter(x => x == referencia).length == 4) {
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

  if (!start) {
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
      <img className="img_ejemplo" src={require("./SignosNumeros/" + referencia + ".jpg")}></img>
      <div><p className="num_ejemplo">{referencia}</p></div>
      <div><p className="points">{points}</p></div>
      <div><p className="timer">{timer < 10 ? "0" + timer : timer}</p></div>
      <button className="btn" onClick={() => { setStart(!start); setTimer(timer+1)}}>START</button>
    </div>
    )
  }

  else return (
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
      <img className="img_ejemplo" src={require("./SignosNumeros/" + referencia + ".jpg")}></img>
      <div><p className="num_ejemplo">{referencia}</p></div>
      <div><p className="points">{points}</p></div>
      <div><p className="timer">{timer < 10 ? "0" + timer : timer}</p></div>
    </div>
  );
}

export default App;