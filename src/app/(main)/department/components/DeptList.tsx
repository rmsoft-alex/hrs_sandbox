"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TreeView from "@/components/tree/TreeView";
import { NodeModel } from "@minoru/react-dnd-treeview";
import DeptDetail from "./DeptDetail";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeptListResType,
  Listschema,
} from "../../../../api/department.api.schema";
import { useQuery } from "@tanstack/react-query";
import { getDeptList } from "@/api/department.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const DeptList = () => {
  const [selectedNodes, setSelectedNodes] = useState<NodeModel[]>([]);
  const [deactivateStatus, setDeactivateStatus] = useState("");
  const { toast } = useToast();
  const {
    control,
    formState: { errors },
  } = useForm<z.infer<typeof Listschema>>({
    resolver: zodResolver(Listschema),
    mode: "onChange",
  });
  const params = useSearchParams();
  const paramsId = params.get("selected");
  const router = useRouter();
  function onSearch(treeNodeData: any) {
    // console.log("treeNodeData", treeNodeData);
  }

  //데이터받아오기
  const { data } = useQuery({
    queryKey: ["DeptList"],
    queryFn: () => getDeptList(),
  });

  // useEffect(() => {
  //   if (data) {
  //     if (selectedNodes[0] === undefined) {
  //       setSelectedNodes([]);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (data) {
  //     console.log("paramsId2", paramsId);
  //     if(isNaN(paramsId)){

  //     }

  //     if (selectedNodes.length === 0) {
  //       console.log("paramsId2", paramsId);

  //       const adjustedParamsId = Number(paramsId) - 1;
  //       if (
  //         paramsId === null ||
  //         isNaN(adjustedParamsId) ||
  //         Number(paramsId) === 0
  //       ) {
  //         // setSelectedNodes([data[0]]);
  //       } else {
  //         setSelectedNodes([data[Number(paramsId) - 1]]);
  //       }
  //     }
  //   }
  // }, [data, selectedNodes, paramsId]);
  useEffect(() => {
    if (data) {
      const numericParamsId = paramsId === null ? null : Number(paramsId);

      if (selectedNodes.length === 0) {
        if (numericParamsId !== null && isNaN(numericParamsId)) {
          toast({
            description: "잘못된 접근입니다.",
            variant: "destructive",
            duration: 3000,
          });
          router.push(`/department`);
        } else {
          const foundNode = data.find(
            (item: any) => item.id === numericParamsId
          );

          if (foundNode) {
            setSelectedNodes([foundNode]);
          } else if (numericParamsId === null) {
            <></>;
          } else {
            toast({
              description: "잘못된 접근입니다.",
              variant: "destructive",
              duration: 3000,
            });
            router.back();
          }
        }
      }
    }
  }, [data, selectedNodes, paramsId, toast, router]);

  useEffect(() => {
    if (deactivateStatus) {
      setSelectedNodes([]);
    }
  }, [deactivateStatus]);

  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[289px_1fr] gap-4 w-full">
      <div className="row-span-2 border h-[720px] relative border-slate-[#E2E8F0]">
        <div className="min-w-[16.875rem] h-[98%] relative overflow-y-auto overflow-x-hidden ">
          <TreeView
            tree={data}
            selectedNode={selectedNodes}
            setSelectedNode={setSelectedNodes}
            treeName="조직도" // 트리 이름 설정 (선택 사항)
            multiSelection={false} // 다중 선택 활성화
            canSearch={true}
            onSearch={onSearch}
            canDrag={false} // 드래그 앤 드롭 활성화
            classes={{
              // 클래스 설정 (선택 사항)
              placeholder: "custom-placeholder-class",
              dropTarget: "custom-drop-target-class",
            }}
            onDrop={(node) => {
              // 드롭 이벤트 처리 로직
              // console.log("Dropped Node:", node);
            }}
          />
        </div>
      </div>
      <DeptDetail selectedNodes={selectedNodes} />
    </div>
  );
};

export default DeptList;
