const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL

export const getJobs = async(quary="")=>{
    const res = await fetch(`${BASE_URL}/jobs?${quary}`)
    return res.json()
}


export const getJobById =async(jobId: string)=>{
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`)
    return res.json()

}


export const getMyApplications =async(query="")=>{
    const res = await fetch(`${BASE_URL}/applications?${query}`)
    return res.json()


}