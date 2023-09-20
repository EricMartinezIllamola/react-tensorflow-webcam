// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./draw_global_2";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  // Main function

  const runCoco = async () => {

    let global_model_02 = "https://raw.githubusercontent.com/EricMartinezIllamola/global-model-02/main/model.json";
    let global_model_03 = "https://raw.githubusercontent.com/EricMartinezIllamola/global-model-03/main/model.json";

    // let model_URL_1 = "file:///model-js-04/model.json";
    // let model_URL_2 = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json";

    const model = await tf.loadGraphModel(global_model_03);
    console.log("Model loaded.");

    //  Loop and detect hands
    setInterval(() => {
      detect(model);
    }, 100);
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

      canvasRef2.current.width = videoWidth;
      canvasRef2.current.height = videoHeight;

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
      const canvas = document.getElementById("canvas");

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(video, 25, 25, 320, 240, 0, 0, 640, 480);
      // var recuadro = canvas.toDataURL("image/jpeg");
      // console.log(recuadro)
      // const img2 = tf.browser.fromPixels(canvas)
      // console.log(img2)

      // Make Detections
      const img = tf.browser.fromPixels(canvas)
      console.log(img)
      const resized = tf.image.resizeBilinear(img, [56, 56])
      // console.log(resized)
      // const casted = resized.cast("int32")
      // console.log(casted)
      const expanded = resized.expandDims(0)
      // console.log(expanded)
      const obj = await model.execute(expanded)
      // obj.print()
      const predictedValue = argMax(obj.arraySync()[0]);
      // console.log(predictedValue);

      // console.log(obj)


      // const classes = await obj[2].array()
      // console.log(classes)
      // const scores = await obj[4].array()

      const canvas2 = document.getElementById("canvas2");
      // Draw mesh
      const ctx2 = canvasRef2.current.getContext("2d");

      // ctx.drawImage(url);
      requestAnimationFrame(() => { drawRect(predictedValue, ctx2) });

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
            left: 700,
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
            left: -650,
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
            // top: 0,
            left: 700,
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