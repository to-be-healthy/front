import { StudentDetailPage } from '@/page/manage';

interface Props {
  params: { memberId: number };
}

const Page = ({ params }: Readonly<Props>) => {
  return <StudentDetailPage memberId={params.memberId} />;
};

export default Page;
