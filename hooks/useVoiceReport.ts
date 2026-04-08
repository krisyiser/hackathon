"use client";

import { useState, useCallback, useRef } from 'react';
import { VoiceReportData } from '@/types';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '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';

export function useVoiceReport() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const processSpeech = async (text: string): Promise<VoiceReportData | null> => {
    setIsProcessing(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://motus.city",
          "X-Title": "MOTUS City",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages: [
            {
              role: "system",
              content: "Actúa como un extractor de datos de movilidad urbana. Del texto proporcionado, extrae un objeto JSON con las claves: 'incidente' (debe ser uno de: 'seguridad', 'emergencia', 'obstruccion', 'saturacion', 'entorno'), 'gravedad' (1-5) y 'ubicacion_relativa' (string describing location). Responde SOLO con el JSON."
            },
            {
              role: "user",
              content: text
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      return JSON.parse(content) as VoiceReportData;
    } catch (error) {
      console.error("Error processing speech with AI:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback((): Promise<VoiceReportData | null> => {
    return new Promise((resolve) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error("Speech Recognition not supported.");
        resolve(null);
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'es-MX';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      
      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLastTranscript(transcript);
        const result = await processSpeech(transcript);
        resolve(result);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        recognitionRef.current = null;
        resolve(null);
      };

      recognition.start();
    });
  }, []);

  return { isListening, isProcessing, lastTranscript, startListening, stopListening };
}
