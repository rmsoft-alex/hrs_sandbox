import React, { useEffect, useMemo } from "react";
import {
  useMemberHistory,
  useRestructureActions,
} from "../../store/useRestructureStore";
import { DataTable, useTableState } from "@/components/common/table/table";
import { columns } from "./columns";
import { HelpCircle, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RowData } from "@tanstack/react-table";
import { MemberHistoryType } from "../../types";
import TooltipIcon from "@/components/ui/TooltipIcon";

interface Original {
  original: MemberHistoryType;
}

interface Props {
  isPending: boolean;
}

const MemberHistory = ({ isPending }: Props) => {
  const { toast } = useToast();
  const table = useTableState();
  const memberHistory = useMemberHistory();
  const { deleteMemberHistory } = useRestructureActions();
  const isExist = useMemo(() => memberHistory ?? [], [memberHistory]);

  const handleDeleteSelect = () => {
    if (table.selectedRows.length === 0) {
      toast({
        description: "선택 된 이력이 없습니다.",
        variant: "destructive",
        duration: 3000,
      });
    }
    deleteMemberHistory(
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
    return (
      <div
        onClick={() => deleteMemberHistory([(props.row as Original).original])}
        className="cursor-pointer w-10 h-10 rounded-full flex justify-center items-center group"
      >
        <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-orange-500" />
      </div>
    );
  };

  useEffect(() => {
    table.setSorting([{ id: "regDate", desc: true }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="px-2">
      <h3 className="semi-title text-slate-600 mb-4 flex items-center gap-1">
        구성원 변경 이력
        <TooltipIcon
          icon={
            <HelpCircle className="w-4 h-4 ml-1 cursor-pointer text-white fill-orange-200" />
          }
          content={
            "부서 이동 이력이 있는 구성원에 대한 직책 변경 이력은 조회되지 않습니다."
          }
          className="max-w-xs "
          orange
        />
      </h3>

      <DataTable
        columns={columns}
        data={isExist}
        totalCount={memberHistory?.length || 0}
        pageSizeView={false}
        pageIndexView={false}
        paginationBtn={false}
        headRender={<HeaderButtons />}
        rowRender={<RowButtons />}
        className="h-[300px]"
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

export default MemberHistory;
