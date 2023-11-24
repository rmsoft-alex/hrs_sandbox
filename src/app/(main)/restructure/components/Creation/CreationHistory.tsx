import React, { useEffect, useMemo, useState } from "react";
import {
  useCreationHistory,
  useRestructureActions,
  useTempStorage,
} from "../../store/useRestructureStore";
import { DataTable, useTableState } from "@/components/common/table/table";
import { columns } from "./columns";
import { Trash2 } from "lucide-react";
import { RowData } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";
import { CreationHistoryType } from "../../types";
import useSaveTempData from "../../hooks/useSaveTempData";

interface Original {
  original: CreationHistoryType;
}

interface Props {
  isPending: boolean;
}

const CreationHistory = ({ isPending }: Props) => {
  const { toast } = useToast();

  const table = useTableState();
  const tempStorage = useTempStorage();
  const creationHistory = useCreationHistory();
  const { deleteCreationHistory, deleteMemberHistoryByDeletedDepartments } =
    useRestructureActions();
  const { mutate: tempMutate } = useSaveTempData();

  const [isChangeMember, setIsChangeMember] = useState(false);

  const isExist = useMemo(() => creationHistory ?? [], [creationHistory]);

  const handleDeleteSelect = () => {
    if (table.selectedRows.length === 0) {
      toast({
        description: "선택 된 이력이 없습니다.",
        variant: "destructive",
        duration: 3000,
      });
    }
    const members = deleteCreationHistory(
      table.selectedRows.map((row) => (row as Original).original)
    );
    if (members && members.length > 0) {
      deleteMemberHistoryByDeletedDepartments(members);
      setIsChangeMember(true);
    }
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
        onClick={() => {
          const members = deleteCreationHistory([
            (props.row as Original).original,
          ]);
          if (members && members.length > 0) {
            deleteMemberHistoryByDeletedDepartments(members);
            setIsChangeMember(true);
          }
        }}
        className="cursor-pointer w-10 h-10 rounded-full flex justify-center items-center group"
      >
        <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-orange-500" />
      </div>
    );
  };

  useEffect(() => {
    if (isChangeMember && tempStorage) {
      tempMutate("USER", tempStorage);
      tempMutate("DEPARTMENT", tempStorage);
      setIsChangeMember(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempStorage]);
  useEffect(() => {
    table.setSorting([{ id: "regDate", desc: true }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="px-2 py-4 border-t">
      <h3 className="semi-title text-slate-600 mb-4">부서 생성 이력</h3>

      <DataTable
        columns={columns}
        data={isExist}
        totalCount={creationHistory?.length || 0}
        pageSizeView={false}
        pageIndexView={false}
        paginationBtn={false}
        headRender={<HeaderButtons />}
        rowRender={<RowButtons />}
        className="h-[calc(100%-74px)]"
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

export default CreationHistory;
