import { useCallback, useEffect, useState } from "react";
import type { Post } from "../types/post";
import { fetchPosts } from "../api/posts";

interface UsePostsOptions {
  initialLimit?: number;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { initialLimit = 20 } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchPosts({ limit: initialLimit });
      setPosts(res.items);
      setNextCursor(res.nextCursor);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("게시글을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetchPosts({ cursor: nextCursor, limit: initialLimit });
      setPosts((prev) => [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("추가 게시글을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, initialLimit]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return {
    posts,
    nextCursor,
    loading,
    error,
    loadInitial,
    loadMore,
  };
}
