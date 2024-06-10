import { useQuery } from '@tanstack/react-query';

import { authApi } from '@/entity/auth';
import { BaseError, BaseResponse } from '@/shared/api';

import { MyReservationResponse } from '../model/type';

export const useStudentMyReservationListQuery = () => {
  return useQuery<MyReservationResponse, BaseError>({
    queryKey: ['StudentMyReservationList'],
    queryFn: async () => {
      const res = await authApi.get<BaseResponse<MyReservationResponse>>(
        `/api/schedule/v1/student/my-reservation/new`
      );
      return res.data.data;
    },
  });
};
