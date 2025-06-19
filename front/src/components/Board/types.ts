export interface Post {
  id: number; // 게시글 고유 식별자
  title: string; // 게시글 제목
  content: string; // 게시글 내용
  author: string; // 작성자
  date: string; // 게시글 작성 날짜 (ISO 문자열 형식)
  createdAt: string; // 게시글 생성 시간 (ISO 문자열 형식)
}
