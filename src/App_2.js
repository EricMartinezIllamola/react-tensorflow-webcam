// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities_2";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  // Main function

  const runCoco = async () => {

    let model_URL = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-04/main/model.json";

    // let model_URL_1 = "file:///model-js-04/model.json";
    // let model_URL_2 = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json";

    const model = await tf.loadGraphModel(model_URL);
    console.log("Model loaded.");

    //  Loop and detect hands
    setInterval(() => {
      detect(model);
    }, 500);
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

      // const [url, setUrl] = useState(null)

      // React.useCallback(
      //   async () => {
      //     const imageSrc = webcamRef.current.getScreenshot();
      //     setUrl(imageSrc)
      //   },
      //   [webcamRef]
      // );

      // const imageSrc = webcamRef.current.getScreenshot()

      // const ctx_2 = canvasRef.current.getContext("2d");
      // drawRect(obj, ctx);
      // const image = ctx_2.drawImage(video, 0, 0, 250, 250, 50, 50, 250, 250);
      // const image = ctx_2.drawImage(imageSrc);



      // const cuadrado = video[top:bottom, right:left]

      // const frame = webcamRef.current.getScreenshot()

      // Make Detections
      const img = tf.browser.fromPixels(video)
      // console.log(img)
      const resized = tf.image.resizeBilinear(img, [56, 56])
      // console.log(resized)
      // const casted = resized.cast("int32")
      // console.log(casted)
      const expanded = resized.expandDims(0)
      // console.log(expanded)
      const obj = await model.execute(expanded)
      obj.print()
      const predictedValue = argMax(obj.arraySync()[0]);
      console.log(predictedValue);

      // console.log(obj)


      // const classes = await obj[2].array()
      // console.log(classes)
      // const scores = await obj[4].array()

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      // drawRect(obj, ctx);
      ctx.drawImage(video, 0, 0, 250, 250, 50, 50, 250, 250);
      // ctx.drawImage(url);
      requestAnimationFrame(() => { drawRect(predictedValue, ctx) });

      tf.dispose(img);
      tf.dispose(resized);
      // // tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
      tf.dispose(predictedValue);
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
          // mirrored={true}  
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 400,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          // mirrored={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: -500,
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