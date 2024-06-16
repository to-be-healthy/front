/* eslint-disable @next/next/no-img-element */
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ChangeEvent, useState } from 'react';

import {
  DietWithFasting,
  MealType,
  useDietUploadImageMutation,
  useRegisterHomeDietMutation,
} from '@/entity/diet';
import {
  IconAlbum,
  IconCameraUpload,
  IconCheck,
  IconDelete,
  IconDeleteCircleX,
  IconPlus,
} from '@/shared/assets';
import { useShowErrorToast } from '@/shared/hooks';
import { Typography } from '@/shared/mixin';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/shared/ui';
import { cn } from '@/shared/utils';

interface SelectImageProps {
  type: MealType;
  uploadFiles: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TakePhoto = ({ type, uploadFiles }: SelectImageProps) => {
  return (
    <label htmlFor={`today-${type}-camera-input`} className='cursor-pointer'>
      <Input
        id={`today-${type}-camera-input`}
        type='file'
        className='hidden'
        accept='image/*'
        capture='environment'
        onChange={uploadFiles}
      />
      <p className='flex items-center justify-start px-7 py-6'>
        <IconCameraUpload width={24} height={24} />
        <span className={cn(Typography.BODY_1, 'ml-4')}>사진 찍기</span>
      </p>
    </label>
  );
};

const SelectAlbum = ({ type, uploadFiles }: SelectImageProps) => {
  return (
    <label htmlFor={`today-${type}-album-input`} className='cursor-pointer'>
      <Input
        id={`today-${type}-album-input`}
        type='file'
        className='hidden'
        accept='image/*'
        onChange={uploadFiles}
      />
      <p className='flex items-center justify-start px-7 py-6'>
        <IconAlbum width={23} height={23} />
        <span className={cn(Typography.BODY_1, 'ml-4')}>앨범에서 선택</span>
      </p>
    </label>
  );
};

interface SetFastingProps {
  registerDiet: (fast: boolean) => void;
}

const CancelFasting = ({ registerDiet }: SetFastingProps) => {
  return (
    <Button
      variant='ghost'
      className='h-full w-full justify-start px-7 py-6'
      onClick={() => registerDiet(false)}>
      <IconDeleteCircleX />
      <span className={cn(Typography.BODY_1, 'ml-4')}>단식 해제</span>
    </Button>
  );
};

const CheckFasting = ({ registerDiet }: SetFastingProps) => {
  return (
    <Button
      variant='ghost'
      className='h-full w-full justify-start px-7 py-6'
      onClick={() => registerDiet(true)}>
      <IconCheck fill='var(--primary-500)' width={24} height={24} />
      <span className={cn(Typography.BODY_1, 'ml-4')}>단식 체크</span>
    </Button>
  );
};

interface DeleteImage {
  registerDiet: (fast: boolean) => void;
}
const DeleteImage = ({ registerDiet }: DeleteImage) => {
  return (
    <Button
      variant='ghost'
      className='h-full w-full justify-start px-7 py-6'
      onClick={() => registerDiet(false)}>
      <IconDelete width={24} height={24} />
      <span className={cn(Typography.BODY_1, 'ml-4')}>사진 삭제</span>
    </Button>
  );
};

interface DietProps {
  diet: DietWithFasting;
  type: MealType;
}

const dietText = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
};

