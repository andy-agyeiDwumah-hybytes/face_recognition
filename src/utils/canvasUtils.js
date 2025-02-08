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
