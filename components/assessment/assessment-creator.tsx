"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Clock, Shield, Code, FileText, CheckSquare, Square } from "lucide-react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField } from "@/components/form-field"
import { AssessmentSchema, SectionSchema } from "@/lib/assessment-definitions"
import type { AssessmentSection, SectionType } from "@/lib/assessment-definitions"

interface AssessmentCreatorProps {
  onSave: (assessmentData: any) => void
  onCancel: () => void
}

export function AssessmentCreator({ onSave, onCancel }: AssessmentCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [sections, setSections] = useState<Partial<AssessmentSection>[]>([])
  const [selectedSection, setSelectedSection] = useState<number | null>(null)

  const assessmentForm = useFormValidation({
    schema: AssessmentSchema,
    initialValues: {
      title: "",
      description: "",
      durationMinutes: 60,
      startTime: "",
      endTime: "",
      allowLateSubmission: false,
      randomizeQuestions: false,
      showResultsImmediately: false,
      faceDetectionEnabled: true,
      screenRecordingEnabled: true,
    },
  })

  const sectionForm = useFormValidation({
    schema: SectionSchema,
    initialValues: {
      title: "",
      description: "",
      sectionType: "mcq" as SectionType,
      timeLimitMinutes: 30,
      marksPerQuestion: 1,
      negativeMarking: 0,
    },
  })

  const addSection = () => {
    if (sectionForm.isFormValid) {
      const newSection = {
        ...Object.fromEntries(Object.entries(sectionForm.fields).map(([key, field]) => [key, field.value])),
        sectionOrder: sections.length + 1,
        questions: [],
      }
      setSections([...sections, newSection])
      sectionForm.resetForm()
    }
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case "mcq":
        return <CheckSquare className="h-4 w-4" />
      case "msq":
        return <Square className="h-4 w-4" />
      case "subjective":
        return <FileText className="h-4 w-4" />
      case "coding":
        return <Code className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleSave = () => {
    if (assessmentForm.isFormValid && sections.length > 0) {
      const assessmentData = {
        ...Object.fromEntries(Object.entries(assessmentForm.fields).map(([key, field]) => [key, field.value])),
        sections,
      }
      onSave(assessmentData)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Assessment</h1>
          <p className="text-muted-foreground">Design a comprehensive assessment with multiple question types</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!assessmentForm.isFormValid || sections.length === 0}>
            Save Assessment
          </Button>
        </div>
      </div>

      <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(Number(value))}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1">Basic Details</TabsTrigger>
          <TabsTrigger value="2">Sections & Questions</TabsTrigger>
          <TabsTrigger value="3">Settings & Review</TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Information</CardTitle>
              <CardDescription>Provide basic details about your assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Assessment Title"
                name="title"
                placeholder="Enter assessment title"
                required
                {...assessmentForm.getFieldProps("title")}
              />

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the assessment objectives and instructions"
                  value={assessmentForm.fields.description?.value || ""}
                  onChange={(e) => assessmentForm.updateField("description", e.target.value)}
                  onBlur={() => assessmentForm.touchField("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Duration (minutes)"
                  name="durationMinutes"
                  type="number"
                  placeholder="60"
                  required
                  {...assessmentForm.getFieldProps("durationMinutes")}
                />

                <div className="space-y-2">
                  <Label>Assessment Type</Label>
                  <div className="flex gap-4">
                    <Badge variant="secondary" className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Timed Assessment
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      Proctored
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time (Optional)</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={assessmentForm.fields.startTime?.value || ""}
                    onChange={(e) => assessmentForm.updateField("startTime", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={assessmentForm.fields.endTime?.value || ""}
                    onChange={(e) => assessmentForm.updateField("endTime", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setCurrentStep(2)} disabled={!assessmentForm.fields.title?.isValid}>
              Next: Add Sections
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="2" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Section Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Section</CardTitle>
                <CardDescription>Create different types of question sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Section Title"
                  name="title"
                  placeholder="e.g., Multiple Choice Questions"
                  required
                  {...sectionForm.getFieldProps("title")}
                />

                <div className="space-y-2">
                  <Label>Section Type</Label>
                  <Select
                    value={sectionForm.fields.sectionType?.value || "mcq"}
                    onValueChange={(value) => sectionForm.updateField("sectionType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice (Single Answer)</SelectItem>
                      <SelectItem value="msq">Multiple Choice (Multiple Answers)</SelectItem>
                      <SelectItem value="subjective">Subjective Questions</SelectItem>
                      <SelectItem value="coding">Coding Problems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Time Limit (min)"
                    name="timeLimitMinutes"
                    type="number"
                    placeholder="30"
                    {...sectionForm.getFieldProps("timeLimitMinutes")}
                  />

                  <FormField
                    label="Marks per Question"
                    name="marksPerQuestion"
                    type="number"
                    placeholder="1"
                    required
                    {...sectionForm.getFieldProps("marksPerQuestion")}
                  />
                </div>

                <FormField
                  label="Negative Marking"
                  name="negativeMarking"
                  type="number"
                  placeholder="0.25"
                  {...sectionForm.getFieldProps("negativeMarking")}
                />

                <Button onClick={addSection} className="w-full" disabled={!sectionForm.isFormValid}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardContent>
            </Card>

            {/* Sections List */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Sections ({sections.length})</CardTitle>
                <CardDescription>Manage your assessment sections</CardDescription>
              </CardHeader>
              <CardContent>
                {sections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sections added yet</p>
                    <p className="text-sm">Add your first section to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sections.map((section, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {getSectionIcon(section.sectionType as SectionType)}
                          <div>
                            <p className="font-medium">{section.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {section.sectionType?.toUpperCase()}
                              </Badge>
                              <span>•</span>
                              <span>{section.marksPerQuestion} marks each</span>
                              {section.timeLimitMinutes && (
                                <>
                                  <span>•</span>
                                  <span>{section.timeLimitMinutes} min</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedSection(index)}>
                            Add Questions
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => removeSection(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(3)} disabled={sections.length === 0}>
              Next: Review Settings
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Settings</CardTitle>
              <CardDescription>Configure security and behavior settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Student Experience</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Late Submission</Label>
                        <p className="text-sm text-muted-foreground">Students can submit after deadline</p>
                      </div>
                      <Switch
                        checked={assessmentForm.fields.allowLateSubmission?.value || false}
                        onCheckedChange={(checked) => assessmentForm.updateField("allowLateSubmission", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Randomize Questions</Label>
                        <p className="text-sm text-muted-foreground">Questions appear in random order</p>
                      </div>
                      <Switch
                        checked={assessmentForm.fields.randomizeQuestions?.value || false}
                        onCheckedChange={(checked) => assessmentForm.updateField("randomizeQuestions", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Results Immediately</Label>
                        <p className="text-sm text-muted-foreground">Display results after submission</p>
                      </div>
                      <Switch
                        checked={assessmentForm.fields.showResultsImmediately?.value || false}
                        onCheckedChange={(checked) => assessmentForm.updateField("showResultsImmediately", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Security & Monitoring</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Face Detection</Label>
                        <p className="text-sm text-muted-foreground">Monitor student presence via camera</p>
                      </div>
                      <Switch
                        checked={assessmentForm.fields.faceDetectionEnabled?.value || false}
                        onCheckedChange={(checked) => assessmentForm.updateField("faceDetectionEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Screen Recording</Label>
                        <p className="text-sm text-muted-foreground">Record student screen activity</p>
                      </div>
                      <Switch
                        checked={assessmentForm.fields.screenRecordingEnabled?.value || false}
                        onCheckedChange={(checked) => assessmentForm.updateField("screenRecordingEnabled", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Assessment Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{sections.length}</div>
                    <div className="text-sm text-muted-foreground">Sections</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {sections.reduce((total, section) => total + (section.questions?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{assessmentForm.fields.durationMinutes?.value || 0}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {sections.reduce(
                        (total, section) => total + (section.marksPerQuestion || 0) * (section.questions?.length || 0),
                        0,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Marks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                Save as Draft
              </Button>
              <Button onClick={handleSave}>Create Assessment</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
