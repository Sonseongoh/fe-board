import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "../components/PostForm";
import { fetchPost, updatePost } from "../api/posts";
import type { Post } from "../types/post";
import type { CreatePostPayload } from "../api/posts";

export function PostEditPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id;

  useEffect(() => {
    if (!id) {
      setError("잘못된 접근입니다.");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPost(id);
        setPost(data);
      } catch (err: unknown) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "게시글 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleUpdate = async (payload: CreatePostPayload) => {
    if (!id) return;
    await updatePost(id, payload);
    navigate("/posts");
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <p>로딩중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "red" }}>{error ?? "게시글을 찾을 수 없습니다."}</p>
        <button onClick={() => navigate("/posts")}>목록으로</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>게시글 수정</h1>
      <PostForm
        onSubmit={handleUpdate}
        initialValues={{
          title: post.title,
          body: post.body,
          category: post.category,
          tags: post.tags,
        }}
        submitLabel="수정하기"
      />
      <button onClick={() => navigate("/posts")} style={{ marginTop: 8 }}>
        취소
      </button>
    </div>
  );
}
