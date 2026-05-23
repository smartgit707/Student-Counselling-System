import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                onRecordingComplete(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
            
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const clearAudio = () => {
        setAudioURL('');
        setRecordingTime(0);
        onRecordingComplete(null);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="card bg-gray-50 border border-gray-200 p-4 mb-4 flex flex-col items-center justify-center rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-gray-700">Voice Note (Optional)</h4>
            
            {!audioURL && (
                <div className="flex items-center space-x-4">
                    {!isRecording ? (
                        <button 
                            type="button" 
                            onClick={startRecording}
                            className="btn btn-primary rounded-full w-12 h-12 flex items-center justify-center"
                            title="Start Recording"
                        >
                            <Mic size={24} />
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            onClick={stopRecording}
                            className="btn btn-danger rounded-full w-12 h-12 flex items-center justify-center animate-pulse"
                            title="Stop Recording"
                        >
                            <Square size={24} />
                        </button>
                    )}
                    {isRecording && (
                        <span className="text-red-500 font-mono text-lg">{formatTime(recordingTime)}</span>
                    )}
                </div>
            )}

            {audioURL && (
                <div className="w-full flex items-center justify-between space-x-2">
                    <audio src={audioURL} controls className="flex-1 h-10 rounded-md" />
                    <button 
                        type="button" 
                        onClick={clearAudio} 
                        className="btn btn-outline text-red-500 hover:bg-red-50"
                        title="Delete Recording"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
