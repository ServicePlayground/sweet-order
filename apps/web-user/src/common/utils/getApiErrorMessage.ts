export const getApiErrorMessage = (error: any) => {
  return error.response?.data?.data?.message || error.response?.data?.message || error.message;
};
