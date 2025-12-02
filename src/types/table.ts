export interface TableColumnConfig {
  key: string; // "title" | "category" | …
  label: string; // 테이블에 보여줄 이름
  visible: boolean; // 숨김/보임
  width: number; // px 단위 (기본값)
}
