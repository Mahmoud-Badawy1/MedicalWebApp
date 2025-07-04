import { DepartmentDetailClient } from '@/components/hospital/department-detail-client';

interface DepartmentDetailPageProps {
  params: { departmentId: string };
}

export default function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  return <DepartmentDetailClient params={params} />;
}