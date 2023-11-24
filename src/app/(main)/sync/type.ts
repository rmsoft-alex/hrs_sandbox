//에러
export type ErrorType<T> = {
  error: T | unknown;
};

//오픈모달 state
export type OpenState = {
  statusOpen: boolean;
  regByOpen: boolean;
  startDateOpen: boolean;
  endDateOpen: boolean;
};
