"use client"
import { Button } from "@/components/ui/button"
import { applytoAJob } from "@/lib/actions/jobs"
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
      const application = {
        jobId: job._id,
        jobTitle: job.title,
        userId: session.user.id,
        email: session.user.email,
      }

      const result = await applytoAJob(application)
      if (result.insertedId) {
        console.log("Application Submitted Successfully")
        router.push('/browse-jobs/')
      }

    }else{
      console.log('user is not job a seeker')
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
