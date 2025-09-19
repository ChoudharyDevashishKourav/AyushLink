import React, { useEffect, useRef, useState } from 'react';

type Props = {
  uploadUrl: string; // e.g. "/api/upload" in Spring Boot
  fieldName?: string; // multipart field name, default "file"
  extraFields?: Record<string, string>; // optional extra form fields
};

const MicRecorder: React.FC<Props> = ({ uploadUrl, fieldName = 'file', extraFields = {} }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [supportedMime, setSupportedMime] = useState<string>('audio/webm;codecs=opus');
  const token = localStorage.getItem('JWTS_TOKEN')

  useEffect(() => {
    // Pick a widely-supported audio MIME type
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4', // some browsers support this in 2024+, but not all
      'audio/ogg;codecs=opus'
    ];
    const picked = candidates.find((c) =>
      typeof MediaRecorder !== 'undefined' && (MediaRecorder as any).isTypeSupported
        ? MediaRecorder.isTypeSupported(c)
        : c === 'audio/webm;codecs=opus'
    ) || 'audio/webm;codecs=opus';
    setSupportedMime(picked);
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const options: MediaRecorderOptions = {};
      if (supportedMime) options.mimeType = supportedMime;

      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;

      chunksRef.current = [];

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mr.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: supportedMime });
          chunksRef.current = [];
          await uploadBlob(blob);
        } catch (e: any) {
          setError(e?.message || 'Upload failed');
        } finally {
          // Fully stop the tracks to clear the browser’s recording indicator
          mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      };

      mr.start();
      setIsRecording(true);
    } catch (e: any) {
      setError(e?.message || 'Microphone access failed');
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const uploadBlob = async (blob: Blob) => {
    const ext = supportedMime.includes('mp4') ? 'm4a' : supportedMime.includes('ogg') ? 'ogg' : 'webm';
    const file = new File([blob], `recording.${ext}`, { type: blob.type || supportedMime || 'application/octet-stream' });

    const form = new FormData();
    form.append(fieldName, file);
    Object.entries(extraFields || {}).forEach(([k, v]) => form.append(k, v));

    const res = await fetch(`http://localhost:8080/api/audio/${uploadUrl}`, {
      method: 'POST',
      body: form,
      headers: {
        
        'Authorization': `Bearer ${token}`,
      }
      // Do NOT set Content-Type; browser sets multipart boundary automatically
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Upload error ${res.status}: ${text || res.statusText}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={toggleRecording}
        className={`inline-flex items-center justify-center rounded-full h-14 w-14 transition
          ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-700'}
          text-white shadow`}
        aria-pressed={isRecording}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {/* Mic icon (Tailwind-styled SVG) */}
        {!isRecording ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21H9v2h6v-2h-2v-3.08A7 7 0 0 0 19 11h-2Z" />
          </svg>
        ) : (
          // Stop-circle icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2ZM9 9h6v6H9z" />
          </svg>
        )}
      </button>

      <div className="text-sm text-slate-600">
        {isRecording ? 'Recording...' : 'Tap to record'}
      </div>

      {!!error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default MicRecorder;
