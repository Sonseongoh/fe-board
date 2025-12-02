import type { FormEvent } from "react";
import { useState } from "react";
import type { CreatePostPayload } from "../api/posts";
import { findBannedWord } from "../utils/findBannedWords";

interface PostFormProps {
  onSubmit: (payload: CreatePostPayload) => Promise<void>;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] =
    useState<CreatePostPayload["category"]>("NOTICE");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.length >= 5) {
      setError("태그는 최대 5개까지 가능합니다.");
      return;
    }
    if (tagInput.length > 24) {
      setError("태그는 24자 이하만 가능합니다.");
      return;
    }
    if (tags.includes(tagInput)) {
      setError("중복 태그는 사용할 수 없습니다.");
      return;
    }
    setTags((prev) => [...prev, tagInput]);
    setTagInput("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.length > 80) {
      setError("제목은 최대 80자입니다.");
      return;
    }
    if (body.length > 2000) {
      setError("본문은 최대 2000자입니다.");
      return;
    }

    const bad1 = findBannedWord(title);
    if (bad1) {
      setError(`제목에 금칙어("${bad1}")가 포함되어 있습니다.`);
      return;
    }
    const bad2 = findBannedWord(body);
    if (bad2) {
      setError(`본문에 금칙어("${bad2}")가 포함되어 있습니다.`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        body,
        category,
        tags,
      });
      // 성공하면 초기화
      setTitle("");
      setBody("");
      setTags([]);
      setTagInput("");
    } catch (err) {
      console.error(err);
      setError("게시글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <h2>게시글 작성</h2>

      <div style={{ marginBottom: 12 }}>
        <label>제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%" }}
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>본문</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: "100%", height: 120 }}
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>카테고리</label>
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as CreatePostPayload["category"])
          }
        >
          <option value="NOTICE">NOTICE</option>
          <option value="QNA">QNA</option>
          <option value="FREE">FREE</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>태그</label>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <button type="button" onClick={handleAddTag}>
            추가
          </button>
        </div>

        <div
          style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          {tags.map((t) => (
            <span
              key={t}
              style={{
                padding: "4px 8px",
                background: "#eee",
                borderRadius: 4,
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "등록 중..." : "등록하기"}
      </button>
    </form>
  );
}
