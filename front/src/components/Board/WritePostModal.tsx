// front/src/components/Board/WritePostModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Post } from './types';

interface WritePostModalProps {
  selectedDate: Date | null;
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'createdAt'>) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 200px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${(props) => (props.$primary ? '#007bff' : '#6c757d')};
  color: white;

  &:hover {
    background-color: ${(props) => (props.$primary ? '#0056b3' : '#5a6268')};
  }
`;

function WritePostModal({ selectedDate, onClose, onSubmit }: WritePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }

    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>글쓰기</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', color: '#666' }}>
            작성일: {selectedDate ? selectedDate.toLocaleDateString() : '날짜를 선택해주세요'}
          </div>
          <Input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <TextArea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" $primary>
              작성
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default WritePostModal;