export const TodayDiet = ({ diet, type }: DietProps) => {
  const [issheetOpen, setIsSheetOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const queryClient = useQueryClient();
  const { showErrorToast } = useShowErrorToast();

  const { mutate: uploadImageMutate, isPending: isUploadPending } =
    useDietUploadImageMutation();
  const { mutate: registerDietMutate, isPending: isRegisterPending } =
    useRegisterHomeDietMutation();

  const isAnyLoading = isUploadPending || isRegisterPending || isRefetching;

  const uploadFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles) return;

    uploadImageMutate(
      {
        uploadFiles,
      },
      {
        onSuccess: (data) => {
          registerDiet(false, data.data[0].fileUrl);
        },
      }
    );
    setIsSheetOpen(false);
  };

  const registerDiet = (fast: boolean, file?: string) => {
    const params = {
      type: type.toUpperCase(),
      fast: fast,
      file: file ? file : null,
      eatDate: dayjs(new Date()).format('YYYY-MM-DD'),
    };

    if (issheetOpen) {
      setIsSheetOpen(false);
    }

    registerDietMutate(params, {
      onSuccess: async () => {
        setIsRefetching(true);
        await queryClient
          .refetchQueries({
            queryKey: ['StudentHomeData'],
          })
          .finally(() => setIsRefetching(false));
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message ?? '에러가 발생했습니다');
      },
    });
  };

  return (
    <div className='flex w-[calc((100%-12px)/3)] items-center justify-center'>
      {/* 단식일때 */}

      {diet.fast && (
        <Sheet open={issheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger className='flex h-[88px] w-full items-center justify-center rounded-md bg-gray-100 p-0'>
            {isAnyLoading ? (
              <div className='flex h-[88px] w-full items-center justify-center'>
                로딩중...
              </div>
            ) : (
              <p
                className={cn(
                  Typography.TITLE_2,
                  'flex flex-col items-center text-gray-400'
                )}>
                <span className='mb-1'>
                  <IconCheck fill={'var(--primary-500)'} width={17} height={17} />
                </span>
                단식
              </p>
            )}
          </SheetTrigger>
          <SheetContent headerType='thumb' className='p-0 pb-9 pt-4'>
            <SheetHeader className='py-5'>{type && dietText[type]}</SheetHeader>

            <ul>
              <li className='h-[56px] border-t border-gray-100'>
                <TakePhoto type={type} uploadFiles={uploadFiles} />
              </li>
              <li className='h-[56px] border-t border-gray-100'>
                <SelectAlbum type={type} uploadFiles={uploadFiles} />
              </li>
              <li className='h-[56px] border-t border-gray-100'>
                <CancelFasting registerDiet={registerDiet} />
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      )}

      {/* 단식 아닐때 */}
      {!diet.fast && (
        <Sheet open={issheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger className='flex h-[88px] w-full cursor-pointer items-center justify-center rounded-md bg-gray-100 p-0'>
            {isAnyLoading ? (
              <div className='flex h-[88px] w-full items-center justify-center'>
                로딩중...
              </div>
            ) : diet?.dietFile?.fileUrl ? (
              <img
                src={diet?.dietFile?.fileUrl}
                alt={`${diet.type} image`}
                className='custom-image rounded-md'
              />
            ) : (
              !diet?.dietFile?.fileUrl && (
                <IconPlus width={20} height={20} fill={'var(--gray-500)'} />
              )
            )}
          </SheetTrigger>
          <SheetContent headerType='thumb' className='p-0 pb-9 pt-4'>
            <SheetHeader
              className={cn(
                Typography.TITLE_1_SEMIBOLD,
                'py-5 text-black sm:text-center'
              )}>
              {type && dietText[type]}
            </SheetHeader>

            <ul>
              <li className='h-[56px] border-t border-gray-100'>
                <TakePhoto type={type} uploadFiles={uploadFiles} />
              </li>
              <li className='h-[56px] border-t border-gray-100'>
                <SelectAlbum type={diet.type} uploadFiles={uploadFiles} />
              </li>
              {diet?.dietFile?.fileUrl ? (
                <>
                  <li className='h-[56px] border-t border-gray-100'>
                    <CheckFasting registerDiet={registerDiet} />
                  </li>
                  <li className='h-[56px] border-t border-gray-100'>
                    <DeleteImage registerDiet={registerDiet} />
                  </li>
                </>
              ) : (
                <li className='h-[56px] border-t border-gray-100'>
                  <CheckFasting registerDiet={registerDiet} />
                </li>
              )}
            </ul>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
