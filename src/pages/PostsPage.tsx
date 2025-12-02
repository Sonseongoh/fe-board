import { PostForm } from "../components/PostForm";
import { PostTable } from "../components/PostTable";
import { createPost } from "../api/posts";
import { usePosts } from "../hooks/usePosts";
import type { PostCategory } from "../types/post";

type CategoryFilter = PostCategory | "ALL";

export function PostsPage() {
  const {
    posts,
    loading,
    error,
    nextCursor,
    loadMore,
    setSearch,
    search,
    category,
    setCategory,
    sort,
    setSort,
    order,
    setOrder,

    loadInitial,
  } = usePosts({ initialLimit: 20 });

  return (
    <div style={{ padding: 24 }}>
      <h1>게시판</h1>
      {/* 글 작성 */}
      <PostForm
        onSubmit={async (payload) => {
          await createPost(payload);
          await loadInitial();
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 16,
          marginBottom: 12,
        }}
      >
        {/* 검색 */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목/본문 검색"
          style={{ padding: "6px 8px", minWidth: 200 }}
        />

        {/* 카테고리 선택 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          style={{ padding: "6px 8px" }}
        >
          <option value="ALL">전체</option>
          <option value="NOTICE">NOTICE</option>
          <option value="QNA">QNA</option>
          <option value="FREE">FREE</option>
        </select>

        {/* 정렬 기준 */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "title" | "createdAt")}
          style={{ padding: "6px 8px" }}
        >
          <option value="createdAt">작성일</option>
          <option value="title">제목</option>
        </select>

        {/* 정렬 방향 */}
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          style={{ padding: "6px 8px" }}
        >
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
      </div>

      {/* 테이블 */}
      <PostTable
        posts={posts}
        loading={loading}
        error={error}
        nextCursor={nextCursor}
        onLoadMore={loadMore}
      />
    </div>
  );
}
