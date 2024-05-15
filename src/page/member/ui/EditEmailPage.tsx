'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  useCheckVerificationCodeMutation,
  useSendVerificationCodeMutation,
} from '@/entity/auth';
import { useMyInfoQuery } from '@/feature/member';
import { IconBack } from '@/shared/assets';
import { Typography } from '@/shared/mixin';
import { Button, Input, Layout } from '@/shared/ui';
import { cn } from '@/shared/utils';

const EditEmailPage = () => {
  const { data } = useMyInfoQuery();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const { mutate: sendCode } = useSendVerificationCodeMutation();
  const { mutate: confirmCode } = useCheckVerificationCodeMutation();

  const sendVerificationCode = () => {
    sendCode(email, {
      onSuccess: () => {
        setStep(2);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const confirmVerificationCode = () => {
    confirmCode(
      { email, emailKey: code },
      {
        onSuccess: () => {
          submitNewEmail();
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  const submitNewEmail = () => {
    alert('이메일 변경 성공');
  };

  return (
    <Layout className='bg-white'>
      <Layout.Header>
        <Link href={'/trainer/mypage/info'}>
          <IconBack />
        </Link>
        <h1 className={cn(Typography.HEADING_4_SEMIBOLD)}>이메일 변경</h1>
        <div className='w-[40px] cursor-default bg-transparent' tabIndex={-1}></div>
      </Layout.Header>
      <Layout.Contents>
        {step === 2 && (
          <section className='space-y-3 px-7 pt-8'>
            <h3 className={cn(Typography.TITLE_3)}>
              이메일로 발송된 인증번호를 입력해주세요.
            </h3>
            <div className='flex w-full gap-2'>
              <div className='w-full rounded-md border border-gray-200 px-6 py-[13px]'>
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <Button className='h-full bg-gray-700 px-6' onClick={() => sendCode(email)}>
                재전송
              </Button>
            </div>
          </section>
        )}
        <section className='space-y-3 px-7 pt-8'>
          <h3 className={cn(Typography.TITLE_3)}>변경하실 이메일을 입력해주세요.</h3>
          <div className='rounded-md border border-gray-200 px-6 py-[13px]'>
            <Input
              defaultValue={data?.email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn('w-full')}
              readOnly={step !== 1}
            />
          </div>
        </section>
      </Layout.Contents>
      <Layout.BottomArea>
        {step === 1 && (
          <Button
            size='full'
            disabled={email === data?.email || email === ''}
            onClick={sendVerificationCode}>
            인증 요청
          </Button>
        )}
        {step === 2 && (
          <Button size='full' disabled={!code} onClick={confirmVerificationCode}>
            인증 완료
          </Button>
        )}
      </Layout.BottomArea>
    </Layout>
  );
};

export { EditEmailPage };
