import { JobFormData } from "@/types/jobs"
import type { ApplyToJobPayload } from "@/types/applications"

const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL


export const createJob = async(data: JobFormData & {status: string} )=>{
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            "Content-Type" :"application/json"
        },
        body: JSON.stringify(data)
    })

    return res.json()

}
export const deleteJob = async(jobId: string )=>{
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
        
    })

    return res.json()

}


export const applytoAJob =async(application: ApplyToJobPayload)=>{
    const res = await fetch(`${BASE_URL}/applications`,{
        method: "POST",
         headers: {
            "Content-Type" :"application/json"
        },
        body: JSON.stringify(application)


    })
    return res.json()
}

// TODO: implement — PATCH the application's status in the DB
// (e.g. PATCH ${BASE_URL}/applications/:id with { status }).
// Called by StatusSelect in the recruiter's View Applicants pipeline;
// until then it only resolves so the UI flow can be built and tested.
export const updateApplicationStatus = async(
    applicationId: string,
    status: string
)=>{
    console.log(`[stub] updateApplicationStatus(${applicationId}, ${status})`)
    return { applicationId, status, updated: false }
}




export const checkoutVerify = async(sessionId: string)=>{

    const res = await fetch(`${BASE_URL}/payments/checkout-verify`,{
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({sessionId})
    })

    return res.json()
}