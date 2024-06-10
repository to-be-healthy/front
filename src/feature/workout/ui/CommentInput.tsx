'use client';

import { IconArrowTop } from '@/shared/assets';
import { FLEX_CENTER, Typography } from '@/shared/mixin';
import { Button, Input } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { Layout } from '@/widget';

import { useWorkoutCommentContext } from '../hook/useComment';

const CommentInput = () => {
  const { target, changeTarget, changeText, ref, text, submitComment } =
    useWorkoutCommentContext();

  return (
    <Layout.BottomArea className='p-0'>
      <div className={cn('border-t border-gray-200 bg-white px-6 py-6')}>
        {target !== null && target.mode === 'create' && target.isReply && (
          <div className={cn(Typography.BODY_4_REGULAR, FLEX_CENTER, 'gap-2 pb-4')}>
            {target.comment.member.name}님에게 답글 남기는 중
            <span className='h-1 w-1 rounded-full bg-gray-500' />
            <Button
              variant='ghost'
              size='auto'
              className={cn(Typography.BODY_4_REGULAR, 'text-gray-500')}
              onClick={() => {
                changeTarget(null);
              }}>
              취소
            </Button>
          </div>
        )}
        {target !== null && target.mode === 'edit' && (
          <div className={cn(Typography.BODY_4_REGULAR, FLEX_CENTER, 'gap-2 pb-4')}>
            댓글 수정 중
            <span className='h-1 w-1 rounded-full bg-gray-500' />
            <Button
              variant='ghost'
              size='auto'
              className={cn(Typography.BODY_4_REGULAR, 'text-gray-500')}
              onClick={() => {
                changeTarget(null);
              }}>
              취소
            </Button>
          </div>
        )}
        <div className={cn(FLEX_CENTER, 'space-x-6')}>
          <div className='flex-1 rounded-md border px-6 py-[13px] focus-within:border-primary-500'>
            <Input
              ref={ref}
              placeholder='댓글을 입력하세요.'
              value={text}
              onChange={changeText}
              className='w-full'
            />
          </div>
          {text && (
            <Button variant='ghost' size='auto' onClick={submitComment}>
              <IconArrowTop />
            </Button>
          )}
        </div>
      </div>
    </Layout.BottomArea>
  );
};

export { CommentInput };
