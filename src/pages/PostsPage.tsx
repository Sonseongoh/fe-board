import { PostForm } from "../components/PostForm";
import { createPost } from "../api/posts";
import { usePosts } from "../hooks/usePosts";
import { PostTable } from "../components/PostTable";

export function PostsPage() {
  const { posts, nextCursor, loading, error, loadInitial, loadMore } = usePosts(
    { initialLimit: 20 }
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>게시판</h1>

      <PostForm
        onSubmit={async (payload) => {
          await createPost(payload);
          await loadInitial();
        }}
      />

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
