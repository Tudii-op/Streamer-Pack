// index.js - test package
console.log("Video Capture Package Loaded!");

// Example function that returns some data
function captureInfo() {
  return {
    name: "Video Capture Test Package",
    version: "0.1.0",
    description: "This is just a test package for your Tauri store"
  };
}

// Export it (so if your Tauri app or Node imports it later, it works)
module.exports = { captureInfo };

// Test
console.log(captureInfo());