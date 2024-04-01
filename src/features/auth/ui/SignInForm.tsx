import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

import { authMutation, useAuthAction } from '@/entities/auth';
import { Button, Input } from '@/shared/ui';

import { LoginForm } from '../model';

export const SignInForm = ({ memberType }: { memberType: 'trainer' | 'student' }) => {
  const router = useRouter();
  const { mutate } = authMutation.useSignIn();
  const { setUserInfo } = useAuthAction();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = (credentials) => {
    mutate(
      { ...credentials, memberType: memberType.toUpperCase() },
      {
        onSuccess: ({ data }) => {
          setUserInfo(data);
          router.replace(`/${data.memberType.toLowerCase()}`);
        },
        onError: (error) => {
          const message = error.response?.data?.message ?? '문제가 발생했습니다.';
          alert(message);
        },
      }
    );
  };

  return (
    <form
      className='flex w-full flex-col items-center gap-y-6'
      onSubmit={handleSubmit(onSubmit)}>
      <div className='flex w-full flex-col gap-y-2'>
        <label htmlFor='id'>아이디</label>
        <Input
          id='id'
          type='text'
          inputMode='text'
          placeholder='아이디를 입력해주세요.'
          className={errors.userId && 'border-point focus:border-point'}
          {...register('userId', {
            required: {
              value: true,
              message: '아이디를 입력해주세요.',
            },
          })}
        />
        {errors.userId && (
          <span className='typography-body-4 text-point'>{errors.userId.message}</span>
        )}
      </div>
      <div className='flex w-full flex-col gap-y-2'>
        <label htmlFor='password'>비밀번호</label>
        <Input
          id='password'
          type='password'
          inputMode='text'
          className={errors.password && 'border-point focus:border-point'}
          placeholder='비밀번호를 입력해주세요.'
          {...register('password', {
            required: {
              value: true,
              message: '비밀번호를 입력해주세요.',
            },
          })}
        />
        {errors.password && (
          <span className='typography-body-4 text-point'>{errors.password.message}</span>
        )}
      </div>
      <div className='mt-[18px] flex w-full flex-col gap-y-2.5'>
        <Button type='submit' size='full'>
          로그인
        </Button>
        <Button variant='outline' size='full' asChild>
          <Link href={`/sign-up?type=${memberType}`}>회원가입</Link>
        </Button>
      </div>
    </form>
  );
};
