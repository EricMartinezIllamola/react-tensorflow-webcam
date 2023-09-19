// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities_3";

let a = 0;

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
  let [referencia, setReferencia] = useState(3);
  // console.log(a++);
  let [results, setResults] = useState([]);
  let [points, setPoints] = useState(0);

  // Main function

  const runCoco = async () => {

    let model_URL = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-04/main/model.json";

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
      // console.log(img)
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
      results.push(predictedValue);
      // console.log(results);
      results.slice(-4)
      // console.log(results.filter(x => x == value).length);


      if (results.filter(x => x == referencia).length == 3) {
        const numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        setResults([]);
        setPoints(points + 1);
        results = [];
        points = points + 1;
        let rE = numArray[Math.floor(Math.random() * numArray.length)];
        setReferencia(rE);
        referencia = rE;
        // setValue(rE)
        console.log("rE"+rE);
        console.log(referencia);
      };

      // console.log(results);
      console.log(referencia);



      // console.log(obj)

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

      <Webcam
        className="web"
        ref={webcamRef}
        muted={true}
        // mirrored={true}  
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
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
          // top: 0,
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

    </div>
  );
}

export default App;