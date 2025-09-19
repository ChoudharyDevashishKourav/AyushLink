// App.tsx
import React, { useCallback, useState } from 'react';
import MicRecorder from '../components/MicRecorder';
import OpenRouterFhirExtractor from '../components/OpenRouterFhirExtractor';
import FhirEhrViewer from '../components/FhirEhrViewer';

export default function Speak() {
  const [transcript, setTranscript] = useState<string>('');
  const [bundle, setBundle] = useState<Record<string, unknown> | null>(null);

  const handleTranscribed = useCallback((text: string) => {
    setTranscript(text);      // triggers extractor
    setBundle(null);          // reset any prior bundle
    console.log(text);
  }, []);

  const handleFhirResult = useCallback((data: Record<string, unknown>) => {
    setBundle(data);          // store the parsed JS object
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* 1) Record & transcribe */}
      <MicRecorder
        uploadUrl="transcribe"          // adjust to match backend path
        onTranscribed={handleTranscribed}
        fieldName="file" 
        extraFields={{speakerId: '12345' }}
      />
      

      {/* 2) Headless extractor: shows only a thin loader & errors inside */}
      {!!transcript && (
        <OpenRouterFhirExtractor
          transcript={transcript}
          model="deepseek/deepseek-chat-v3.1:free"
          onResult={handleFhirResult}
          autoRun={true}
        />
      )}

      {/* 3) Render EHR once bundle is ready */}
      {!!bundle && <FhirEhrViewer bundle={bundle} />}
    </div>
  );
}
