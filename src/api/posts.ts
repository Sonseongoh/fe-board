import { apiRequest } from "./client";
import type { Post, PostCategory, PostListResponse } from "../types/post";

export interface FetchPostsParams {
  nextCursor?: string | null;
  limit?: number;
  search?: string;
  category?: PostCategory | null;
  sort?: "title" | "createdAt";
  order?: "asc" | "desc";
  from?: string; // ISO string
  to?: string; // ISO string
}

export interface CreatePostPayload {
  title: string;
  body: string;
  category: "NOTICE" | "QNA" | "FREE";
  tags: string[];
}

export async function fetchPosts(params: FetchPostsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.nextCursor) searchParams.set("nextCursor", params.nextCursor);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.order) searchParams.set("order", params.order);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);

  const qs = searchParams.toString();
  const path = qs ? `/posts?${qs}` : "/posts";

  return apiRequest<PostListResponse>(path, { method: "GET" });
}

export async function createPost(payload: CreatePostPayload) {
  return apiRequest<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
