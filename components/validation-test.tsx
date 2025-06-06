"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField } from "@/components/form-field"
import { TeacherRegistrationSchema } from "@/lib/definitions"
import { GENDER_OPTIONS } from "@/lib/data"

export function ValidationTest() {
  const form = useFormValidation({
    schema: TeacherRegistrationSchema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      department: "",
      college: "",
    },
  })

  const handleSubmit = () => {
    console.log("Form data:", form.fields)
    console.log("Is valid:", form.isFormValid)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Validation Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            placeholder="Enter first name"
            required
            {...form.getFieldProps("firstName")}
          />

          <FormField
            label="Last Name"
            name="lastName"
            placeholder="Enter last name"
            required
            {...form.getFieldProps("lastName")}
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email"
          required
          {...form.getFieldProps("email")}
        />

        <FormField label="Gender" name="gender" options={GENDER_OPTIONS} required {...form.getFieldProps("gender")} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            required
            {...form.getFieldProps("password")}
          />

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            required
            {...form.getFieldProps("confirmPassword")}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Test Validation
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>Form Valid: {form.isFormValid ? "✅ Yes" : "❌ No"}</p>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(form.fields).map(([key, field]) => [
                  key,
                  {
                    value: field.value,
                    error: field.error,
                    touched: field.touched,
                    isValid: field.isValid,
                  },
                ]),
              ),
              null,
              2,
            )}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
