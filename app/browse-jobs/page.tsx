import { getJobs } from '@/lib/api/jobs';
import { JobFormData, ManagedJob } from '@/types/jobs';
import React from 'react';

const BrowseJob =async ({searchParams}:{searchParams :Promise<{ [key: string]: string | string[] | undefined }>}) => {

    const search = await searchParams
    const urlSerach = new URLSearchParams(search as Record<string, string>)
    const quary = urlSerach.toString()

    const jobs:ManagedJob[] = await getJobs(quary)
    console.log(jobs)

    console.log(quary)
    return (
        <div>
            <p>Browse Job</p>

            <ul>
                {jobs.map((job:ManagedJob)=><li key={job._id}> {job.title}</li>)}
            </ul>
        </div>
    );
};

export default BrowseJob;

