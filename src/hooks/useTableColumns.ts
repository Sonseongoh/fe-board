import { useCallback, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { TableColumnConfig } from "../types/table";

export function useTableColumns(initialColumns: TableColumnConfig[]) {
  const [columns, setColumns] = useState<TableColumnConfig[]>(initialColumns);

  const handleToggleColumn = useCallback((key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  const startResize = useCallback(
    (e: ReactMouseEvent, key: string) => {
      e.preventDefault();

      const startX = e.clientX;
      const targetColumn = columns.find((c) => c.key === key);
      if (!targetColumn) return;

      const startWidth = targetColumn.width;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const newWidth = Math.max(60, startWidth + delta);

        setColumns((prev) =>
          prev.map((col) =>
            col.key === key ? { ...col, width: newWidth } : col
          )
        );
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [columns]
  );

  return {
    columns,
    handleToggleColumn,
    startResize,
  };
}
