import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsrEditReq, UsrRegisterReq } from "../type";
import { postUsr, putUsr } from "@/api/user.api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function useUserPost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: (newUser: UsrRegisterReq) =>
      postUsr(newUser)
        .then((res) => {
          if (res.code === 100) {
            toast({
              title: "등록",
              description: "성공적으로 등록되었습니다.",
              duration: 3000,
            });
            router.push("/user");
          }
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "등록",
            description: "오류가 발생했습니다. 다시 시도해주십시오.",
            duration: 3000,
          });
        }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["users", "userChangeHistory", "userInfo"],
      }),
  });

  const postUser = mutate;
  const isPostUserLoading = isLoading;

  return { postUser, isPostUserLoading };
}

export function useUserPut() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: (updatedUser: UsrEditReq) =>
      putUsr(updatedUser)
        .then((res) => {
          if (res.code === 100) {
            toast({
              title: "수정",
              description: "성공적으로 수정되었습니다.",
              duration: 3000,
            });
            router.push("/user");
          }
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "수정",
            description: "오류가 발생했습니다. 다시 시도해주십시오.",
            duration: 3000,
          });
        }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["users", "userChangeHistory", "userInfo"],
      }),
  });

  const putUser = mutate;
  const isPutUserLoading = isLoading;

  return { putUser, isPutUserLoading };
}
