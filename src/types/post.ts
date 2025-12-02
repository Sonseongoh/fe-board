export type PostCategory = "NOTICE" | "QNA" | "FREE";

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
  createdAt: string;
}

export interface PostListResponse {
  items: Post[];
  prevCursor: string | null;
  nextCursor: string | null;
}
