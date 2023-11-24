import { User2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MemberType, TreeDataType } from "../../types";
import { PositionSchema } from "../../schema";
import { useRestructureActions } from "../../store/useRestructureStore";
import PositionComboBox from "../PositionComboBox";
import { z } from "zod";
import { CommonCodeSchema } from "@/api/common.api.schema";
import { NodeModel } from "@minoru/react-dnd-treeview";

interface Props {
  member: MemberType;
  originGroup: NodeModel<TreeDataType>[];
  options: z.infer<typeof CommonCodeSchema>;
}

const TargetMemberItem = ({ member, originGroup, options }: Props) => {
  const { updatePosition } = useRestructureActions();
  const [selectedPosition, setSelectedPosition] = useState<string>(
    member.titleCode
  );
  const [isNew, setIsNew] = useState(!!member.restructureCode);

  const onSelect = (
    value: { commonCodeName: string; commonCode: string } | undefined
  ) => {
    if (!value) return console.log("value없음");
    const val = PositionSchema.parse(value.commonCode);
    setSelectedPosition(val);
    updatePosition(member, value, originGroup);
  };

  useEffect(() => {
    setSelectedPosition(member.titleCode);
    setIsNew(!!member.restructureCode);
  }, [member]);
  return (
    <div className="grid grid-cols-[32px_1fr_1fr] items-center px-4 h-12 text-slate-500 border-b text-sm">
      <User2
        className={`w-4 h-4 ${
          isNew
            ? "text-orange-300 fill-orange-300"
            : "text-slate-300 fill-slate-300"
        }`}
        fill={"true"}
      />
      <span>{member.name}</span>
      <PositionComboBox
        options={options}
        selectedItem={selectedPosition}
        onSelect={onSelect}
      />
    </div>
  );
};

export default TargetMemberItem;
