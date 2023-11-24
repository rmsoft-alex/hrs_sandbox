"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useSystemFieldState,
  useSystemFilterAction,
} from "../store/useSystemFilterStore";
import { ChevronsLeftRight, Server, AtSign } from "lucide-react";
import SearchInput from "@/components/common/search/SearchInput";

const systemCodeFormSchema = z.object({
  systemCode: z.string(),
});
const systemNameFormSchema = z.object({
  systemName: z.string(),
});
const systemDomainFormSchema = z.object({
  systemDomain: z.string(),
});

interface SystemFilterBtnProps {
  resetPageIndex: () => void;
}

export default function TextInputField({
  resetPageIndex,
}: SystemFilterBtnProps) {
  const { systemCode, systemName, systemDomain } = useSystemFieldState();
  const {
    setSystemCode,
    setSystemName,
    setSystemDomain,
    deleteSystemCode,
    deleteSystemName,
    deleteSystemDomain,
  } = useSystemFilterAction();
  const [systemCodeFieldOpen, setSystemCodeFieldOpen] = useState(false);
  const [systemNameFieldOpen, setSystemNameFieldOpen] = useState(false);
  const [domainFieldOpen, setDomainFieldOpen] = useState(false);

  const systemCodeForm = useForm<z.infer<typeof systemCodeFormSchema>>({
    resolver: zodResolver(systemCodeFormSchema),
    defaultValues: { systemCode: "" },
  });
  const systemNameForm = useForm<z.infer<typeof systemNameFormSchema>>({
    resolver: zodResolver(systemNameFormSchema),
    defaultValues: { systemName: "" },
  });
  const systemDomainForm = useForm<z.infer<typeof systemDomainFormSchema>>({
    resolver: zodResolver(systemDomainFormSchema),
    defaultValues: { systemDomain: "" },
  });

  const onSystemCodeSubmit = (value: z.infer<typeof systemCodeFormSchema>) => {
    setSystemCode(value.systemCode.trim());
    // systemCodeForm.reset();
    setSystemCodeFieldOpen(false);
    resetPageIndex();
  };

  const onSystemNameSubmit = (value: z.infer<typeof systemNameFormSchema>) => {
    setSystemName(value.systemName.trim());
    // systemNameForm.reset();
    setSystemNameFieldOpen(false);
    // resetPageIndex();
  };

  const onSystemDomainSubmit = (
    value: z.infer<typeof systemDomainFormSchema>
  ) => {
    setSystemDomain(value.systemDomain.trim());
    // systemDomainForm.reset();
    setDomainFieldOpen(false);
    // resetPageIndex();
  };

  return (
    <div className="flex items-center gap-2">
      {/* 시스템코드 */}
      <SearchInput
        icon={<ChevronsLeftRight className="text-slate-400 w-[16px]" />}
        title="시스템코드"
        open={systemCodeFieldOpen}
        onOpenChange={setSystemCodeFieldOpen}
        name="systemCode"
        value={systemCode}
        onDeleteButton={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          deleteSystemCode();
          setSystemCodeFieldOpen(false);
          systemCodeForm.reset();
        }}
        form={systemCodeForm}
        onSubmit={systemCodeForm.handleSubmit(onSystemCodeSubmit)}
      />

      {/* 시스템명 */}
      <SearchInput
        icon={<Server className="text-slate-400 w-[16px]" />}
        title="시스템 명"
        open={systemNameFieldOpen}
        onOpenChange={setSystemNameFieldOpen}
        name="systemName"
        value={systemName}
        onDeleteButton={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          deleteSystemName();
          systemNameForm.reset();
          setSystemNameFieldOpen(false);
        }}
        form={systemNameForm}
        onSubmit={systemNameForm.handleSubmit(onSystemNameSubmit)}
      />

      {/* 시스템도메인 */}

      <SearchInput
        icon={<AtSign className="text-slate-400 w-[16px]" />}
        title="시스템 도메인"
        open={domainFieldOpen}
        onOpenChange={setDomainFieldOpen}
        name="systemDomain"
        value={systemDomain}
        onDeleteButton={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          deleteSystemDomain();
          systemDomainForm.reset();
          setDomainFieldOpen(false);
        }}
        form={systemDomainForm}
        onSubmit={systemDomainForm.handleSubmit(onSystemDomainSubmit)}
      />
    </div>
  );
}
