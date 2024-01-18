import { useEffect, useRef } from 'react';
import './App.css';
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from './utilities'

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runPosenet = async () => {
      const net = await posenet.load();

      setInterval(() => {
        detectPose(net);
      }, 1000);
    };

    const detectPose = async (net) => {
      
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = video.width;
        const videoHeight = video.height;
        
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const pose = await net.estimateSinglePose(video);
        console.log(pose);
       
        drawCanvas(pose,video,videoWidth,videoHeight);
        
        
      }
    };

    const drawCanvas = ( pose, video, videoWidth, videoHeight, canvas) =>{
      const ctx = canvas.getContext('2d')
      canvas.current.width = videoWidth;
      canvas.height = videoHeight;
      drawKeypoints(pose["keypoints"], 0.5, ctx);
      drawSkeleton(pose["keypoints"], 0.5, ctx);
    }

    runPosenet();
  }, []);


  return (
    <>
      <Webcam
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}
       
        ref={webcamRef}
      />
      <canvas
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}
        ref={canvasRef}
      />
        
    </>
  )
}

export default App
