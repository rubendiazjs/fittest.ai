import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">
          Fittest.ai
        </h1>
        <p className="text-slate-600">
          Your agentic development playground
        </p>
        <Button onClick={() => alert('Hello from shadcn!')}>
          Click Me
        </Button>
      </div>
    </div>
  )
}

export default App
