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
}

export function PostTable({
  posts,
  loading,
  error,
  nextCursor,
  onLoadMore,
}: PostTableProps) {
  const { columns, handleToggleColumn, startResize } =
    useTableColumns(DEFAULT_COLUMNS);

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
                  {/* 리사이즈 핸들 */}
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
                          <button style={{ marginRight: 4 }}>수정</button>
                          <button>삭제</button>
                        </>
                      )}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>

      {nextCursor && !loading && (
        <button onClick={onLoadMore} style={{ marginTop: 12 }}>
          더 불러오기
        </button>
      )}
      {loading && posts.length > 0 && <p>더 불러오는 중...</p>}
    </div>
  );
}
