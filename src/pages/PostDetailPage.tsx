import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchPost, deletePost } from "../api/posts";
import type { Post } from "../types/post";

export function PostDetailPage() {
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

  const handleDelete = async () => {
    if (!id) return;
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    await deletePost(id);
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
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/posts" style={{ fontSize: 14 }}>
          ← 목록으로
        </Link>
      </div>

      <h1 style={{ marginBottom: 8 }}>{post.title}</h1>

      <div
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 12,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span>카테고리: {post.category}</span>
        <span>작성일: {new Date(post.createdAt).toLocaleString()}</span>
      </div>

      {post.tags.length > 0 && (
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 8px",
                borderRadius: 12,
                background: "#e5e7eb",
                fontSize: 12,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div
        style={{
          padding: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 4,
          minHeight: 120,
          whiteSpace: "pre-wrap",
          marginBottom: 24,
        }}
      >
        {post.body}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => navigate(`/posts/${post.id}/edit`)}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          수정
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #fca5a5",
            background: "#fee2e2",
            color: "#b91c1c",
            cursor: "pointer",
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
