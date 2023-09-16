// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function

  const runCoco = async () => {
    let model_URL = "file:///model-js-04/model.json";
    let model_URL_1 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-04/main/model.json";
    let model_URL_2 = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json";
    const model = await tf.loadGraphModel(model_URL_1);
    console.log("Model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(model);
    }, 16.7);
  };

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

      // Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640, 480])
      const casted = resized.cast("int32")
      const expanded = casted.expandDims(0)
      const obj = await model.executeAsync(expanded)
      console.log(obj)


      const boxes = await obj[1].array()
      const classes = await obj[2].array()
      const scores = await obj[4].array()

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      // drawRect(obj, ctx);
      requestAnimationFrame(() => { drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx) });

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
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
