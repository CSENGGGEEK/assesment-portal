"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Play, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { Question, TestCase, ProgrammingLanguage } from "@/lib/assessment-definitions"

interface CodeEditorProps {
  question: Question
  initialCode?: string
  onCodeChange: (code: string) => void
  onSubmit: (code: string, results: any) => void
  timeLimit?: number
  readOnly?: boolean
}

interface TestResult {
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  executionTime: number
  error?: string
}

export function CodeEditor({
  question,
  initialCode = "",
  onCodeChange,
  onSubmit,
  timeLimit,
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || question.starterCode || "")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || question.timeLimitSeconds || 300)

  useEffect(() => {
    if (timeLimit && timeLimit > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLimit])

  useEffect(() => {
    onCodeChange(code)
  }, [code, onCodeChange])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getLanguageTemplate = (language: ProgrammingLanguage) => {
    const templates = {
      javascript: `// Write your solution here
function solution() {
    // Your code here
    return result;
}`,
      python: `# Write your solution here
def solution():
    # Your code here
    return result`,
      java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
      cpp: `// Write your solution here
#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
      c: `// Write your solution here
#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,
    }
    return templates[language] || templates.javascript
  }

  const executeCode = async (testCase?: TestCase) => {
    setIsRunning(true)

    try {
      // Simulate code execution (in real implementation, use a secure sandbox)
      const result = await simulateCodeExecution(code, question.programmingLanguage!, testCase)
      return result
    } catch (error) {
      return {
        passed: false,
        input: testCase?.input || "",
        expectedOutput: testCase?.expectedOutput || "",
        actualOutput: "",
        executionTime: 0,
        error: error instanceof Error ? error.message : "Execution failed",
      }
    } finally {
      setIsRunning(false)
    }
  }

  const simulateCodeExecution = async (
    code: string,
    language: ProgrammingLanguage,
    testCase?: TestCase,
  ): Promise<TestResult> => {
    // This is a simulation - in real implementation, you would:
    // 1. Send code to a secure execution environment (Docker container)
    // 2. Run with proper time and memory limits
    // 3. Capture output and compare with expected results

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const passed = Math.random() > 0.3 // 70% pass rate for simulation

    return {
      passed,
      input: testCase?.input || "",
      expectedOutput: testCase?.expectedOutput || "",
      actualOutput: passed ? testCase?.expectedOutput || "Output" : "Wrong output",
      executionTime: Math.floor(Math.random() * 1000),
      error: passed ? undefined : "Runtime error or wrong output",
    }
  }

  const runTests = async () => {
    if (!question.testCases || question.testCases.length === 0) return

    setIsRunning(true)
    const results: TestResult[] = []

    for (const testCase of question.testCases) {
      const result = await executeCode(testCase)
      results.push(result)
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const handleSubmit = async () => {
    await runTests()
    const allResults =
      testResults.length > 0 ? testResults : await Promise.all((question.testCases || []).map((tc) => executeCode(tc)))

    onSubmit(code, {
      testResults: allResults,
      totalTests: question.testCases?.length || 0,
      passedTests: allResults.filter((r) => r.passed).length,
      score:
        allResults.length > 0 ? (allResults.filter((r) => r.passed).length / allResults.length) * question.marks : 0,
    })
  }

  const getResultIcon = (passed: boolean) => {
    return passed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{question.questionText}</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{question.programmingLanguage?.toUpperCase()}</Badge>
              <Badge variant="outline">{question.marks} marks</Badge>
              {timeRemaining > 0 && (
                <Badge variant={timeRemaining < 60 ? "destructive" : "secondary"}>
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timeRemaining)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Code Editor</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={runTests} disabled={isRunning || readOnly}>
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Run Tests
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={isRunning || readOnly}>
                  Submit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Language</span>
                  <Badge variant="secondary">{question.programmingLanguage?.toUpperCase()}</Badge>
                </div>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={getLanguageTemplate(question.programmingLanguage!)}
                  className="font-mono text-sm min-h-[400px] resize-none"
                  readOnly={readOnly}
                />
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Time Limit: {question.timeLimitSeconds}s</p>
                <p>Memory Limit: {question.memoryLimitMb}MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Run tests to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {testResults.filter((r) => r.passed).length} / {testResults.length} tests passed
                  </span>
                  <Badge variant={testResults.every((r) => r.passed) ? "default" : "destructive"}>
                    {testResults.every((r) => r.passed) ? "All Passed" : "Some Failed"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getResultIcon(result.passed)}
                          <span className="text-sm font-medium">Test Case {index + 1}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{result.executionTime}ms</span>
                      </div>

                      {!result.passed && (
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Input:</span>
                            <pre className="bg-muted p-2 rounded mt-1">{result.input}</pre>
                          </div>
                          <div>
                            <span className="font-medium">Expected:</span>
                            <pre className="bg-muted p-2 rounded mt-1">{result.expectedOutput}</pre>
                          </div>
                          <div>
                            <span className="font-medium">Actual:</span>
                            <pre className="bg-muted p-2 rounded mt-1">{result.actualOutput}</pre>
                          </div>
                          {result.error && (
                            <div>
                              <span className="font-medium text-red-600">Error:</span>
                              <pre className="bg-red-50 p-2 rounded mt-1 text-red-600">{result.error}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
