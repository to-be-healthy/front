import { TrainerLogDetailPage } from '@/page/feedback';

interface Props {
  params: { logId: number; memberId: number };
}

const Page = ({ params }: Props) => {
  return <TrainerLogDetailPage logId={params.logId} memberId={params.memberId} />;
};

export default Page;
