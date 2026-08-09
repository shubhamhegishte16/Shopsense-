import { useState } from 'react';
import Sidebar from '../../components/User/Sidebar';
import {
  ChatHistoryPanel,
  ChatMainArea,
  ChatRightPanel,
  ChatTopBar,
} from '../../components/User/ChatWidgets';

export default function ChatAI() {
  const [activeChat, setActiveChat] = useState(1);

  const handleNewChat = () => setActiveChat(null);
  const handleClear = () => setActiveChat(null);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#FAFCFC',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Left Nav Sidebar */}
      <Sidebar />

      {/* Chat History Panel */}
      <ChatHistoryPanel
        activeId={activeChat}
        onSelect={setActiveChat}
        onNewChat={handleNewChat}
        onClear={handleClear}
      />

      {/* Center: Top Bar + Chat Messages + Input */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ChatTopBar onNewChat={handleNewChat} />
        <ChatMainArea key={activeChat} />
      </div>

      {/* Right AI Panel */}
      <ChatRightPanel />
    </div>
  );
}
