import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/entity/auth';
import { BaseError, BaseResponse } from '@/shared/api';

import { InviteForm } from '../model/types';

interface InviteResponse {
  uuid: string;
  invitationLink: string;
}

export const useInviteStudentMutation = () => {
  return useMutation<BaseResponse<InviteResponse>, BaseError, InviteForm>({
    mutationFn: async (invitationInfo) => {
      const result = await authApi.post<BaseResponse<InviteResponse>>(
        '/api/trainers/v1/invitation',
        invitationInfo
      );
      return result.data;
    },
  });
};
