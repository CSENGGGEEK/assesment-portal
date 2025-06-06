"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Code, FileText } from "lucide-react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField } from "@/components/form-field"
import {
  MCQQuestionSchema,
  SubjectiveQuestionSchema,
  CodingQuestionSchema,
  type QuestionType,
} from "@/lib/assessment-definitions"

interface QuestionBuilderProps {
  questionType: QuestionType
  onSave: (questionData: any) => void
  onCancel: () => void
}

export function QuestionBuilder({ questionType, onSave, onCancel }: QuestionBuilderProps) {
  const [options, setOptions] = useState<string[]>(["", ""])
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([])
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "", isHidden: false, points: 1 }])

  const getSchema = () => {
    switch (questionType) {
      case "mcq":
      case "msq":
        return MCQQuestionSchema
      case "subjective":
        return SubjectiveQuestionSchema
      case "coding":
        return CodingQuestionSchema
      default:
        return MCQQuestionSchema
    }
  }

  const getInitialValues = () => {
    const base = {
      questionText: "",
      marks: 1,
      difficultyLevel: "medium",
    }

    switch (questionType) {
      case "mcq":
      case "msq":
        return { ...base, options: [], correctAnswers: [] }
      case "subjective":
        return { ...base, maxWords: 100, sampleAnswer: "" }
      case "coding":
        return {
          ...base,
          programmingLanguage: "javascript",
          starterCode: "",
          timeLimitSeconds: 300,
          memoryLimitMb: 128,
          testCases: [],
        }
      default:
        return base
    }
  }

  const questionForm = useFormValidation({
    schema: getSchema(),
    initialValues: getInitialValues(),
  })

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    setCorrectAnswers(correctAnswers.filter((answer) => answer !== index))
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const toggleCorrectAnswer = (index: number) => {
    if (questionType === "mcq") {
      setCorrectAnswers([index])
    } else {
      setCorrectAnswers(
        correctAnswers.includes(index)
          ? correctAnswers.filter((answer) => answer !== index)
          : [...correctAnswers, index],
      )
    }
  }

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false, points: 1 }])
  }

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const updateTestCase = (index: number, field: string, value: any) => {
    const newTestCases = [...testCases]
    newTestCases[index] = { ...newTestCases[index], [field]: value }
    setTestCases(newTestCases)
  }

  const handleSave = () => {
    const baseData = {
      questionText: questionForm.fields.questionText?.value,
      marks: Number(questionForm.fields.marks?.value),
      difficultyLevel: questionForm.fields.difficultyLevel?.value,
    }

    let questionData = baseData

    switch (questionType) {
      case "mcq":
      case "msq":
        questionData = {
          ...baseData,
          options: options.filter((opt) => opt.trim() !== ""),
          correctAnswers,
        }
        break
      case "subjective":
        questionData = {
          ...baseData,
          maxWords: Number(questionForm.fields.maxWords?.value) || undefined,
          sampleAnswer: questionForm.fields.sampleAnswer?.value || undefined,
        }
        break
      case "coding":
        questionData = {
          ...baseData,
          programmingLanguage: questionForm.fields.programmingLanguage?.value,
          starterCode: questionForm.fields.starterCode?.value || undefined,
          timeLimitSeconds: Number(questionForm.fields.timeLimitSeconds?.value),
          memoryLimitMb: Number(questionForm.fields.memoryLimitMb?.value),
          testCases: testCases.filter((tc) => tc.input.trim() !== "" && tc.expectedOutput.trim() !== ""),
        }
        break
    }

    onSave(questionData)
  }

  const getQuestionTypeIcon = () => {
    switch (questionType) {
      case "coding":
        return <Code className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getQuestionTypeName = () => {
    switch (questionType) {
      case "mcq":
        return "Multiple Choice (Single Answer)"
      case "msq":
        return "Multiple Choice (Multiple Answers)"
      case "subjective":
        return "Subjective Question"
      case "coding":
        return "Coding Problem"
      default:
        return "Question"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getQuestionTypeIcon()}
          <div>
            <h1 className="text-2xl font-bold">Create {getQuestionTypeName()}</h1>
            <p className="text-muted-foreground">Design a comprehensive question for your assessment</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Question</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Provide the question content and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="questionText">Question Text *</Label>
            <Textarea
              id="questionText"
              placeholder="Enter your question here..."
              className="min-h-[120px]"
              value={questionForm.fields.questionText?.value || ""}
              onChange={(e) => questionForm.updateField("questionText", e.target.value)}
              onBlur={() => questionForm.touchField("questionText")}
            />
            {questionForm.fields.questionText?.touched && questionForm.fields.questionText?.error && (
              <p className="text-sm text-red-600">{questionForm.fields.questionText.error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Marks"
              name="marks"
              type="number"
              placeholder="1"
              required
              {...questionForm.getFieldProps("marks")}
            />

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select
                value={questionForm.fields.difficultyLevel?.value || "medium"}
                onValueChange={(value) => questionForm.updateField("difficultyLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* MCQ/MSQ Options */}
          {(questionType === "mcq" || questionType === "msq") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Checkbox
                      checked={correctAnswers.includes(index)}
                      onCheckedChange={() => toggleCorrectAnswer(index)}
                    />
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button variant="outline" size="sm" onClick={() => removeOption(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                {questionType === "mcq" ? "Select one correct answer" : "Select all correct answers"}
              </p>
            </div>
          )}

          {/* Subjective Question Settings */}
          {questionType === "subjective" && (
            <div className="space-y-4">
              <FormField
                label="Maximum Words (Optional)"
                name="maxWords"
                type="number"
                placeholder="100"
                {...questionForm.getFieldProps("maxWords")}
              />

              <div className="space-y-2">
                <Label htmlFor="sampleAnswer">Sample Answer (Optional)</Label>
                <Textarea
                  id="sampleAnswer"
                  placeholder="Provide a sample answer for reference..."
                  value={questionForm.fields.sampleAnswer?.value || ""}
                  onChange={(e) => questionForm.updateField("sampleAnswer", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Coding Question Settings */}
          {questionType === "coding" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Programming Language</Label>
                  <Select
                    value={questionForm.fields.programmingLanguage?.value || "javascript"}
                    onValueChange={(value) => questionForm.updateField("programmingLanguage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  label="Time Limit (seconds)"
                  name="timeLimitSeconds"
                  type="number"
                  placeholder="300"
                  required
                  {...questionForm.getFieldProps("timeLimitSeconds")}
                />

                <FormField
                  label="Memory Limit (MB)"
                  name="memoryLimitMb"
                  type="number"
                  placeholder="128"
                  required
                  {...questionForm.getFieldProps("memoryLimitMb")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="starterCode">Starter Code (Optional)</Label>
                <Textarea
                  id="starterCode"
                  placeholder="// Write your starter code here..."
                  className="font-mono text-sm min-h-[120px]"
                  value={questionForm.fields.starterCode?.value || ""}
                  onChange={(e) => questionForm.updateField("starterCode", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Test Cases</Label>
                  <Button variant="outline" size="sm" onClick={addTestCase}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test Case
                  </Button>
                </div>

                <div className="space-y-4">
                  {testCases.map((testCase, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Test Case {index + 1}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={testCase.isHidden ? "secondary" : "outline"}>
                              {testCase.isHidden ? "Hidden" : "Visible"}
                            </Badge>
                            {testCases.length > 1 && (
                              <Button variant="outline" size="sm" onClick={() => removeTestCase(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Input</Label>
                            <Textarea
                              placeholder="Test input..."
                              value={testCase.input}
                              onChange={(e) => updateTestCase(index, "input", e.target.value)}
                              className="font-mono text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Expected Output</Label>
                            <Textarea
                              placeholder="Expected output..."
                              value={testCase.expectedOutput}
                              onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
                              className="font-mono text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`hidden-${index}`}
                              checked={testCase.isHidden}
                              onCheckedChange={(checked) => updateTestCase(index, "isHidden", checked)}
                            />
                            <Label htmlFor={`hidden-${index}`} className="text-sm">
                              Hidden from students
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Points:</Label>
                            <Input
                              type="number"
                              min="1"
                              value={testCase.points}
                              onChange={(e) => updateTestCase(index, "points", Number(e.target.value))}
                              className="w-20"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
