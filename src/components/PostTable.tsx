import { useEffect, useRef } from "react";
import type { Post } from "../types/post";
import type { TableColumnConfig } from "../types/table";
import { useTableColumns } from "../hooks/useTableColumns";

const DEFAULT_COLUMNS: TableColumnConfig[] = [
  { key: "title", label: "제목", visible: true, width: 250 },
  { key: "category", label: "카테고리", visible: true, width: 120 },
  { key: "tags", label: "태그", visible: true, width: 180 },
  { key: "createdAt", label: "작성일", visible: true, width: 180 },
  { key: "actions", label: "액션", visible: true, width: 120 },
];

interface PostTableProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  nextCursor: string | null;
  onLoadMore: () => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function PostTable({
  posts,
  loading,
  error,
  nextCursor,
  onLoadMore,
  onEdit,
  onDelete,
}: PostTableProps) {
  const { columns, handleToggleColumn, startResize } =
    useTableColumns(DEFAULT_COLUMNS);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤
  useEffect(() => {
    if (!nextCursor) return;
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [nextCursor, loading, onLoadMore]);

  return (
    <div>
      {/* 컬럼 표시 설정 */}
      <div style={{ marginBottom: 12 }}>
        <strong>컬럼 표시 설정: </strong>
        {columns.map((col) => (
          <label
            key={col.key}
            style={{ marginRight: 12, fontSize: 14, cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={col.visible}
              onChange={() => handleToggleColumn(col.key)}
              style={{ marginRight: 4 }}
            />
            {col.label}
          </label>
        ))}
      </div>

      {loading && posts.length === 0 && <p>로딩중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {posts.length === 0 && !loading && <p>게시글이 없습니다.</p>}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 24,
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            {columns
              .filter((col) => col.visible)
              .map((col) => (
                <th
                  key={col.key}
                  style={{
                    borderBottom: "2px solid #ddd",
                    borderRight: "2px solid #eee",
                    padding: "8px",
                    width: col.width,
                    position: "relative",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {col.label}
                  <div
                    onMouseDown={(e) => startResize(e, col.key)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      width: 8,
                      height: "100%",
                      cursor: "col-resize",
                      transform: "translateX(50%)",
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "center",
                    }}
                  />
                </th>
              ))}
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              {columns
                .filter((col) => col.visible)
                .map((col) => {
                  const key = col.key;

                  return (
                    <td
                      key={col.key}
                      style={{
                        padding: "8px",
                        borderBottom: "2px solid #eee",
                        borderRight: "2px solid #eee",
                      }}
                    >
                      {key === "title" && post.title}
                      {key === "category" && post.category}
                      {key === "tags" && post.tags.join(", ")}
                      {key === "createdAt" &&
                        new Date(post.createdAt).toLocaleString()}
                      {key === "actions" && (
                        <>
                          <button
                            style={{ marginRight: 4 }}
                            onClick={() => onEdit(post)}
                          >
                            수정
                          </button>
                          <button onClick={() => onDelete(post)}>삭제</button>
                        </>
                      )}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 무한 스크롤 sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {loading && posts.length > 0 && <p>더 불러오는 중...</p>}
    </div>
  );
}
