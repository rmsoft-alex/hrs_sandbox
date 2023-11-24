import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateFormType, OptionState, TreeDataType } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateFormSchema } from "../../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useRestructureActions,
  useTempStorage,
  useTree,
} from "../../store/useRestructureStore";
import Combobox from "../ComboBox";
import MultiSelect from "../MultiSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectForm } from "../SelectForm";
import { Button } from "@/components/ui/button";
import { NodeModel } from "@minoru/react-dnd-treeview";
import useSaveTempData from "../../hooks/useSaveTempData";

export type CreateType = {
  type: string;
  label: string;
  createCode: string;
  deactiveCode: string | null;
};

export interface InputFormType {
  name: string;
  parent: number | null;
  createType: string | undefined;
  prevDepartments: {
    value: string;
    label: string | number;
  }[];
}

interface Props {
  refresh: () => void;
}

const CreateForm = ({ refresh }: Props) => {
  const form = useForm<CreateFormType>({
    resolver: zodResolver(CreateFormSchema),
  });
  const tree = useTree();
  const tempStorage = useTempStorage();
  const { mutate: tempMutate } = useSaveTempData(refresh);
  const { createDepartment } = useRestructureActions();
  const [selectOptions, setSelectOptions] = useState<NodeModel<TreeDataType>[]>(
    []
  );

  const [isCreated, setIsCreated] = useState(false);
  const [prevOptios, setPrevOptions] = useState<NodeModel<TreeDataType>[]>([]);
  const [selectedPrevs, setSelectedPrevs] = useState<OptionState[]>([]);
  const [formData, setFormData] = useState<InputFormType>({
    name: "",
    parent: null,
    createType: undefined,
    prevDepartments: [],
  });

  const onChangeType = (value: CreateType | undefined) => {
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      createType: value.createCode,
      prevDepartments: [],
    }));
    form.setValue("createType", value.createCode);
    form.setValue("deactiveType", value.deactiveCode);
    form.setValue("prevDepartments", []);
    form.clearErrors("createType");
    form.clearErrors("prevDepartments");
    setSelectedPrevs([]);
  };

  const onSubmit = (data: CreateFormType) => {
    console.log(data);
    if (!validationCheck(data)) return;
    createDepartment(data);
    setFormData({
      name: "",
      parent: null,
      createType: undefined,
      prevDepartments: [],
    });
    form.reset();
    setSelectedPrevs([]);
    setIsCreated(true);
  };

  const validationCheck = (data: CreateFormType) => {
    if (data.name === "") {
      form.setError("name", {
        message: "필수 값입니다.",
      });
      return false;
    }
    if (tree?.some((dep) => dep.text === data.name)) {
      form.setError("name", {
        message: "이미 존재하는 부서명 입니다.",
      });
      return false;
    }
    if (!data.createType) {
      form.setError("createType", {
        message: "필수 값입니다.",
      });
      return false;
    }
    if (
      form.getValues().createType &&
      form.getValues().createType !== "HRS0303010104" &&
      data.prevDepartments?.length === 0
    ) {
      form.setError("prevDepartments", {
        message: "필수 값입니다.",
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (tree && tree.length) {
      setSelectOptions(tree.filter((node) => node.data?.activeType !== "N")); // 상위부서 선택옵션 (폐지 된 부서 제외)
      setPrevOptions(
        tree.filter(
          (node) => !(node.data?.activeType === "Y" && node.data.restructureIdx)
        )
      ); // 이전 부서 선택 옵션 (신설 부서 제외)
    }
  }, [tree]);

  useEffect(() => {
    if (tempStorage && isCreated) {
      tempMutate("DEPARTMENT", tempStorage);
      setIsCreated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempStorage]);
  return (
    <div className="px-2 pt-4 border-t">
      <h3 className="semi-title text-orange-500 mb-4">부서생성</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* 부서명 */}
          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem className="grid grid-cols-[100px_250px_1fr] items-center">
                <FormLabel className="self-center mt-2 ">부서명</FormLabel>
                <FormControl>
                  <Input
                    className="w-[250px]"
                    placeholder="부서명을 입력해주세요."
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      form.setValue("name", e.target.value);
                      form.clearErrors("name");
                    }}
                    value={formData.name}
                  />
                </FormControl>
                <FormMessage className="text-xs ml-4" />
              </FormItem>
            )}
          />
          {/* 상위부서 선택 */}
          <div className="flex items-center gap-4">
            <Combobox
              form={form}
              options={selectOptions}
              selectedPrevs={selectedPrevs}
              onSelect={(parent) => {
                if (!parent) return;
                setFormData((prev) => ({ ...prev, parent: Number(parent.id) }));
                form.setValue("parent", Number(parent.id));
                form.setValue("depth", Number(parent.data?.depth) + 1);
                form.clearErrors("parent");
              }}
            />
            <FormField
              control={form.control}
              name="parent"
              render={() => (
                <FormItem className="flex items-center h-10 gap-2 mt-2 ">
                  <FormControl>
                    <Checkbox
                      checked={formData.parent === 0}
                      onCheckedChange={(isChecked) => {
                        if (isChecked) {
                          setFormData((prev) => ({ ...prev, parent: 0 }));
                          form.setValue("parent", 0);
                          form.setValue("depth", 0);
                          form.clearErrors("parent");
                        } else {
                          setFormData((prev) => ({ ...prev, parent: null }));
                          form.resetField("parent");
                          form.resetField("depth");
                          form.clearErrors("parent");
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="pb-[5px] text-slate-700 cursor-pointer">
                    최상위 부서로 지정
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          {/* 신설유형 선택 */}
          <SelectForm form={form} formData={formData} onChange={onChangeType} />
          {/* 이전부서 선택 */}
          {form.getValues().createType &&
            form.getValues().createType !== "HRS0303010104" && (
              <MultiSelect
                form={form}
                options={
                  // 신설 유형이 분할인 경우 분할로 인해 폐지 된 부서도 이전 부서로 선택 가능.
                  // 그 외 신설 유형은 폐지 된 부서를 이전 부서로 선택 할 수 없음.
                  form.getValues().createType === "HRS0303010102"
                    ? prevOptios.filter(
                        (node) =>
                          !(
                            node.data?.activeType === "N" &&
                            node.data?.restructureDetailCode !== "HRS0303010202"
                          )
                      )
                    : prevOptios.filter((node) => node.data?.activeType !== "N")
                }
                selected={selectedPrevs}
                setSelected={setSelectedPrevs}
                parentIdx={formData.parent}
                disabled={
                  // 신설 유형이 선택되지 않거나, 신설 유형이 신규일 때 이전부서 선택 비활성화
                  !form.getValues().createType ||
                  form.getValues().createType === "HRS0303010104"
                }
              />
            )}
          <div className="flex justify-end items-center px-2">
            <Button
              type="submit"
              variant={"outline"}
              className="border-orange-500 hover:bg-orange-50"
            >
              생성완료
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateForm;
