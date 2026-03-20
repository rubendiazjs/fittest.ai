import { useState, useEffect, useCallback, useRef } from 'react'

interface UseRestTimerOptions {
  initialSeconds: number
  onComplete: () => void
  autoStart?: boolean
}

interface UseRestTimerReturn {
  seconds: number
  isRunning: boolean
  progress: number // 0-100 percentage
  actions: {
    pause: () => void
    resume: () => void
    skip: () => void
    reset: (newSeconds: number) => void
  }
}

/**
 * Hook for managing rest timer countdown between rounds
 */
export function useRestTimer({
  initialSeconds,
  onComplete,
  autoStart = true,
}: UseRestTimerOptions): UseRestTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      return
    }

    intervalRef.current = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          // Call onComplete in next tick to avoid state update during render
          setTimeout(() => onCompleteRef.current(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, seconds])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    if (seconds > 0) {
      setIsRunning(true)
    }
  }, [seconds])

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setSeconds(0)
    setIsRunning(false)
    onCompleteRef.current()
  }, [])

  const reset = useCallback((newSeconds: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setSeconds(newSeconds)
    setIsRunning(true)
  }, [])

  // Calculate progress (how much time has passed)
  const progress = initialSeconds > 0
    ? ((initialSeconds - seconds) / initialSeconds) * 100
    : 100

  return {
    seconds,
    isRunning,
    progress,
    actions: { pause, resume, skip, reset },
  }
}
