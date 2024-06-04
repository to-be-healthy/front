import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/entity/auth';
import { Diet } from '@/feature/member';
import { BaseError, BaseResponse } from '@/shared/api';

import { RegisterAndEditDiet } from '../model/types';

export const useRegisterDietMutation = () => {
  return useMutation<BaseResponse<Diet>, BaseError, RegisterAndEditDiet>({
    mutationFn: async (params) => {
      const result = await authApi.post<BaseResponse<Diet>>(`/api/diets/v1`, params);
      return result.data;
    },
  });
};
