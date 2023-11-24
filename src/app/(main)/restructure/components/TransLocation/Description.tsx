import React from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Description = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-[430px] absolute bg-white z-30"
    >
      <AccordionItem value="item-1" className="border rounded-md shadow-sm">
        <AccordionTrigger className="px-4 py-1 h-fit">
          <div className="flex items-center gap-2 text-sm">
            <Lightbulb className="w-[14px] h-[14px] text-orange-500" />
            구성원 관리 이용방법
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-5 py-1">
          <ul className="list-disc list-inside text-orange-400 text-xs">
            <li>
              <span className="text-slate-600">
                원본 조직도에서 부서를 선택하여 선택 부서 구성원에 추가합니다.
              </span>
            </li>
            <li>
              <span className="text-slate-600">
                선택 부서 구성원에서 부서를 이동시킬 구성원을 선택합니다.
              </span>
            </li>
            <li>
              <span className="text-slate-600">
                예정 조직도에서 선택 대상을 이동시킬 부서를 선택합니다.
              </span>
            </li>
            <li>
              <div className="text-slate-600 inline">
                <span>화살표 버튼</span>
                <span className="border rounded-sm inline-block items-center p-[2px] mx-1 mb-[-3px]">
                  <ChevronDown className="w-2 h-2 text-center text-orange-500" />
                </span>
                <span>
                  을 눌러 이동 대상 부서로 선택한 구성원을 이동할 수 있습니다.
                </span>
              </div>
            </li>
            <li>
              <span className="text-slate-600">
                이동 대상 부서의 구성원 목록에서는 구성원의 직책변경이
                가능합니다.
              </span>
            </li>
            <li>
              <span className="text-slate-600">
                변경사항은 하단의 변경 이력에서 확인할 수 있습니다.
              </span>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Description;
