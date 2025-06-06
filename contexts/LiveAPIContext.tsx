/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useLiveApi, UseLiveApiResults } from '../hooks/media/use-live-api';

export interface ConversationEntry {
  speaker: 'user' | 'agent';
  text: string;
}

export interface LiveAPIContextValue extends UseLiveApiResults {
  conversationHistory: ConversationEntry[];
  addConversationEntry: (entry: ConversationEntry) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

const LiveAPIContext = createContext<LiveAPIContextValue | undefined>(undefined);

export type LiveAPIProviderProps = {
  children: ReactNode;
  apiKey: string;
};

export const LiveAPIProvider: FC<LiveAPIProviderProps> = ({
  apiKey,
  children,
}) => {
  const liveAPI = useLiveApi({ apiKey });
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [isListening, setIsListening] = useState(false);

  const addConversationEntry = (entry: ConversationEntry) => {
    setConversationHistory(prevHistory => [...prevHistory, entry]);
  };

  useEffect(() => {
    const { client } = liveAPI;
    // Handler for processing 'content' events from the client
    const handleContent = (data: any) => { // TODO: Add proper typing for LiveServerContent
      // Process agent response
      if (data.modelTurn && data.modelTurn.parts) {
        data.modelTurn.parts.forEach((part: any) => { // TODO: Add proper typing for part
          if (part.text) {
            addConversationEntry({ speaker: 'agent', text: part.text });
          }
        });
      }

      // Process user transcript
      if (data.userTurn && data.userTurn.parts) {
        data.userTurn.parts.forEach((part: any) => { // TODO: Add proper typing for part
          if (part.text) {
            addConversationEntry({ speaker: 'user', text: part.text });
          }
        });
      }
    };

    client.on('content', handleContent);

    return () => {
      client.off('content', handleContent);
    };
  }, [liveAPI, addConversationEntry]);

  useEffect(() => {
    // Request microphone permission when component mounts
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('Microphone permission granted');
        stream.getTracks().forEach(track => track.stop()); // Stop the stream since we don't need it yet
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
      });
  }, []);

  const contextValue: LiveAPIContextValue = {
    ...liveAPI,
    conversationHistory,
    addConversationEntry,
    isListening,
    setIsListening,
  };

  return (
    <LiveAPIContext.Provider value={contextValue}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPIContext = (): LiveAPIContextValue => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error('useLiveAPIContext must be used wihin a LiveAPIProvider');
  }
  return context;
};
