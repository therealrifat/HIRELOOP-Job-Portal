const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL

import type { JobApplication } from "@/types/applications"



export const getJobs = async(quary="")=>{
    console.log("text",quary)
    const res = await fetch(`${BASE_URL}/jobs?${quary}`)
    return res.json()
}


export const getJobById =async(jobId: string)=>{
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`)
    return res.json()

}


export const getMyApplications =async(query=""): Promise<JobApplication[]>=>{
    const res = await fetch(`${BASE_URL}/applications?${query}`)
    return res.json()


}
export const getMyApplicationsCount =async(query="")=>{
    const res = await fetch(`${BASE_URL}/applications/counts?${query}`)
    return res.json()


}


// get premium use info
export const getUserPremiumById =async(userId: string)=>{
    const res = await fetch(`${BASE_URL}/users/${userId}/premium`)
    return res.json()


}




