"use client"
import { Button } from "@/components/ui/button"
import { applytoAJob } from "@/lib/actions/jobs"
import { getMyApplicationsCount } from "@/lib/api/jobs"
import { useSession } from "@/lib/auth-client"
import { ManagedJob } from "@/types/jobs"
import { useRouter } from "next/navigation"

const JobApply = ({ job }: { job: ManagedJob }) => {
  const router = useRouter()

  const { data: session } = useSession()
  const handleApply = async () => {
    if (!session?.user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
    } else if (session.user.role === "seeker") {
      const countResult = await getMyApplicationsCount(`applicantId=${session?.user.id}`)


      if(countResult.counts >= 11){
        router.push('/payment')
        return

      }else{

      

      const application = {
        jobId: job._id,
        jobTitle: job.title,
        userId: session.user.id,
        email: session.user.email,
        status: "applied",
        companyName: "Kohi Naam Nehi hain",
        jobLocation: "Remote",
        jobType: "full-time",
        dateApplied: "2026-11-14T09:00:00.000Z",
        lastUpdated: "2026-11-14T09:00:00.000Z",
      }

      const result = await applytoAJob(application)
      if (result.insertedId) {
        console.log("Application Submitted Successfully", countResult)

        router.push("/browse-jobs/")
      }
      }
    } else {
      console.log("user is not job a seeker")
    }
  }
  return (
    <div>
      <Button
        onClick={handleApply}
        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white hover:from-violet-600 hover:to-indigo-600"
      >
        Apply Now
      </Button>
    </div>
  )
}

export default JobApply
