import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FieldPath,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormUnregister,
  UseFormWatch,
  UseFormGetValues,
  UseFormTrigger,
  UseFormReset,
  UseFormClearErrors,
  UseFormHandleSubmit,
  UseControllerReturn,
  UseFormGetFieldState,
  UseFormSetError,
  UseFormSetFocus,
  UseFormResetField,
  useForm,
} from "react-hook-form";

type IconType = string | React.ReactNode;

type UseFormReturn<TFieldValues extends FieldValues = FieldValues> = {
  register: UseFormRegister<TFieldValues>;
  unregister: UseFormUnregister<TFieldValues>;
  handleSubmit: UseFormHandleSubmit<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  getValues: UseFormGetValues<TFieldValues>;
  trigger: UseFormTrigger<TFieldValues>;
  formState: UseFormStateReturn<TFieldValues>;
  reset: UseFormReset<TFieldValues>;
  clearErrors: UseFormClearErrors<TFieldValues>;
  control: UseControllerReturn<TFieldValues>;
  getFieldState: UseFormGetFieldState<TFieldValues>;
  setError: UseFormSetError<TFieldValues>;
  resetField: UseFormResetField<TFieldValues>;
  setFocus: UseFormSetFocus<TFieldValues>;
};

type InputProps<T extends FieldValues> = {
  icon: IconType;
  title: string;
  name: FieldPath<T>;
  value: string;
  open: boolean;
  onOpenChange: (newState: boolean) => void;
  onDeleteButton: (e: any) => void;
  form: any;
  onSubmit: any;
};

function SearchInput<T extends FieldValues>({
  icon,
  title,
  name,
  value,
  open,
  onOpenChange,
  onDeleteButton,
  form,
  onSubmit,
}: InputProps<T>) {
  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div className="h-9 px-[0.8125rem] py-2 bg-white rounded-md shadow border border-slate-300 justify-start items-center gap-[0.4375rem] inline-flex cursor-pointer focus-visible:ring-slate-400">
            {icon}
            <p className="py-2 text-slate-800 text-sm font-normal leading-tight">
              {title}
            </p>
            {value && (
              <>
                <p className="text-slate-300">|</p>
                <div className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2">
                        {value.length > 15 ? (
                          <>
                            <TooltipContent>
                              <p>{value}</p>
                            </TooltipContent>
                          </>
                        ) : (
                          <></>
                        )}
                        <p className="max-w-[12rem] truncate text-slate-800 text-sm font-normal">
                          {value}
                        </p>
                        <X size={16} onClick={onDeleteButton} />
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-52">
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name={name}
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
                          onClick={onSubmit}
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
    </>
  );
}

export default SearchInput;
