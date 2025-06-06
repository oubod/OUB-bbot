/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef, useState } from 'react';
import { Modality } from '@google/genai';

import BasicFace from '../basic-face/BasicFace';
import ConversationView from '../../ConversationView';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { createSystemInstructions } from '@/lib/prompts';
import { useAgent, useUser } from '@/lib/state';

export default function KeynoteCompanion() {
  const { client, connected, setConfig, conversationHistory, addConversationEntry, isListening } = useLiveAPIContext();
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const user = useUser();
  const { current } = useAgent();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set the configuration for the Live API
  useEffect(() => {
    setConfig({
      responseModalities: [Modality.AUDIO, Modality.TEXT],
      inputModalities: [Modality.SPEECH, Modality.TEXT], // Assuming SPEECH is a valid Modality
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: current.voice },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: createSystemInstructions(current, user),
          },
        ],
      },
    });
  }, [setConfig, user, current]);

  // Initiate the session when the Live API connection is established
  // Instruct the model to send an initial greeting message
  useEffect(() => {
    const beginSession = async () => {
      if (!connected) return;
      client.send(
        {
          text: 'Greet the user and introduce yourself and your role.',
        },
        true
      );
      // Add a mock agent response for testing
      addConversationEntry({ speaker: 'agent', text: 'Hello! I am your keynote companion.' });
    };
    beginSession();
  }, [client, connected, addConversationEntry]);

  const mobileBreakpoint = 768;

  return (
    <div
      className="keynote-companion"
      style={{
        display: 'flex',
        flexDirection: screenWidth < mobileBreakpoint ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        gap: '1rem',
        padding: screenWidth < mobileBreakpoint ? '70px 1rem 1rem 1rem' : '2rem', // Added top padding for mobile header
        boxSizing: 'border-box', // Ensure padding is included in height/width
      }}
    >
      <div style={{
        flex: screenWidth < mobileBreakpoint ? '0 1 auto' : '1 1 50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: screenWidth < mobileBreakpoint ? '70vw' : 'none', // Constrain width on mobile
        maxHeight: screenWidth < mobileBreakpoint ? '30vh' : 'none', // Constrain height on mobile
        padding: screenWidth < mobileBreakpoint ? '0.5rem' : '0', // Add some padding around face on mobile
      }}>
        <BasicFace
          canvasRef={faceCanvasRef!}
          color={current.bodyColor}
          isListening={isListening}
        />
      </div>
      <div style={{
        flex: screenWidth < mobileBreakpoint ? '1 1 auto' : '1 1 50%',
        width: '100%',
        maxHeight: screenWidth < mobileBreakpoint ? 'calc(50vh - 70px)' : '100%', // Adjusted for top padding
        overflowY: 'auto',
        padding: screenWidth < mobileBreakpoint ? '0.5rem' : '0', // Add some padding for conversation on mobile
      }}>
        <ConversationView history={conversationHistory} />
      </div>
    </div>
  );
}
