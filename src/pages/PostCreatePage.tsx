import { useNavigate } from "react-router-dom";
import { PostForm } from "../components/PostForm";
import { createPost } from "../api/posts";
import type { CreatePostPayload } from "../api/posts";
import { toast } from "react-toastify";

export function PostCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (payload: CreatePostPayload) => {
    await createPost(payload);
    toast.success("게시글이 등록되었습니다!");
    navigate("/posts");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>새 글 작성</h1>
      <PostForm onSubmit={handleCreate} submitLabel="등록하기" />
    </div>
  );
}
