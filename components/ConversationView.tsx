import React from 'react';

interface Message {
  speaker: 'user' | 'agent';
  text: string;
}

interface ConversationViewProps {
  history: Message[];
}

const ConversationView: React.FC<ConversationViewProps> = ({ history }) => {
  return (
    <div className="conversation-container">
      {history.map((message, index) => (
        <div key={index} className={`message ${message.speaker}`}>
          <p><strong>{message.speaker}:</strong> {message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ConversationView;
