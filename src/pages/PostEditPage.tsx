import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "../components/PostForm";
import { fetchPost, updatePost } from "../api/posts";
import type { Post } from "../types/post";
import type { CreatePostPayload } from "../api/posts";
import { toast } from "react-toastify";

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
      } catch (err) {
        console.error(err);
        setError("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleUpdate = async (payload: CreatePostPayload) => {
    if (!id) return;
    await updatePost(id, payload);
    toast.success("수정되었습니다!");
    navigate("/posts");
  };

  if (loading) return <p>로딩중...</p>;
  if (error || !post) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>게시글 수정</h1>

      <PostForm
        onSubmit={handleUpdate}
        onCancel={() => navigate("/posts")}
        initialValues={post}
        submitLabel="수정"
      />
    </div>
  );
}
