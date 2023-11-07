import React, { useState, useRef } from "react";
import { startTimer, stopTimer } from "../utility/timer";
import styles from '../css/Camera.module.css'

const CameraModal = ({ show, onHide }) => {
    const [showCamera, setShowCamera] = useState(true);
    const [showInputField, setShowInputField] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [showPreviewVideo, setShowPreviewVideo] = useState(false);
    const [recordingButton, setRecordingButton] = useState(false);
    const [showDiscardButton, setShowDiscardButton] = useState(false);
    const [showRetakeButton, setShowRetakeButton] = useState(false);
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            setShowCamera(false);
            setRecordingButton(true);
            setStream(stream);
        } catch (error) {
            console.error("Error accessing the camera:", error);
        }
    };

    const toggleRecording = () => {
        if (!stream) {
            console.error("No media stream available for recording.");
            return;
        }

        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        try {
            setShowInputField(false);


            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
                ? 'video/webm;codecs=vp9,opus'
                : 'video/webm';

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;

            const recordedChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            // startTimer(60);

            mediaRecorder.onstop = () => {
                const recordedBlob = new Blob(recordedChunks, { type: mimeType });
                const recordedVideoURL = URL.createObjectURL(recordedBlob);
                videoRef.current.src = recordedVideoURL;

                document.getElementById("previewVideo").src = videoRef.current.src;
                const downloadLink = document.createElement("a");
                downloadLink.id = "video_download";
                downloadLink.href = videoRef.current.src;
                downloadLink.download = "recorded_video.webm";
                downloadLink.innerText = "Download Your video";

                document.getElementById("video").appendChild(downloadLink);
            };

            mediaRecorder.start();
            // timerId = setTimeout(stopperFunction, 60500);

            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        try {
            videoRef.current.srcObject = null;
            const mediaRecorder = mediaRecorderRef.current;
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
            
            // stopTimer();
            setStream(null);
            setShowPreviewVideo(true);
            setIsRecording(false);
            setShowDiscardButton(true);
            setShowRetakeButton(true);
            setRecordingButton(false);
        } catch (error) {
            console.error("Error while stopping the recording:", error);
        }
    };

    const retakeVideo = () => {
        setShowDiscardButton(false);
        setShowRetakeButton(false);
        setShowPreviewVideo(false);
        setShowCamera(true);

        const downloadLink = document.getElementById("video_download");
        if (downloadLink) {
            downloadLink.remove();
        }
    };

    const discardVideo = () => {
        setShowInputField(true);
        setShowCamera(true);
        setShowDiscardButton(false);
        setShowRetakeButton(false);
        setShowPreviewVideo(false);
    
        const downloadLink = document.getElementById("video_download");
        if (downloadLink) {
            downloadLink.remove();
        }
    };

    return (
        show && (
            <div className="modal show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Upload or Record Your Video</h5>
                            <button type="button" className={styles.close} onClick={onHide}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* for preview video */}
                            <video className="preview_video"   id={styles.preview_video}
                                style={{ display: (showPreviewVideo && !isRecording) ? "block" : "none" }}
                                controls
                                playsInline>
                            </video>
                            {/* for video */}
                            <div id="video">
                                <label htmlFor="video">Introductory Video (MP4, max 100MB, max 1 minute):</label>
                                <span id="videoError" className="error"></span>
                                <br />
                                <div id="recording-instructions">
                                    <ul>
                                        <li>Self-Introduction and Educational background.</li>
                                        <li>Work experience (if any).</li>
                                        <li>Talk about personal interests or hobbies.</li>
                                        <li>Share any additional information you'd like to.</li>
                                    </ul>
                                </div>
                                {/* for video input */}
                                <input
                                    type="file"
                                    id="input_video"
                                    accept="video/mp4"
                                    style={{ display: showInputField ? "block" : "none" }}
                                    required
                                />
                                {/* for discard & retake button */}
                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        id="discard-video"
                                        style={{ display: showDiscardButton ? "block" : "none" }}
                                        className="btn btn-danger text-white border-0 px-4"
                                        onClick={discardVideo}
                                    >
                                        Discard Video
                                    </button>
                                    <button
                                        id="retake-video"
                                        style={{ display: showRetakeButton ? "block" : "none" }}
                                        className="btn btn-warning text-white border-0 px-4"
                                        onClick={retakeVideo}
                                    >
                                        Retake Video
                                    </button>
                                </div>
                                {/* div............ */}
                                <div>
                                    <div>
                                        {/* for camera and  start stop recording */}
                                        <button id="startCamera" className="btn btn-primary text-white border-0 px-4"
                                            style={{ display: showCamera ? "block" : "none" }}
                                            onClick={startCamera}>
                                            Start Camera
                                        </button>
                                        <button onClick={toggleRecording} style={{ display: recordingButton ? "block" : "none" }}>
                                            {isRecording ? "Stop Recording" : "Start Recording"}
                                        </button>
                                        <video
                                            style={{ display: stream ? "block" : "none"  }}
                                            className={styles.camera_video}
                                            id="recordedVideo"
                                            autoPlay
                                            playsInline
                                            muted
                                            ref={videoRef}
                                        ></video>
                                    </div>
                                    <div id="timer" style={{ display: "none" }}>
                                        Starting
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* for close and upload button */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" style={{ display: "none" }}>
                                Close
                            </button>
                            <button type="button" className="btn btn-success" onClick={onHide}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default CameraModal;
