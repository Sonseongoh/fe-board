import { useCallback, useEffect, useState } from "react";
import type { Post, PostCategory } from "../types/post";
import { fetchPosts } from "../api/posts";

export type SortField = "createdAt" | "title";
export type SortOrder = "asc" | "desc";
export type CategoryFilter = PostCategory | "ALL";

interface UsePostsOptions {
  initialLimit?: number;
}

export function usePosts({ initialLimit = 20 }: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [sort, setSort] = useState<SortField>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");

  // 1페이지 로딩
  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchPosts({
        limit: initialLimit,
        nextCursor: null,
        sort,
        order,
        search: search || undefined,
        category: category === "ALL" ? undefined : category,
      });

      setPosts(res.items);
      setNextCursor(res.nextCursor);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "게시글을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [initialLimit, sort, order, search, category]);

  //  다음 페이지 로딩
  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetchPosts({
        limit: initialLimit,
        nextCursor: null,
        sort,
        order,
        search: search || undefined,
        category: category === "ALL" ? undefined : category,
      });

      setPosts((prev) => [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "추가 게시글을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, initialLimit, sort, order, search, category]);

  //  검색/필터/정렬 변경 시 1페이지 새로 로딩
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

    search,
    setSearch,

    category,
    setCategory,

    sort,
    setSort,

    order,
    setOrder,
  };
}
