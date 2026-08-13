import { useState } from 'react';
import Sidebar from '../../components/User/Sidebar';
import {
  ChatHistoryPanel,
  ChatMainArea,
  ChatRightPanel,
  ChatTopBar,
} from '../../components/User/ChatWidgets';

export default function ChatAI() {
  const [activeChatId, setActiveChatId] = useState(null);   // null = new chat
  const [pendingPrompt, setPendingPrompt] = useState(null);  // Quick topic click

  const handleNewChat = () => {
    setActiveChatId(null);
    setPendingPrompt(null);
  };

  const handleClear = () => {
    setActiveChatId(null);
    setPendingPrompt(null);
  };

  // Called by ChatMainArea when a new chat session gets its MongoDB _id
  const handleChatCreated = (newChatId) => {
    setActiveChatId(newChatId);
  };

  // Called when a quick topic card is clicked in ChatRightPanel
  const handleTopicSelect = (prompt) => {
    setActiveChatId(null);       // Start a new chat
    setPendingPrompt(prompt);    // Inject the prompt
  };

  return (
    <div className="page-wrapper">
      {/* Left Nav Sidebar */}
      <div className="sidebar-wrapper"><Sidebar /></div>

      {/* Chat History Panel */}
      <div className="chat-history-wrapper">
        <ChatHistoryPanel
          activeId={activeChatId}
          onSelect={setActiveChatId}
          onNewChat={handleNewChat}
          onClear={handleClear}
        />
      </div>

      {/* Center: Top Bar + Chat Messages + Input */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ChatTopBar onNewChat={handleNewChat} />
        <ChatMainArea
          key={activeChatId}
          activeChatId={activeChatId}
          onChatCreated={handleChatCreated}
          pendingPrompt={pendingPrompt}
          onPromptConsumed={() => setPendingPrompt(null)}
        />
      </div>

      <div className="chat-right-wrapper">
        <ChatRightPanel onTopicSelect={handleTopicSelect} />
      </div>
    </div>
  );
}

