import React from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BoardHeader = styled.div`
  margin-bottom: 20px;
`;

const BoardTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const MessageItem = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  background: white;
`;

const MessageInput = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

interface Message {
  id: number;
  content: string;
  userId: string;
  timestamp: Date;
}

interface BoardProps {
  selectedDate: Date | null;
}

function Board({ selectedDate }: BoardProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState<string>('');

  const onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      content: newMessage,
      userId: 'currentUser', //TODO : 실제 사용자 아이디 넣기
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };
  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>게시판 - {selectedDate?.toLocaleDateString()}</BoardTitle>
      </BoardHeader>
      <MessageList>
        {messages.map((message) => (
          <MessageItem key={message.id}>
            <div>{message.content}</div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>
              {message.timestamp.toLocaleString()}
            </div>
          </MessageItem>
        ))}
      </MessageList>
      <MessageInput>
        <Input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={newMessage}
          onChange={onChangeMessage}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage}
        />
        <SendButton onClick={handleSendMessage}>전송</SendButton>
      </MessageInput>
    </BoardContainer>
  );
}

export default Board;
