import React, { useState } from 'react';
import styled from 'styled-components';
import { Post } from './types';
import { fetchWithAuth } from '../../util/auth';

interface BoardDetailProps {
  post: Post;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, content: string) => void;
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
  max-height: 80vh;
  overflow-y: auto;
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

const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const PostContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${(props) => {
    if (props.$danger) return '#dc3545';
    if (props.$primary) return '#007bff';
    return '#6c757d';
  }};
  color: white;

  &:hover {
    background-color: ${(props) => {
      if (props.$danger) return '#c82333';
      if (props.$primary) return '#0056b3';
      return '#5a6268';
    }};
  }
`;

const EditForm = styled.form`
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

function BoardDetail({ post, onClose, onDelete, onUpdate }: BoardDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        // 토큰이 있는지 확인
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        await fetchWithAuth(`http://localhost:8000/boards/${post.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        onDelete(post.id);
        onClose();
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        // 인증 관련 오류가 아닌 경우에만 알림 표시
        if (!(error instanceof Error && error.message.includes('로그인 페이지로 이동'))) {
          alert('게시글 삭제에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
        }
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 토큰이 있는지 확인
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      await fetchWithAuth(`http://localhost:8000/boards/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      onUpdate(post.id, title, content);
      setIsEditing(false);
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
      // 인증 관련 오류가 아닌 경우에만 알림 표시
      if (!(error instanceof Error && error.message.includes('로그인 페이지로 이동'))) {
        alert('게시글 수정에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
      }
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{isEditing ? '게시글 수정' : '게시글 상세'}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {isEditing ? (
          <EditForm onSubmit={handleUpdate}>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <ButtonGroup>
              <Button type="button" onClick={() => setIsEditing(false)}>
                취소
              </Button>
              <Button type="submit" $primary>
                저장
              </Button>
            </ButtonGroup>
          </EditForm>
        ) : (
          <>
            <PostInfo>
              <span>작성자: {post.author}</span>
              <span>작성일: {new Date(post.date).toLocaleDateString()}</span>
            </PostInfo>
            <PostContent>{post.content}</PostContent>
            <ButtonGroup>
              <Button onClick={() => setIsEditing(true)}>수정</Button>
              <Button onClick={handleDelete} $danger>
                삭제
              </Button>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default BoardDetail;