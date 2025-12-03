import type { FormEvent } from "react";
import { useState } from "react";
import type { CreatePostPayload } from "../api/posts";
import { findBannedWord } from "../utils/findBannedWords";
import { toast } from "react-toastify";

interface PostFormProps {
  onSubmit: (payload: CreatePostPayload) => Promise<void>;
  initialValues?: Partial<CreatePostPayload>;
  submitLabel?: string;
}

export function PostForm({
  onSubmit,
  initialValues,
  submitLabel,
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [body, setBody] = useState(initialValues?.body ?? "");
  const [category, setCategory] = useState<CreatePostPayload["category"]>(
    initialValues?.category ?? "NOTICE"
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    const bad = findBannedWord(trimmed);
    if (bad) {
      toast.error(`태그에 금칙어("${bad}")가 포함되어 있습니다.`);
      return;
    }

    if (tags.length >= 5) {
      toast.error("태그는 최대 5개까지 가능합니다.");
      return;
    }
    if (trimmed.length > 24) {
      toast.error("태그는 24자 이하만 가능합니다.");
      return;
    }
    if (tags.includes(trimmed)) {
      toast.error("중복 태그는 사용할 수 없습니다.");
      return;
    }

    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
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

    const badInTitle = findBannedWord(title);
    if (badInTitle) {
      toast.error(`제목에 금칙어 '${badInTitle}'가 포함되어 있습니다.`);
      return;
    }

    const badInBody = findBannedWord(body);
    if (badInBody) {
      toast.error(`본문에 금칙어 '${badInBody}'가 포함되어 있습니다.`);
      return;
    }

    for (const tag of tags) {
      const bad = findBannedWord(tag);
      if (bad) {
        toast.error(`태그("${tag}")에 금칙어("${bad}")가 포함되어 있습니다.`);
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        body,
        category,
        tags,
      });

      // 작성 폼일 때는 초기화, 수정 폼은 상위에서 처리
      if (!initialValues) {
        setTitle("");
        setBody("");
        setCategory("NOTICE");
        setTags([]);
        setTagInput("");
      }
    } catch (err) {
      console.error(err);
      setError("게시글 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 12 }}>
        {submitLabel ? submitLabel : "게시글 작성"}
      </h2>

      <div style={{ marginBottom: 12 }}>
        <label>제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "6px 8px" }}
          required
        />
        <div style={{ fontSize: 12, color: "#666" }}>{title.length} / 80자</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>본문</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: "100%", height: 120, padding: "6px 8px" }}
          required
        />
        <div style={{ fontSize: 12, color: "#666" }}>
          {body.length} / 2000자
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>카테고리</label>
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as CreatePostPayload["category"])
          }
          style={{ padding: "6px 8px" }}
        >
          <option value="NOTICE">NOTICE</option>
          <option value="QNA">QNA</option>
          <option value="FREE">FREE</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>태그</label>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            style={{ flex: 1, padding: "6px 8px" }}
          />
          <button type="button" onClick={handleAddTag}>
            추가
          </button>
        </div>

        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 8px",
                borderRadius: 12,
                background: "#e5e7eb",
                fontSize: 12,
              }}
            >
              #{tag}{" "}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                style={{
                  marginLeft: 4,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: 8, fontSize: 13 }}>{error}</p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "처리 중..." : submitLabel ?? "등록하기"}
      </button>
    </form>
  );
}
