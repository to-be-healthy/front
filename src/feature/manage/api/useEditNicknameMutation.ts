import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/entity/auth';
import { BaseError, BaseResponse } from '@/shared/api';

interface EditNicknameRequest {
  studentId: number;
  nickname: string;
}

export const useEditNicknameMutation = () => {
  return useMutation<BaseResponse<boolean>, BaseError, EditNicknameRequest>({
    mutationFn: async ({ studentId, nickname }) => {
      const result = await authApi.post<BaseResponse<boolean>>(
        `/api/members/v1/nickname/${studentId}?nickname=${nickname}`
      );
      return result.data;
    },
  });
};
