import { getMyApplications } from '@/lib/api/jobs';
import React from 'react';

type Props = { params: Promise<{ id: string }> };

const JobDetailPage =async ({ params }: Props) => {
    const { id } = await params
    const applications = await getMyApplications(`jobId=${id}`)
    return (
        <div>
            <h1>Job Deatil Page</h1>
        </div>
    );
};

export default JobDetailPage;