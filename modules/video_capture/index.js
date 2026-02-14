import { invoke } from "@tauri-apps/api/tauri";

export default {
  name: "Video Capture",

  async start() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      await invoke("save_video_chunk", { data: Array.from(new Uint8Array(arrayBuffer)) });
    };

    mediaRecorder.start();
    this.recorder = mediaRecorder;
  },

  stop() {
    if (this.recorder) this.recorder.stop();
  }
};
