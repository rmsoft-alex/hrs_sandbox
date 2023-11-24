import React, { ChangeEvent } from "react";
import {
  useCancelModalState,
  useFirstEditModalState,
  useModalAction,
  useModalState,
  useRegisterModalState,
  useSecondEditModalState,
} from "../store/useModalStore";
import { useUsrDeptAction } from "../store/useUserDeptStore";
import {
  useNewUserState,
  useUpdatedUserState,
} from "../store/useChangedUserStore";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/common/modals/confirm/defaultModal";
import { UsrDtlRes, UsrEditReq, UsrRegisterReq } from "../type";

import { Button } from "@/components/ui/button";
import { UseMutateFunction } from "@tanstack/react-query";

type FirstEditModalProps = {
  userDescription: string;
  setUserDescription: (value: string) => void;
};

type SecondEditModalProps = {
  userInfo?: UsrDtlRes;
  userDescription: string;
  putUser: UseMutateFunction<void, unknown, UsrEditReq>;
  isPutUserLoading: boolean;
};

type RegisterModalProps = {
  postUser: UseMutateFunction<void, unknown, UsrRegisterReq>;
  isPostUserLoading: boolean;
};

type ModalProps = {
  userInfo?: UsrDtlRes;
  userDescription: string;
  setUserDescription: (value: string) => void;
  postUser: UseMutateFunction<void, unknown, UsrRegisterReq>;
  putUser: UseMutateFunction<void, unknown, UsrEditReq>;
  isPostUserLoading: boolean;
  isPutUserLoading: boolean;
};

export default function UserFormModal({
  userInfo,
  userDescription,
  setUserDescription,
  postUser,
  putUser,
  isPostUserLoading,
  isPutUserLoading,
}: ModalProps) {
  const {
    isRegisterModalOpen,
    isCancelModalOpen,
    isFirstEditModalOpen,
    isSecondEditModalOpen,
  } = useModalState();

  return (
    <>
      {isFirstEditModalOpen && (
        <FirstEditModal
          userDescription={userDescription}
          setUserDescription={setUserDescription}
        />
      )}
      {isSecondEditModalOpen && (
        <SecondEditModal
          userInfo={userInfo}
          userDescription={userDescription}
          isPutUserLoading={isPutUserLoading}
          putUser={putUser}
        />
      )}
      {isRegisterModalOpen && (
        <RegisterModal
          postUser={postUser}
          isPostUserLoading={isPostUserLoading}
        />
      )}
      {isCancelModalOpen && <CancelModal />}
    </>
  );
}

const CancelModal = () => {
  const router = useRouter();
  const isCancelModalOpen = useCancelModalState();
  const { setIsCancelModalOpen } = useModalAction();
  const { initializeDept } = useUsrDeptAction();

  return (
    <Modal
      title="취소"
      description="변경 사항이 저장되지 않습니다. 취소하시겠습니까?"
      isOpen={isCancelModalOpen}
      onClose={() => setIsCancelModalOpen(false)}
    >
      <div className="w-[290px] flex justify-end gap-3">
        <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
          취소
        </Button>
        <Button
          className="bg-primary text-white"
          variant="outline"
          onClick={() => {
            initializeDept([]);
            router.push("/user");
            setIsCancelModalOpen(false);
          }}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};

const FirstEditModal = ({
  userDescription,
  setUserDescription,
}: FirstEditModalProps) => {
  const isFirstEditModalOpen = useFirstEditModalState();
  const { setIsFirstEditModalOpen, setIsSecondEditModalOpen } =
    useModalAction();
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserDescription(e.target.value);
  };

  return (
    <Modal
      title="수정"
      description=""
      isOpen={isFirstEditModalOpen}
      onClose={() => setIsFirstEditModalOpen(false)}
    >
      <div className="min-w-[290px] min-h-[180px] flex flex-col">
        <textarea
          className="min-w-[290px] min-h-[100px] resize-none outline-none rounded-[8px] border-[1px] border-slate-300 mb-[35px] p-[10px] placeholder:text-slate-400 text-sm"
          placeholder="수정 사유를 입력해주십시오.(선택)"
          value={userDescription}
          onChange={onChange}
        />
        <div className="self-end flex gap-[10px]">
          <Button
            variant="outline"
            onClick={() => setIsFirstEditModalOpen(false)}
          >
            취소
          </Button>
          <Button
            className="bg-primary text-white"
            variant="outline"
            onClick={() => {
              setIsFirstEditModalOpen(false);
              setIsSecondEditModalOpen(true);
            }}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const SecondEditModal = ({
  userInfo,
  userDescription,
  putUser,
  isPutUserLoading,
}: SecondEditModalProps) => {
  const isSecondEditModalOpen = useSecondEditModalState();
  const updatedUser = useUpdatedUserState();
  const { setIsSecondEditModalOpen } = useModalAction();
  const { initializeDept } = useUsrDeptAction();

  return (
    <Modal
      title="수정"
      description="수정하시겠습니까?"
      isOpen={isSecondEditModalOpen}
      onClose={() => setIsSecondEditModalOpen(false)}
    >
      <div className="min-w-[290px] flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setIsSecondEditModalOpen(false)}
        >
          취소
        </Button>
        <Button
          disabled={isPutUserLoading}
          className="bg-primary text-white"
          variant="outline"
          onClick={() => {
            if (userInfo?.userInfoIdx) {
              setIsSecondEditModalOpen(false);
              putUser({ ...updatedUser, userDescription });
              initializeDept([]);
            }
          }}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};

const RegisterModal = ({ postUser, isPostUserLoading }: RegisterModalProps) => {
  const isRegisterModalOpen = useRegisterModalState();
  const newUser = useNewUserState();
  const { setIsRegisterModalOpen } = useModalAction();
  const { initializeDept } = useUsrDeptAction();

  return (
    <Modal
      title="등록"
      description="등록하시겠습니까?"
      isOpen={isRegisterModalOpen}
      onClose={() => setIsRegisterModalOpen(false)}
    >
      <div className="min-w-[290px] min-h-[50px] flex justify-end gap-3">
        <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
          취소
        </Button>
        <Button
          disabled={isPostUserLoading}
          className="bg-primary text-white"
          variant="outline"
          onClick={() => {
            postUser(newUser);
            initializeDept([]);
            setIsRegisterModalOpen(false);
          }}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};
