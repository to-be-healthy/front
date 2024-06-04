'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useEditNicknameMutation } from '@/feature/manage';
import { IconCheck, IconError } from '@/shared/assets';
import IconClose from '@/shared/assets/images/icon_close.svg';
import IconDefaultProfile from '@/shared/assets/images/icon_default_profile.svg';
import { Typography } from '@/shared/mixin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  useToast,
} from '@/shared/ui';
import { cn, twSelector } from '@/shared/utils';
import { Layout } from '@/widget';

import { useStudentInfo } from '../hooks/useStudentInfo';

interface Props {
  memberId: number;
}

const StudentEditNickname = ({ memberId }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate } = useEditNicknameMutation();
  const { memberInfo, refetchMemberInfo } = useStudentInfo(memberId);
  const [newNickName, setNewNickName] = useState(memberInfo?.nickName ?? '');

  const onSubmit = () => {
    if (!newNickName) {
      return toast({
        className: 'py-5 px-6',
        description: (
          <div className='flex items-center justify-center'>
            <IconError />
            <p className='typography-heading-5 ml-6 text-white'>별칭을 입력해주세요.</p>
          </div>
        ),
        duration: 2000,
      });
    }

    if (memberInfo?.nickName === newNickName) {
      return toast({
        className: 'py-5 px-6',
        description: (
          <div className='flex items-center justify-center'>
            <IconError />
            <p className='typography-heading-5 ml-6 text-white'>기존 별칭과 같습니다.</p>
          </div>
        ),
        duration: 2000,
      });
    }

    changeNickname();
  };

  const changeNickname = () => {
    mutate(
      { studentId: Number(memberId), nickname: newNickName },
      {
        onSuccess: async (data) => {
          await refetchMemberInfo();
          toast({
            className: 'py-5 px-6',
            description: (
              <div className='flex items-center justify-center'>
                <IconCheck fill={'var(--primary-500)'} width={17} height={17} />
                <p className='typography-heading-5 ml-6 text-white'>{data.message}</p>
              </div>
            ),
            duration: 2000,
          });
          router.replace(`/trainer/manage/${memberId}`);
        },
        onError: (error) => {
          toast({
            className: 'py-5 px-6',
            description: (
              <div className='flex items-center justify-center'>
                <IconError />
                <p className='typography-heading-5 ml-6 text-white'>
                  {error.response?.data.message}
                </p>
              </div>
            ),
            duration: 2000,
          });
        },
      }
    );
  };

  return (
    <Layout className='bg-white'>
      <Layout.Header>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.replace(`/trainer/manage/${memberId}`)}>
          <IconClose width={20} height={20} />
        </Button>
        <h2 className={Typography.HEADING_4_SEMIBOLD}>회원 별칭 설정</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' className={cn(Typography.BODY_1, 'p-0')}>
              완료
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='space-y-[24px]'>
            <AlertDialogHeader className='text-left'>
              <AlertDialogTitle
                className={cn(Typography.TITLE_1_SEMIBOLD, 'mx-auto mb-3')}>
                별칭을 저장할까요?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className='grid w-full grid-cols-2 items-center justify-center gap-3'>
              <AlertDialogCancel
                className={cn(
                  Typography.TITLE_1_SEMIBOLD,
                  'm-0 h-12 rounded-md bg-gray-100 p-4 text-gray-600'
                )}>
                아니요
              </AlertDialogCancel>
              <AlertDialogAction
                className={cn(Typography.TITLE_1_SEMIBOLD, 'm-0 h-12 p-4 text-white')}
                onClick={onSubmit}>
                예
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout.Header>
      <Layout.Contents className='mt-[36px] flex flex-col gap-y-[36px] px-[20px]'>
        <Button variant='ghost' size='auto' className='mx-auto pt-[24px]'>
          <IconDefaultProfile />
        </Button>
        <div className='flex w-full flex-col space-y-[8px]'>
          <label htmlFor='name' className={Typography.TITLE_3}>
            이름
          </label>
          <div
            className={cn(
              'rounded-md border border-gray-200 bg-gray-100 px-[16px] py-[13px]'
            )}>
            <Input
              defaultValue={memberInfo?.name}
              id='name'
              readOnly
              className={cn(
                Typography.BODY_1,
                twSelector('placeholder', Typography.BODY_1),
                'w-full bg-transparent text-gray-500 read-only:bg-transparent'
              )}
            />
          </div>
        </div>
        <div className='flex w-full flex-col space-y-[8px]'>
          <label htmlFor='name' className={Typography.TITLE_3}>
            별칭
          </label>
          <div className={cn('rounded-md border border-gray-200 px-[16px] py-[13px]')}>
            <Input
              defaultValue={newNickName}
              id='name'
              placeholder='별칭을 입력해주세요.'
              onChange={(e) => setNewNickName(e.target.value)}
              className={cn(
                Typography.BODY_1,
                twSelector('placeholder', Typography.BODY_1),
                'w-full bg-transparent text-gray-800 placeholder:text-gray-500'
              )}
            />
          </div>
        </div>
      </Layout.Contents>
    </Layout>
  );
};

export { StudentEditNickname };
