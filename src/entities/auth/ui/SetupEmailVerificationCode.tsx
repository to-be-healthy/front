import { FormEvent, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { EXCLUDE_SPACE_REGEXP, SignUpFormType } from '@/entities/auth';
import { Button, TextInput } from '@/shared/ui';

interface SetupEmailProps {
  step: number;
  isEmailVerified: boolean;
  isPending: boolean;
  handleSendVerificationCode: (e: FormEvent<HTMLButtonElement>) => void;
}

export const SetupEmailVerificationCode = ({
  step,
  isEmailVerified,
  isPending,
  handleSendVerificationCode,
}: SetupEmailProps) => {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<SignUpFormType>();

  const verificationCodeValue = watch('emailVerifiedCode');

  useEffect(() => {
    clearErrors('emailVerifiedCode');
  }, [verificationCodeValue]);

  return (
    <div className='mb-[16px] flex flex-col'>
      <label
        htmlFor='emailVerifiedCode'
        className='typography-title-3 mb-3 text-gray-800'>
        인증번호 입력
      </label>
      <div className='flex items-center justify-between'>
        <TextInput
          type='number'
          id='emailVerifiedCode'
          inputMode='numeric'
          pattern='[0-9]*'
          containerClassName='h-[44px] w-[calc(100%-76px-6px)]'
          className={errors.emailVerifiedCode && 'border-point focus:border-point'}
          placeholder='인증번호 6자리를 입력해주세요.'
          isEmailVerified={isEmailVerified}
          value={verificationCodeValue}
          clearValueButton={() => setValue('emailVerifiedCode', '')}
          {...register('emailVerifiedCode', {
            pattern: {
              value: EXCLUDE_SPACE_REGEXP,
              message: '공백 문자를 포함할 수 없습니다',
            },
          })}
        />
        <Button
          type='button'
          className='typography-heading-5 h-[44px] w-[76px] rounded-md bg-gray-700'
          onClick={handleSendVerificationCode}
          disabled={(step > 3 && isEmailVerified) || isPending}>
          재전송
        </Button>
      </div>

      {errors.emailVerifiedCode && (
        <p className='typography-body-4 mt-[8px] text-[#FF4668]'>
          {errors.emailVerifiedCode.message}
        </p>
      )}
    </div>
  );
};
