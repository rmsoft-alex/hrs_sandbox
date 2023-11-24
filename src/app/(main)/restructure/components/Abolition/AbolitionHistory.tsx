import React, { useEffect, useMemo } from "react";
import {
  useAbolitionHistory,
  useRestructureActions,
} from "../../store/useRestructureStore";
import { DataTable, useTableState } from "@/components/common/table/table";
import { columns } from "./columns";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RowData } from "@tanstack/react-table";
import { AbolitioinHistoryType } from "../../types";

interface Original {
  original: AbolitioinHistoryType;
}

interface Props {
  isPending: boolean;
}

const AbolitionHistory = ({ isPending }: Props) => {
  const { toast } = useToast();
  const table = useTableState();
  const abolitionHistory = useAbolitionHistory();
  const { deleteAbolitionHistory } = useRestructureActions();

  const isExist = useMemo(() => abolitionHistory ?? [], [abolitionHistory]);

  const handleDeleteSelect = () => {
    if (table.selectedRows.length === 0) {
      toast({
        description: "선택 된 이력이 없습니다.",
        variant: "destructive",
        duration: 3000,
      });
    }
    deleteAbolitionHistory(
      table.selectedRows.map((row) => (row as Original).original)
    );
  };

  const HeaderButtons = () => {
    return (
      <>
        {table.selectedRows.length > 0 && (
          <div
            className="cursor-pointer w-6 h-6 rounded-full flex justify-center items-center group mr-2"
            onClick={handleDeleteSelect}
          >
            <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-orange-500" />
          </div>
        )}
      </>
    );
  };

  const RowButtons = (props: { row?: RowData }) => {
    const type = (props.row as Original).original.cmmnCodeDetail;
    const disable =
      type === "HRS0303010201" ||
      type === "HRS0303010202" ||
      type === "HRS0303010203";
    return (
      <div
        onClick={() => {
          disable
            ? null
            : deleteAbolitionHistory([(props.row as Original).original]);
        }}
        className={`w-10 h-10 rounded-full flex justify-center items-center group ${
          disable ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <Trash2
          className={`w-4 h-4 ${
            disable
              ? "text-slate-300"
              : "text-slate-600 group-hover:text-orange-500"
          }`}
        />
      </div>
    );
  };

  useEffect(() => {
    table.setSorting([{ id: "regDate", desc: true }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-2 py-4 border-t">
      <h3 className="semi-title text-slate-600 mb-4">부서 폐지 이력</h3>

      <DataTable
        columns={columns}
        data={isExist}
        totalCount={abolitionHistory?.length || 0}
        pageSizeView={false}
        pageIndexView={false}
        paginationBtn={false}
        headRender={<HeaderButtons />}
        rowRender={<RowButtons />}
        className="h-[calc(100vh-330px)] min-h-[364px]"
        enableRowSelection={(row) =>
          !(
            row.original.cmmnCodeDetail === "HRS0303010201" ||
            row.original.cmmnCodeDetail === "HRS0303010202" ||
            row.original.cmmnCodeDetail === "HRS0303010203"
          )
        }
        placeholder={
          isPending ? (
            <div>로딩중입니다.</div>
          ) : (
            <div>변경 이력이 없습니다.</div>
          )
        }
        {...table}
      />
    </div>
  );
};

export default AbolitionHistory;
