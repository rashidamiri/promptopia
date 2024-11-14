"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Form from "@components/Form"

// Separate the content that uses useSearchParams
const EditPromptContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const promptId = searchParams.get('id')
  const [submitting, setIsSubmitting] = useState(false)
  const [post, setPost] = useState({ prompt: "", tag: "" })

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`)
      const data = await response.json()
      setPost({
        prompt: data.prompt,
        tag: data.tag,
      })
    }
    if (promptId) getPromptDetails()
  }, [promptId])

  const updatePrompt = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!promptId) return alert('Prompt ID not found')
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      })
      if (response.ok) {
        router.push("/profile")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form
      type='Edit'
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  )
}

// Loading component for better UX
const LoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  )
}

// Main component wrapped with Suspense
const EditPrompt = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <EditPromptContent />
    </Suspense>
  )
}

export default EditPrompt
