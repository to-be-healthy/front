'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { CourseCard, CourseCardContent, CourseCardHeader } from '@/feature/member';
import {
  IconArrowDown,
  IconArrowFilledDown,
  IconArrowFilledUp,
  IconPoint,
} from '@/shared/assets';
import IconArrowRight from '@/shared/assets/images/icon_arrow_right.svg';
import IconCalendar from '@/shared/assets/images/icon_calendar_blue.svg';
import IconDefaultProfile from '@/shared/assets/images/icon_default_profile.svg';
import IconDumbel from '@/shared/assets/images/icon_dumbel.svg';
import IconEdit from '@/shared/assets/images/icon_edit.svg';
import { Typography } from '@/shared/mixin';
import {
  Card,
  CardContent,
  CardHeader,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui';
import { cn } from '@/shared/utils';
import { Layout } from '@/widget';

import { useStudentInfo } from '../../hooks/useStudentInfo';
import { profileBorderStyleMapper } from '../../utils';
import { Header } from './Header';

interface Props {
  memberId: number;
}

const TrainerStudentDetailPage = ({ memberId }: Props) => {
  const { memberInfo } = useStudentInfo(memberId);

  const [isOpen, setIsOpen] = useState(false);

  const toggleArrow = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Layout>
      {memberInfo && (
        <>
          <Header name={memberInfo.name} memberId={memberId} />
          <Layout.Contents className='hide-scrollbar p-7 pt-8'>
            <div className='mb-6 flex w-full items-center gap-x-[24px]'>
              {memberInfo.fileUrl ? (
                <Image
                  width={80}
                  height={80}
                  src={memberInfo.fileUrl}
                  alt='profile'
                  className={profileBorderStyleMapper(memberInfo.ranking)}
                />
              ) : (
                <IconDefaultProfile />
              )}
              <div className='flex flex-col'>
                <h2 className={cn('flex gap-x-[8px]', Typography.HEADING_2)}>
                  {memberInfo.name}
                </h2>
                <div
                  className={cn(
                    Typography.BODY_3,
                    'flex items-center gap-x-[6px] text-gray-500'
                  )}>
                  {memberInfo.nickName && <p>{memberInfo.nickName}</p>}
                  {memberInfo.ranking !== 999 && memberInfo.nickName && (
                    <div className='block h-[11px] w-[1px] bg-gray-300'></div>
                  )}
                  {memberInfo.ranking !== 999 && (
                    <p>
                      랭킹 <span className='text-primary-500'>{memberInfo.ranking}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center gap-x-[8px]'>
              <Card className='mb-[16px] flex w-full flex-row items-center justify-between gap-y-[28px] px-[24px] py-[12px] shadow-sm'>
                <Link
                  href={'#'}
                  className='flex flex-col items-center justify-between gap-y-[8px]'>
                  <div className='flex h-[20px] items-center justify-center'>
                    <IconCalendar />
                  </div>
                  <p className={Typography.HEADING_5}>일정 등록</p>
                </Link>
                <div className='h-[36px] w-[1px] bg-gray-100' />
                <Link
                  href={`/trainer/manage/${memberId}/edit/memo`}
                  className='flex flex-col items-center justify-between gap-y-[8px]'>
                  <div className='flex h-[20px] items-center justify-center'>
                    <IconEdit />
                  </div>
                  <p className={Typography.HEADING_5}>회원 메모</p>
                </Link>
                <div className='h-[36px] w-[1px] bg-gray-100' />
                <Link
                  href={`/trainer/manage/${memberId}/log`}
                  className='flex flex-col items-center justify-between gap-y-[8px]'>
                  <div className='flex h-[20px] items-center justify-center'>
                    <IconDumbel />
                  </div>
                  <p className={Typography.HEADING_5}>수업 일지</p>
                </Link>
              </Card>
            </div>

            {/* 수강권 있는 경우 */}
            {memberInfo.course && (
              <CourseCard
                className='mb-6'
                expiration={
                  memberInfo.course?.completedLessonCnt ===
                  memberInfo.course?.totalLessonCnt
                }>
                <Link
                  href={{
                    pathname: `/trainer/manage/${memberId}/course-history`,
                    query: { name: memberInfo.name },
                  }}>
                  <CourseCardHeader
                    gymName={memberInfo.gym.name}
                    totalLessonCnt={memberInfo.course?.totalLessonCnt}
                    remainLessonCnt={memberInfo.course?.remainLessonCnt}
                    completedLessonCnt={memberInfo.course?.completedLessonCnt}
                  />
                  <CourseCardContent
                    progressClassName={cn(
                      memberInfo.course?.completedLessonCnt ===
                        memberInfo.course?.totalLessonCnt && 'bg-gray-400'
                    )}
                    totalLessonCnt={memberInfo.course?.totalLessonCnt}
                    completedLessonCnt={memberInfo.course?.completedLessonCnt}
                  />
                </Link>
                {memberInfo?.course.remainLessonCnt > 0 ? (
                  <Collapsible className='rounded-bl-lg rounded-br-lg bg-primary-600'>
                    <CollapsibleTrigger
                      className='w-full text-white'
                      onClick={toggleArrow}>
                      <div className='flex items-center justify-between p-6'>
                        <p className={cn(Typography.HEADING_5)}>
                          {memberInfo?.point?.searchDate.split('-')[1].split('')[1]}월
                          활동 포인트
                        </p>
                        <div
                          className={cn(
                            Typography.TITLE_1,
                            'flex items-center justify-center'
                          )}>
                          {isOpen ? (
                            <IconArrowDown
                              widht={14}
                              height={14}
                              className='rotate-180'
                            />
                          ) : (
                            <>
                              <p className='mr-2 flex items-center justify-center'>
                                <IconPoint />
                                <span className='ml-[3px]'>
                                  {memberInfo?.point?.monthPoint}
                                </span>
                              </p>
                              <IconArrowDown widht={14} height={14} />
                            </>
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='p-6 pt-3'>
                      <ul className='flex'>
                        <li className='w-[130px]'>
                          <Link
                            href={{
                              pathname: `/trainer/manage/${memberId}/point-history`,
                              query: { name: memberInfo.name },
                            }}>
                            <Card className='h-full w-full gap-y-7 p-6'>
                              <CardHeader>
                                <p
                                  className={cn(
                                    Typography.HEADING_5,
                                    'flex items-center justify-start text-black'
                                  )}>
                                  <IconPoint />
                                  이번달 포인트
                                </p>
                              </CardHeader>
                              <CardContent>
                                <p
                                  className={cn(
                                    Typography.HEADING_2,
                                    'mb-7 flex items-center text-black'
                                  )}>
                                  {memberInfo?.point?.monthPoint}
                                  <span
                                    className={cn(
                                      Typography.HEADING_5,
                                      'ml-[2px] text-gray-700'
                                    )}>
                                    점
                                  </span>
                                </p>
                                <span className={cn(Typography.BODY_4, 'text-gray-400')}>
                                  누적 {memberInfo?.point?.totalPoint}
                                </span>
                              </CardContent>
                            </Card>
                          </Link>
                        </li>
                        <li className='ml-3 w-[130px]'>
                          <Card className='h-full w-full gap-y-7 p-6'>
                            <CardHeader>
                              <p
                                className={cn(
                                  Typography.HEADING_5,
                                  'flex items-center justify-start text-black'
                                )}>
                                랭킹
                              </p>
                            </CardHeader>
                            <CardContent>
                              <p
                                className={cn(
                                  Typography.HEADING_2,
                                  'mb-7 flex items-center text-black'
                                )}>
                                {memberInfo?.rank.ranking}
                                <span
                                  className={cn(
                                    Typography.HEADING_5,
                                    'ml-[2px] mr-1 text-gray-700'
                                  )}>
                                  위
                                </span>
                                {memberInfo?.rank?.ranking ===
                                memberInfo?.rank?.lastMonthRanking ? (
                                  ''
                                ) : memberInfo?.rank &&
                                  memberInfo?.rank.ranking >
                                    memberInfo?.rank.lastMonthRanking ? (
                                  <IconArrowFilledDown fill='var(--primary-500)' />
                                ) : (
                                  <IconArrowFilledUp fill='var(--point-color)' />
                                )}
                              </p>
                              <span className={cn(Typography.BODY_4, 'text-gray-400')}>
                                총 {memberInfo?.rank.totalMemberCnt}명
                              </span>
                            </CardContent>
                          </Card>
                        </li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <div className='w-full rounded-bl-lg rounded-br-lg bg-gray-400 text-white'>
                    <div className='flex items-center justify-between p-6'>
                      <p className={cn(Typography.HEADING_5)}>
                        {memberInfo?.point?.searchDate.split('-')[1].split('')[1]}월 활동
                        포인트
                      </p>
                      <div
                        className={cn(
                          Typography.TITLE_1,
                          'flex items-center justify-center'
                        )}>
                        <p className='mr-2 flex items-center justify-center'>
                          <IconPoint />
                          <span className='ml-[3px]'>
                            {memberInfo?.point?.monthPoint}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CourseCard>
            )}

            {/* 수강권 없는 경우 */}
            {!memberInfo.course && (
              <Card
                className={cn(
                  Typography.TITLE_3,
                  'mb-6 flex h-[127px] w-full items-center justify-center rounded-lg bg-gray-500 text-white'
                )}>
                현재 등록된 수강권이 없습니다.
              </Card>
            )}

            {memberInfo.diet !== null && (
              <Card className='mb-[16px] w-full gap-y-[12px] px-[16px] py-[20px] shadow-sm'>
                <CardHeader className='flex items-center justify-between text-gray-800'>
                  <h4 className={cn(Typography.TITLE_2, 'text-gray-800')}>오늘 식단</h4>
                  <Link href='#'>
                    <p className={cn(Typography.BODY_3, 'text-gray-500')}>
                      등록 식단 전체
                    </p>
                  </Link>
                </CardHeader>
                <CardContent className='flex justify-center gap-x-[6px]'>
                  <div className='h-[95px] w-[95px] bg-gray-300'></div>
                  <div className='h-[95px] w-[95px] bg-gray-300'></div>
                  <div className='h-[95px] w-[95px] bg-gray-300'></div>
                </CardContent>
              </Card>
            )}

            {memberInfo.diet === null && (
              <Card className='mb-[16px] w-full gap-y-[12px] px-[16px] py-[20px] shadow-sm'>
                <CardHeader className='flex items-center justify-between text-gray-800'>
                  <h4 className={cn(Typography.TITLE_2, 'text-gray-800')}>
                    오늘 식단
                    <span className={cn(Typography.BODY_3, 'ml-[10px] text-gray-600')}>
                      오늘 등록된 식단이 없습니다.
                    </span>
                  </h4>
                  <Link href='#'>
                    <IconArrowRight />
                  </Link>
                </CardHeader>
              </Card>
            )}

            <Card className='w-full gap-y-[12px] px-[16px] py-[20px] shadow-sm'>
              <CardHeader className='flex items-center justify-between'>
                <h4 className={cn(Typography.TITLE_2, 'text-gray-800')}>
                  개인 운동 기록
                </h4>
                <Link href='#'>
                  <IconArrowRight />
                </Link>
              </CardHeader>
            </Card>
          </Layout.Contents>
        </>
      )}
    </Layout>
  );
};

export { TrainerStudentDetailPage };
