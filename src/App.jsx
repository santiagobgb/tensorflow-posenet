import { useEffect, useRef } from 'react';
import './App.css';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import { drawKeypoints } from './utilities';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runPosenet = async () => {
      const net = await posenet.load();
      const video = webcamRef.current.video;

      // Wait for the video metadata to be loaded
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const detectPose = async () => {
        // Log pose for debugging
        const pose = await net.estimateSinglePose(tf.browser.fromPixels(video), {
          flipHorizontal: false,
        });
        console.log('Pose:', pose);
      
        // Set canvas dimensions based on video dimensions
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      
        // Clear canvas
        ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
      
        // Draw keypoints directly on the canvas
        pose.keypoints.forEach(({ position, score, part }) => {
          if (score > 0.5) {
            const { x, y } = position;
      
            // Draw a red circle at the keypoints
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
      
            // Display the part name next to the keypoints
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.fillText(part, x, y - 5);
          }
        });
      
      
        // Display canvas dimensions in console for debugging
        console.log('Canvas dimensions:', video.videoWidth, video.videoHeight);
      };
      
      // Main animation loop
      setInterval(detectPose, 1000);
    };

    // Run the PoseNet setup
    runPosenet();
  }, []);

  return (
    <>
      <Webcam
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 640,
          height: 480,
        }}
        ref={webcamRef}
      />
      <canvas
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 640,
          height: 480,
        }}
        ref={canvasRef}
      ></canvas>
    </>
  );
}

export default App;

