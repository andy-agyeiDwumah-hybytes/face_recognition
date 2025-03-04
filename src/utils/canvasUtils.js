// const highBrightnessValue = 150;
// const mediumBrightnessValue = 110;
// const lowBrightnessValue = 80;

// SOLUTION 1
export const drawVideoFrameOnCanvas = videoRefCurrent => {
  // * Create a canvas to capture a fresh snapshot from the video
  // * Passing video element (i.e., videoRef.current)
  // * directly into FaceAPI does not create a fresh detections.descriptor
  const canvas = document.createElement("canvas");
  canvas.width = videoRefCurrent.videoWidth;
  canvas.height = videoRefCurrent.videoHeight;
  const ctx = canvas.getContext("2d");

  // Draw the current video frame onto the canvas
  ctx.drawImage(videoRefCurrent, 0, 0, canvas.width, canvas.height);
  return canvas;
};

/////////////////////////////////////////////////////

// SOLUTION 2
// Function to calculate the average brightness of an image on a canvas
// function getAverageBrightness(ctx, width, height) {
//   const imageData = ctx.getImageData(0, 0, width, height);
//   const data = imageData.data;
//   console.log("Image data", data)
//   let total = 0;
//   // Sum the brightness of all pixels (simple average of RGB)
//   for (let i = 0; i < data.length; i += 4) {
//     // Use luminosity formula: 0.299*R + 0.587*G + 0.114*B
//     total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
//   }
//   return total / (width * height);
// }

// export const drawVideoFrameOnCanvas = videoRefCurrent => {
//   const canvas = document.createElement("canvas");
//   canvas.width = videoRefCurrent.videoWidth;
//   canvas.height = videoRefCurrent.videoHeight;
//   const ctx = canvas.getContext("2d");

//   ctx.drawImage(videoRefCurrent, 0, 0, canvas.width, canvas.height);
  
//   // Calculate average brightness
//   const avgBrightness = getAverageBrightness(ctx, canvas.width, canvas.height);
//   console.log(avgBrightness)

//   // const brightnessValue = avgBrightness < 100 ? "250%" : "100%";
//   const brightnessValue =
//     avgBrightness < lowBrightnessValue
//       ? "150%"
//       : avgBrightness > highBrightnessValue
//       ? `${mediumBrightnessValue}%`
//       : "110%";

//   ctx.filter = `brightness(${brightnessValue})`;
//   ctx.drawImage(videoRefCurrent, 0, 0, canvas.width, canvas.height);
//   return canvas;
// };