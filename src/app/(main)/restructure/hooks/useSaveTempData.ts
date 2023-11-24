import { TempStorageReqType } from "@/api/restructure.api.schema";
import { useMutation } from "@tanstack/react-query";
import { postTempData } from "@/api/restructure.api";
import { useToast } from "@/components/ui/use-toast";
import { useRestructureActions } from "../store/useRestructureStore";

const useSaveTempData = (
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void
) => {
  const { toast } = useToast();
  const { setUserIsSaved, setDeptIsSaved } = useRestructureActions();

  const { mutate: tempMutate } = useMutation({
    mutationFn: postTempData,
    onSuccess(data) {
      toast({
        title: "임시저장에 성공하였습니다",
      });

      if (data === 1) setDeptIsSaved();
      if (data === 2) setUserIsSaved();
      if (onSuccessCallback) onSuccessCallback();
    },
    onError() {
      toast({
        title: "임시저장에 실패하였습니다",
        variant: "destructive",
      });

      if (onErrorCallback) onErrorCallback();
    },
  });

  let reqData: TempStorageReqType | null = null;

  const saveTempData = (
    type: "DEPARTMENT" | "USER",
    tempStorage: TempStorageReqType
  ) => {
    const deleteDep =
      tempStorage.reqRestructureDepartmentDTO.deleteDepartmentList;
    const newDep = tempStorage.reqRestructureDepartmentDTO.newDepartmentList;
    const user = tempStorage.reqRestructureUserDTO;
    if (type === "DEPARTMENT" && tempStorage) {
      reqData = {
        reqRestructureDepartmentDTO: {
          deleteDepartmentList:
            newDep &&
            newDep?.length > 0 &&
            (deleteDep === null || deleteDep?.length === 0)
              ? null
              : deleteDep,
          newDepartmentList:
            deleteDep &&
            deleteDep?.length > 0 &&
            (newDep === null || newDep?.length === 0)
              ? null
              : newDep,
        },
        reqRestructureUserDTO: null,
      };
      tempMutate(reqData);
    } else if (type === "USER" && tempStorage) {
      reqData = {
        reqRestructureDepartmentDTO: {
          deleteDepartmentList: null,
          newDepartmentList: null,
        },
        reqRestructureUserDTO: user,
      };
      tempMutate(reqData);
    } else {
      console.log(tempStorage);
    }
  };

  return { mutate: saveTempData };
};

export default useSaveTempData;
