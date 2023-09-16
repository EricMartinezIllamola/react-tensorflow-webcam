// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// const tfn = require("@tensorflow/tfjs-node");
// import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function

  const runCoco = async () => {
    let model_URL = "file://localhost:8080/model-js-04/model.json";
    let model_URL_0 = "model-js-04/model.json";
    let model_URL_1 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-04/main/model.json";
    let model_URL_2 = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json";
    // const handler = tfn.io.fileSystem("model.json");
    console.log("Started");
    const model = await tf.loadGraphModel(model_URL_1);
    console.log("Model loaded.");
    path_img = "Signos Numeros/1.jpg"
    const img = tf.browser.fromPixels(path_img)
    const resized = tf.image.resizeBilinear(img, [640, 480])
    const obj = await model.executeAsync(resized)
  };

  useEffect(() => { runCoco() }, []);


  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          className="web"
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
