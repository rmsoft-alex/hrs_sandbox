"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useTextFieldState,
  useUsrFilteringAction,
} from "../store/useUserFilterStore";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Search, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NameFormSchema = z.object({
  name: z.union([z.literal(""), z.string().trim()]),
});
const UserIdFormSchema = z.object({
  userId: z.union([z.literal(""), z.string().trim()]),
});

type Props = {
  resetPageIndex: () => void;
};

export default function TextInputFilteringField({ resetPageIndex }: Props) {
  const { name, userId } = useTextFieldState();
  const { setName, setUserId, deleteName, deleteUserId } =
    useUsrFilteringAction();
  const [isNameFieldOpen, setIsNameFieldOpen] = useState(false);
  const [isUserIdFieldOpen, setIsUserIdFieldOpen] = useState(false);

  const nameForm = useForm<z.infer<typeof NameFormSchema>>({
    resolver: zodResolver(NameFormSchema),
    defaultValues: { name: "" },
  });
  const userIdForm = useForm<z.infer<typeof UserIdFormSchema>>({
    resolver: zodResolver(UserIdFormSchema),
    defaultValues: { userId: "" },
  });

  const onNameSubmit = (value: z.infer<typeof NameFormSchema>) => {
    setName(value.name);
    setIsNameFieldOpen(false);
    resetPageIndex();
  };

  const onUserIdSubmit = (value: z.infer<typeof UserIdFormSchema>) => {
    setUserId(value.userId);
    setIsUserIdFieldOpen(false);
    resetPageIndex();
  };

  return (
    <div className="flex items-center gap-2">
      <Popover
        open={isNameFieldOpen}
        onOpenChange={(open: boolean) => {
          setIsNameFieldOpen(open);
          nameForm.setValue("name", name);
        }}
      >
        <div className="flex items-center">
          <PopoverTrigger asChild>
            <div className="h-9 flex items-center gap-3 px-4 border border-slate-300 rounded-md hover:bg-white focus-visible:ring-slate-400 shadow cursor-pointer">
              <User size={18} className="text-slate-400" />
              <p className="py-2 text-slate-800 text-sm font-normal leading-tight cursor-pointer">
                이름
              </p>
              {name && (
                <>
                  <p className="text-slate-300">|</p>
                  <div className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2">
                          {name.length > 16 ? (
                            <>
                              <TooltipContent>
                                <p>{name}</p>
                              </TooltipContent>
                            </>
                          ) : (
                            <></>
                          )}
                          <p className="max-w-[6rem] truncate text-slate-800 text-sm font-normal">
                            {name}
                          </p>
                          <X
                            size={16}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteName();
                              nameForm.reset();
                              setIsNameFieldOpen(false);
                            }}
                          />
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              )}
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent align="start" className="w-52">
          <Form {...nameForm}>
            <form onSubmit={nameForm.handleSubmit(onNameSubmit)}>
              <FormField
                control={nameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input
                          className="w-36 h-8 focus-visible:ring-slate-400"
                          placeholder="검색"
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <Search
                          size={18}
                          className="text-slate-400 cursor-pointer"
                          onClick={nameForm.handleSubmit(onNameSubmit)}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </PopoverContent>
      </Popover>
      <Popover
        open={isUserIdFieldOpen}
        onOpenChange={(open: boolean) => {
          setIsUserIdFieldOpen(open);
          userIdForm.setValue("userId", userId);
        }}
      >
        <div className="flex items-center">
          <PopoverTrigger asChild>
            <div className="h-9 flex items-center gap-3 px-4 border border-slate-300 rounded-md hover:bg-white focus-visible:ring-slate-400 shadow cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                className="mb-1"
              >
                <g clipPath="url(#clip0_1796_5612)">
                  <path
                    d="M14.75 8.75V6.5C14.75 6.10218 14.592 5.72064 14.3107 5.43934C14.0294 5.15804 13.6478 5 13.25 5H2C1.60218 5 1.22064 5.15804 0.93934 5.43934C0.658035 5.72064 0.5 6.10218 0.5 6.5V14C0.5 14.825 1.175 15.5 2 15.5H5"
                    stroke="#94A3B8"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11.75H9.5C8.67157 11.75 8 12.4216 8 13.25V15.5C8 16.3284 8.67157 17 9.5 17H14C14.8284 17 15.5 16.3284 15.5 15.5V13.25C15.5 12.4216 14.8284 11.75 14 11.75Z"
                    stroke="#94A3B8"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1796_5612">
                    <rect width="17" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p className="py-2 text-slate-800 text-sm font-normal leading-tight cursor-pointer">
                아이디
              </p>
              {userId && (
                <>
                  <p className="text-slate-300">|</p>
                  <div className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2">
                          {userId.length > 16 ? (
                            <>
                              <TooltipContent>
                                <p>{userId}</p>
                              </TooltipContent>
                            </>
                          ) : (
                            <></>
                          )}
                          <p className="max-w-[6rem] truncate text-slate-800 text-sm font-normal">
                            {userId}
                          </p>
                          <X
                            size={16}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUserId();
                              userIdForm.reset();
                              setIsUserIdFieldOpen(false);
                            }}
                          />
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              )}
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent align="start" className="w-52">
          <Form {...userIdForm}>
            <form onSubmit={userIdForm.handleSubmit(onUserIdSubmit)}>
              <FormField
                control={userIdForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input
                          className="w-36 h-8 focus-visible:ring-slate-400"
                          placeholder="검색"
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <Search
                          size={18}
                          className="text-slate-400"
                          onClick={userIdForm.handleSubmit(onUserIdSubmit)}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

{
  /* <SearchInput
        icon={<User size={18} className="text-slate-400" />}
        title="이름"
        name="name"
        value={name}
        open={isNameFieldOpen}
        onOpenChange={setIsNameFieldOpen}
        onDeleteButton={(e: React.MouseEvent<ClickHandler>) => {
          e.stopPropagation();
          deleteName();
        }}
        form={nameForm}
        onSubmit={nameForm.handleSubmit(onNameSubmit)}
      />
      <SearchInput
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
            className="mb-1"
          >
            <g clipPath="url(#clip0_1796_5612)">
              <path
                d="M14.75 8.75V6.5C14.75 6.10218 14.592 5.72064 14.3107 5.43934C14.0294 5.15804 13.6478 5 13.25 5H2C1.60218 5 1.22064 5.15804 0.93934 5.43934C0.658035 5.72064 0.5 6.10218 0.5 6.5V14C0.5 14.825 1.175 15.5 2 15.5H5"
                stroke="#94A3B8"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11.75H9.5C8.67157 11.75 8 12.4216 8 13.25V15.5C8 16.3284 8.67157 17 9.5 17H14C14.8284 17 15.5 16.3284 15.5 15.5V13.25C15.5 12.4216 14.8284 11.75 14 11.75Z"
                stroke="#94A3B8"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1796_5612">
                <rect width="17" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        }
        title="아이디"
        name="userId"
        value={userId}
        open={isUserIdFieldOpen}
        onOpenChange={setIsUserIdFieldOpen}
        onDeleteButton={(e: React.MouseEvent<ClickHandler>) => {
          e.stopPropagation();
          deleteUserId();
        }}
        form={userIdForm}
        onSubmit={userIdForm.handleSubmit(onUserIdSubmit)}
      /> */
}
