import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { IconCheck } from '@/shared/assets';
import CancelCalendarIcon from '@/shared/assets/images/icon_cancel_calendar.svg';
import ErrorIcon from '@/shared/assets/images/icon_error.svg';
import ReservationCalendarIcon from '@/shared/assets/images/icon_reservation_calendar.svg';
import ScheduleIcon from '@/shared/assets/images/icon_schedule.svg';
import { Typography } from '@/shared/mixin';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
  useToast,
} from '@/shared/ui';
import { cn } from '@/shared/utils';

import { useStudentCancelReservationScheduleMutation } from '../api/useStudentCancelReservationScheduleMutation';
import { ScheduleData } from '../model/type';

interface Props {
  data: ScheduleData | null;
}

export const StudentMyReservationSchedule = ({ data }: Props) => {
  const [isReservationInfoSheetOpen, setIsReservationInfoSheetOpen] = useState(false);
  const [isCancelSheetOpen, setIsCancelSheetOpen] = useState(false);
  const [startHours, startMinutes] = data?.lessonStartTime?.split(':') ?? ['00', '00'];
  const [endHours, endMinutes] = data?.lessonEndTime?.split(':') ?? ['00', '00'];
  const [isPastDate, setIsPastDate] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useStudentCancelReservationScheduleMutation();

  const modifiedTime = dayjs(`${data?.lessonDt} ${data?.lessonStartTime}`)
    .subtract(30, 'minute')
    .format('HH:mm');

  const [reservationHours, reservationMinutes] = modifiedTime.split(':');

  const selectDate = dayjs(data?.lessonDt).format('MM.DD(dd)');
  const previousDate = dayjs(data?.lessonDt).subtract(1, 'day').format('MM.DD(dd)');
  const reservatioDate = dayjs(data?.lessonDt).format('MM월 DD일 dddd');

  const currentTime = new Date();
  const classDate = new Date(`${data?.lessonDt} ${data?.lessonStartTime}`);

  const handleIsPastDate = () => {
    const isPast = dayjs(currentTime).isAfter(dayjs(classDate).subtract(1, 'day'));
    setIsPastDate(isPast);
  };

  const handleCancelReservation = () => {
    setIsReservationInfoSheetOpen(false);
    setIsCancelSheetOpen(true);
  };

  const convertTo12HourFormat = (hour: number) => {
    return hour > 12 ? hour - 12 : hour;
  };

  const handleCancelSchedule = (scheduleId: number) => {
    mutate(scheduleId, {
      onSuccess: ({ message }) => {
        setIsCancelSheetOpen(false);
        void queryClient.invalidateQueries({
          queryKey: ['StudentMyReservationList'],
        });
        void queryClient.invalidateQueries({
          queryKey: ['scheduleList'],
        });
        void queryClient.invalidateQueries({
          queryKey: ['StudentCalendarMyReservationList'],
        });
        toast({
          className: 'h-12',
          description: (
            <div className='flex items-center justify-center'>
              <IconCheck fill={'var(--primary-500)'} />
              <p className='typography-heading-5 ml-6 text-[#fff]'>{message}</p>
            </div>
          ),
          duration: 2000,
        });
      },
      onError: (error) => {
        toast({
          className: 'h-12',
          description: (
            <div className='flex items-center justify-center'>
              <ErrorIcon fill={'var(--primary-500)'} />
              <p className='typography-heading-5 ml-6 text-[#fff]'>
                {error.response?.data.message}
              </p>
            </div>
          ),
          duration: 2000,
        });
      },
    });
  };

  useEffect(() => {
    handleIsPastDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li className='relative mb-5'>
      {data ? (
        <>
          <Sheet
            open={isReservationInfoSheetOpen}
            onOpenChange={setIsReservationInfoSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                className='block h-full w-full p-0'
                onClick={handleIsPastDate}>
                <Card className='w-full px-6 py-7 text-left'>
                  <CardHeader className={cn(Typography.TITLE_3, 'text-gray-600')}>
                    {reservatioDate}
                  </CardHeader>
                  <CardContent>
                    <p
                      className={cn(
                        Typography.TITLE_1_BOLD,
                        'flex items-center justify-start text-black'
                      )}>
                      {Number(startHours) < 12 ? '오전 ' : '오후 '}
                      {`${convertTo12HourFormat(Number(startHours))}:${startMinutes}`}-
                      {`${convertTo12HourFormat(Number(endHours))}:${endMinutes}`}
                      <span className='ml-1'>
                        <IconCheck fill={'var(--primary-500)'} />
                      </span>
                    </p>
                    {!isPastDate && (
                      <Button
                        asChild
                        variant='ghost'
                        onClick={(event) => {
                          handleCancelReservation();
                          event.stopPropagation(); // 이벤트 버블링 중지
                        }}>
                        <span
                          className={cn(
                            Typography.BODY_3,
                            'absolute right-6 top-[50%] h-[36px] w-[82px] -translate-y-1/2 transform rounded-md bg-gray-100 text-center text-gray-700'
                          )}>
                          예약취소
                        </span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Button>
            </SheetTrigger>
            <SheetContent side='bottom' headerType='thumb'>
              <SheetHeader className='mb-8 text-left'>
                <h2 className={cn(Typography.HEADING_4_BOLD, 'mb-2 text-black')}>
                  예약 정보
                </h2>
                <p className={cn(Typography.TITLE_2, 'text-gray-600')}>
                  무단결석이나 24시간 내 예약을 취소하지 못한 경우 수강권에서 잔여 횟수가
                  자동 차감됩니다.
                </p>
              </SheetHeader>

              <div>
                <div
                  className={cn(
                    'mb-7 rounded-md bg-gray-100 p-6 text-center text-black',
                    Typography.HEADING_3
                  )}>
                  {selectDate} {Number(startHours) < 12 ? '오전 ' : '오후 '}
                  {`${convertTo12HourFormat(Number(startHours))}:${startMinutes}`}-
                  {`${convertTo12HourFormat(Number(endHours))}:${endMinutes}`}
                </div>

                <div className='mb-11'>
                  <dl className='mb-2 flex items-center justify-between'>
                    <dt className='flex items-center justify-between'>
                      <ReservationCalendarIcon />
                      <span
                        className={cn('ml-2 text-gray-600', Typography.TITLE_1_SEMIBOLD)}>
                        예약
                      </span>
                    </dt>
                    <dd className={cn(Typography.BODY_1, 'text-gray-600')}>
                      {selectDate} {Number(reservationHours) < 12 ? '오전 ' : '오후 '}
                      {convertTo12HourFormat(Number(reservationHours))}:
                      {reservationMinutes} 까지
                    </dd>
                  </dl>
                  <dl className='mb-2 flex items-center justify-between'>
                    <dt className='flex items-center justify-between'>
                      <CancelCalendarIcon />
                      <span
                        className={cn('ml-2 text-gray-600', Typography.TITLE_1_SEMIBOLD)}>
                        취소
                      </span>
                    </dt>
                    <dd className={cn(Typography.BODY_1, 'text-gray-600')}>
                      {previousDate} {Number(startHours) < 12 ? '오전 ' : '오후 '}
                      {convertTo12HourFormat(Number(startHours))}:{startMinutes} 까지
                    </dd>
                  </dl>
                </div>
              </div>

              <SheetFooter className='flex flex-row items-center justify-center gap-3'>
                {isPastDate ? (
                  <Button
                    className='h-[48px] w-full rounded-md'
                    onClick={() => setIsReservationInfoSheetOpen(false)}>
                    확인
                  </Button>
                ) : (
                  <>
                    <SheetClose
                      className={cn(
                        'h-[48px] w-full rounded-md bg-gray-100 text-gray-600',
                        Typography.TITLE_1_SEMIBOLD
                      )}>
                      확인
                    </SheetClose>
                    <Button
                      className={cn(
                        'h-[48px] w-full rounded-md bg-point',
                        Typography.TITLE_1_SEMIBOLD
                      )}
                      onClick={handleCancelReservation}>
                      예약취소
                    </Button>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Sheet open={isCancelSheetOpen} onOpenChange={setIsCancelSheetOpen}>
            <SheetContent side='bottom' headerType='thumb'>
              <SheetHeader className='mb-8 text-left'>
                <h2 className={cn(Typography.HEADING_4_BOLD, 'mb-2 text-black')}>
                  예약을 취소할까요?
                </h2>
              </SheetHeader>

              <div
                className={cn(
                  'mb-11 rounded-md bg-gray-100 p-6 text-center text-black',
                  Typography.HEADING_3
                )}>
                {selectDate} {Number(startHours) < 12 ? '오전 ' : '오후 '}
                {`${convertTo12HourFormat(Number(startHours))}:${startMinutes}`}-
                {`${convertTo12HourFormat(Number(endHours))}:${endMinutes}`}
              </div>

              <SheetFooter className='flex flex-row items-center justify-center gap-3'>
                <SheetClose
                  className={cn(
                    'h-[48px] w-full rounded-md bg-gray-100 text-gray-600',
                    Typography.TITLE_1_SEMIBOLD
                  )}>
                  아니요
                </SheetClose>
                <Button
                  className={cn(
                    'h-[48px] w-full rounded-md bg-point',
                    Typography.TITLE_1_SEMIBOLD
                  )}
                  onClick={() => handleCancelSchedule(data?.scheduleId)}>
                  취소하기
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center py-[130px]'>
          <ScheduleIcon />
          <p className={cn(Typography.TITLE_1, 'mt-4 text-gray-400')}>
            예약된 수업이 없습니다.
          </p>
        </div>
      )}
    </li>
  );
};
