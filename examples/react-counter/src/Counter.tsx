import React, { useState } from "react"
import { useXSkill } from "@x-skills-for-ai/react"

export function Counter() {
  const [count, setCount] = useState(0)

  // Register increment skill
  useXSkill({
    id: "increment",
    description: "Increase counter",
    handler: () => setCount(c => c + 1)
  })

  // Register decrement skill
  useXSkill({
    id: "decrement",
    description: "Decrease counter",
    handler: () => setCount(c => c - 1)
  })

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  )
}
