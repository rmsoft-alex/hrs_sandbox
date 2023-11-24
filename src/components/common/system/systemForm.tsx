"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useModal } from "@/hooks/modals/useModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "../modals/confirm/defaultModal";
import { Button } from "@/components/ui/button";

const systemFormSchema = z.object({
  systemName: z.string().min(1, { message: "시스템 명을 입력해주세요." }),
  systemDomain: z.string().min(1, { message: "시스템 도메인을 입력해주세요." }),
  active: z.string(),
  description: z.string().nullable(),
});

type systemFormType = z.infer<typeof systemFormSchema>;

interface CommonInputProps {
  label: string;
  htmlFor: string;
  type: string;
  placeholder: string;
  // errors: string | undefined;
  errorMessage: string | undefined;
  register: any;
  readOnlyYN: boolean;
}

const CommonInputLabel: React.FC<{ label: string; htmlFor: string }> = ({
  label,
  htmlFor,
}) => (
  <label
    className="col-span-2 text-sm font-bold text-gray-700"
    htmlFor={htmlFor}
  >
    {label}
  </label>
);

//입력폼
const CommonInput: React.FC<CommonInputProps> = ({
  label,
  htmlFor,
  type,
  placeholder,
  errorMessage,
  register,
  readOnlyYN,
}) => (
  <div className="grid grid-cols-10 items-center">
    <CommonInputLabel label={label} htmlFor={htmlFor} />
    <input
      className={`col-span-8 px-3 py-2 text-sm leading-tight text-gray-700 border ${
        errorMessage ? "border-red-500" : ""
      } rounded-sm appearance-none focus:outline-none focus:shadow-outline`}
      id={htmlFor}
      type={type}
      placeholder={placeholder}
      maxLength={"30"}
      readOnly={readOnlyYN ? "readOnly" : null}
      {...register(htmlFor)}
    />
    <>
      <p className="col-span-2" />
      <p className="col-span-8 text-xs italic text-red-500 h-[24px] leading-[20px]">
        <>{errorMessage && errorMessage}</>
      </p>
    </>
  </div>
);

const SystemForm = ({
  systemName,
  systemDomain,
  active,
  description,
  okButton,
  cancelButton,
  modalName,
  readOnlyYN,
}: {
  systemName: string;
  systemDomain: string;
  active: string;
  description: string | null;
  okButton: string;
  cancelButton: string;
  modalName: "systemEdit" | "systemAdd";
  readOnlyYN: boolean;
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<systemFormType>({
    resolver: zodResolver(systemFormSchema),
    defaultValues: {
      systemName: systemName ?? "",
      systemDomain: systemDomain ?? "",
      active: active ?? "N",
      description: description === "" ? null : description,
    },
  });

  const { onOpen } = useModal();
  const router = useRouter();
  const onSubmit: SubmitHandler<systemFormType> = (data) => {
    sessionStorage.setItem("systemData", JSON.stringify(data));
    onOpen(modalName);
  };
  const handleCheckboxChange = (event: { target: { checked: any } }) => {
    const activeValue = event.target.checked ? "Y" : "N";
    setValue("active", activeValue);
  };
  //벗어나기재확인모달
  const [outConfirmModalOpen, setOutConfirmModalOpen] = useState(false);
  //watch
  const descriptionValue = watch("description");
  const systemNameValue = watch("systemName");
  const systemDomainValue = watch("systemDomain");
  const systemActiveValue = watch("active");

  useEffect(() => {
    setFocus("systemName");
  }, [setFocus]);

  const onBackControl = () => {
    const descriptionNull = description === null ? "" : description;
    const descriptionValueNull =
      descriptionValue === null ? "" : descriptionValue;

    if (
      systemName !== systemNameValue ||
      systemDomain !== systemDomainValue ||
      active !== systemActiveValue ||
      descriptionNull !== descriptionValueNull
    ) {
      setOutConfirmModalOpen(true);
    } else {
      router.back();
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <CommonInput
            label="시스템 명"
            htmlFor="systemName"
            type="text"
            placeholder="시스템 명 입력"
            // errors={errors}
            errorMessage={errors.systemName?.message}
            register={register}
            readOnlyYN={readOnlyYN}
          />
          <CommonInput
            label="시스템 도메인"
            htmlFor="systemDomain"
            type="text"
            placeholder="시스템 도메인 입력"
            // errors={errors}
            errorMessage={errors.systemDomain?.message}
            register={register}
            readOnlyYN={readOnlyYN}
          />
          <div className="grid grid-cols-10 items-center mb-[24px]">
            <CommonInputLabel label="사용여부" htmlFor="active" />
            <label
              className={`relative inline-flex items-center ${
                readOnlyYN ? null : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                // value="Y"
                className="sr-only peer"
                // onChange={handleCheckboxChange}
                // {...register("active")}
                defaultChecked={active === "Y"}
                onChange={handleCheckboxChange}
                disabled={readOnlyYN}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-orange-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-400"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-10 mb-4">
          <label
            className="col-span-2 text-sm mt-[9px] font-bold text-gray-700"
            htmlFor="description"
          >
            설명
          </label>
          <div className="col-span-8 border rounded-sm p-2">
            <textarea
              readOnly={readOnlyYN}
              placeholder={
                descriptionValue === null && readOnlyYN
                  ? ""
                  : "설명을 입력해주세요."
              }
              className="scrollbar-hide w-full min-h-[215px] resize-none text-sm text-gray-700 placeholder:text-sm outline-0 "
              maxLength={4000}
              {...register("description")}
            />
          </div>
        </div>
        {okButton !== "" ? (
          <div className="mb-6 text-right">
            <div
              onClick={onBackControl}
              className="w-[65px] h-[36px] align-top leading-[35px] inline-block mr-2 text-sm rounded-md border border-slate-300 text-center cursor-pointer"
            >
              {cancelButton}
            </div>
            <button
              className="w-[65px] h-[36px] text-sm text-white bg-orange-500 rounded-md"
              type="submit"
            >
              {okButton}
            </button>
          </div>
        ) : null}
      </form>
      <Modal
        isOpen={outConfirmModalOpen}
        onClose={() => setOutConfirmModalOpen(false)}
        title="이 페이지에서 나가시겠습니까?"
        description="이 페이지를 벗어나시면 변경사항이 저장되지 않습니다."
      >
        <div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setOutConfirmModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={() => router.back()}>확인</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SystemForm;
