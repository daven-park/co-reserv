import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import WritePostModal from './WritePostModal';
import BoardDetail from './BoardDetail';
import { Post } from './types';
import { fetchWithAuth, getUser } from '../../util/auth';

interface BoardProps {
  selectedDate: Date | null;
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #333;
`;

const WriteButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0056b3;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PostItem = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const PostTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
`;

const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #dc3545;
`;

const DateInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

function Board({ selectedDate }: BoardProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dateToUse = selectedDate || currentDate;
      const formattedDate = dateToUse.toISOString().split('T')[0]; // YYYY-MM-DD format

      const url = `http://localhost:8000/boards?date=${formattedDate}`;

      const response = await fetchWithAuth(url);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        }
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('다시 로그인')) {
        // 로그인 페이지로 리다이렉트하는 로직 추가 필요
        window.location.href = '/login';
      } else {
        setError(error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const dateToUse = selectedDate || currentDate;
    if (!dateToUse) {
      return;
    }
    fetchPosts();
  }, [selectedDate]); // selectedDate가 변경될 때마다 다시 불러옵니다

  const handleWriteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPost = async (newPost: Omit<Post, 'id' | 'createdAt'>) => {
    try {
      // 토큰이 있는지 확인
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // 현재 로그인한 사용자 정보 가져오기
      const currentUser = getUser();
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      const dateToUse = selectedDate || currentDate;
      const postData = {
        ...newPost,
        date: dateToUse.toISOString().split('T')[0],
        author: currentUser.name, // 사용자 이름을 작성자로 설정
      };

      const response = await fetchWithAuth('http://localhost:8000/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '게시글 작성에 실패했습니다.');
      }

      const data = await response.json();

      // 서버에서 반환된 게시글을 상태에 추가
      setPosts([data, ...posts]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);
      if (error instanceof Error && error.message.includes('인증')) {
        window.location.href = '/login';
      } else {
        alert(
          '게시글 작성에 실패했습니다: ' +
            (error instanceof Error ? error.message : '알 수 없는 오류')
        );
      }
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleUpdatePost = (id: number, title: string, content: string) => {
    setPosts(posts.map(post => (post.id === id ? { ...post, title, content } : post)));
  };

  return (
    <BoardContainer>
      <Header>
        <Title>게시판</Title>
        <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
      </Header>

      {selectedDate && <DateInfo>선택한 날짜: {selectedDate.toLocaleDateString()}</DateInfo>}

      {isLoading ? (
        <LoadingMessage>로딩 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <PostList>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostItem key={post.id} onClick={() => handlePostClick(post)}>
                <PostTitle>{post.title}</PostTitle>
                <PostInfo>
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </PostInfo>
              </PostItem>
            ))
          ) : (
            <EmptyMessage>
              {selectedDate ? '선택한 날짜의 게시글이 없습니다.' : '게시글이 없습니다.'}
            </EmptyMessage>
          )}
        </PostList>
      )}

      {isModalOpen && (
        <WritePostModal
          selectedDate={selectedDate}
          onClose={handleCloseModal}
          onSubmit={handleSubmitPost}
        />
      )}

      {selectedPost && (
        <BoardDetail
          post={selectedPost}
          onClose={handleCloseDetail}
          onDelete={handleDeletePost}
          onUpdate={handleUpdatePost}
        />
      )}
    </BoardContainer>
  );
}

export default Board;
