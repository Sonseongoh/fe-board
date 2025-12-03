import { useNavigate } from "react-router-dom";
import { PostTable } from "../components/PostTable";
import { usePosts } from "../hooks/usePosts";
import { deletePost } from "../api/posts";
import type { Post } from "../types/post";
import { toast } from "react-toastify";

export function PostsPage() {
  const navigate = useNavigate();

  const {
    posts,
    loading,
    error,
    nextCursor,
    loadMore,
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    order,
    setOrder,
    loadInitial,
  } = usePosts({ initialLimit: 20 });

  const handleDelete = async (post: Post) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    await deletePost(post.id);
    toast.success("삭제되었습니다!");
    await loadInitial();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>게시판</h1>

      {/* 새 글 작성 버튼 */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => navigate("/posts/new")}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ddd",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          새 글 작성
        </button>
      </div>

      {/* 검색 / 필터 / 정렬 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목/본문 검색"
          style={{ padding: "6px 8px", minWidth: 200 }}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as "ALL" | "NOTICE" | "QNA" | "FREE")
          }
          style={{ padding: "6px 8px" }}
        >
          <option value="ALL">전체</option>
          <option value="NOTICE">NOTICE</option>
          <option value="QNA">QNA</option>
          <option value="FREE">FREE</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "title" | "createdAt")}
          style={{ padding: "6px 8px" }}
        >
          <option value="createdAt">작성일</option>
          <option value="title">제목</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          style={{ padding: "6px 8px" }}
        >
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
      </div>

      <PostTable
        posts={posts}
        loading={loading}
        error={error}
        nextCursor={nextCursor}
        onLoadMore={loadMore}
        onEdit={(post) => navigate(`/posts/${post.id}/edit`)}
        onDelete={handleDelete}
        onOpen={(post) => navigate(`/posts/${post.id}`)}
      />
    </div>
  );
}
