import { apiRequest } from "./client";
import type { Post, PostListResponse } from "../types/post";

export interface FetchPostsParams {
  cursor?: string | null;
  limit?: number;
}

export interface CreatePostPayload {
  title: string;
  body: string;
  category: "NOTICE" | "QNA" | "FREE";
  tags: string[];
}

export async function fetchPosts(params: FetchPostsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.limit) searchParams.set("limit", String(params.limit));

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
