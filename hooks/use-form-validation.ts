"use client"

import { useState, useCallback } from "react"
import { z } from "zod"

interface FieldState {
  value: string
  error: string | null
  touched: boolean
  isValid: boolean
}

interface UseFormValidationProps {
  schema: z.ZodSchema
  initialValues: Record<string, any>
}

export function useFormValidation({ schema, initialValues }: UseFormValidationProps) {
  const [fields, setFields] = useState<Record<string, FieldState>>(() => {
    const initialFields: Record<string, FieldState> = {}
    Object.keys(initialValues).forEach((key) => {
      initialFields[key] = {
        value: initialValues[key] || "",
        error: null,
        touched: false,
        isValid: false,
      }
    })
    return initialFields
  })

  const validateField = useCallback(
    (name: string, value: any) => {
      try {
        // Handle special cases for different field types
        let validationValue = value

        // Convert string numbers to actual numbers for numeric fields
        if (name === "experienceYears" || name === "semester") {
          validationValue = value === "" || value === undefined ? undefined : Number(value)
        }

        // For password confirmation, we need both password fields
        if (name === "confirmPassword") {
          const passwordValue = fields.password?.value || ""
          const confirmValue = value

          // Create object with both password fields for validation
          const passwordData = {
            password: passwordValue,
            confirmPassword: confirmValue,
          }

          // Use the full schema to validate password confirmation
          const result = schema.safeParse({
            ...Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value])),
            ...passwordData,
          })

          if (!result.success) {
            const confirmError = result.error.errors.find(
              (err) => err.path.includes("confirmPassword") || err.message.includes("match"),
            )
            return confirmError?.message || null
          }
          return null
        }

        // For other fields, create a minimal object for validation
        const testData = { [name]: validationValue }

        // Add required context for certain validations
        if (name === "password" && fields.confirmPassword?.value) {
          testData.confirmPassword = fields.confirmPassword.value
        }

        // Create a partial schema for single field validation
        const fieldSchema = schema.pick({ [name]: true })

        // Validate the field
        fieldSchema.parse(testData)
        return null
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find((err) => err.path.includes(name))
          return fieldError?.message || null
        }
        return null
      }
    },
    [schema, fields],
  )

  const updateField = useCallback(
    (name: string, value: any, shouldValidate = true) => {
      setFields((prev) => {
        // Always update the value first
        const newFields = {
          ...prev,
          [name]: {
            ...prev[name],
            value,
          },
        }

        // Only validate if the field has been touched or if explicitly requested
        const shouldRunValidation = shouldValidate && (prev[name]?.touched || false)
        const error = shouldRunValidation ? validateField(name, value) : prev[name]?.error

        return {
          ...newFields,
          [name]: {
            ...newFields[name],
            error,
            isValid: error === null && value !== "" && value !== undefined && value !== null,
          },
        }
      })
    },
    [validateField],
  )

  const touchField = useCallback(
    (name: string) => {
      setFields((prev) => {
        const field = prev[name]
        if (!field) return prev

        const error = validateField(name, field.value)
        return {
          ...prev,
          [name]: {
            ...field,
            touched: true,
            error,
            isValid: error === null && field.value !== "" && field.value !== undefined && field.value !== null,
          },
        }
      })
    },
    [validateField],
  )

  const resetField = useCallback(
    (name: string) => {
      setFields((prev) => ({
        ...prev,
        [name]: {
          value: initialValues[name] || "",
          error: null,
          touched: false,
          isValid: false,
        },
      }))
    },
    [initialValues],
  )

  const resetForm = useCallback(() => {
    const resetFields: Record<string, FieldState> = {}
    Object.keys(initialValues).forEach((key) => {
      resetFields[key] = {
        value: initialValues[key] || "",
        error: null,
        touched: false,
        isValid: false,
      }
    })
    setFields(resetFields)
  }, [initialValues])

  const isFormValid = Object.values(fields).every((field) => field.isValid || !field.touched)

  const getFieldProps = useCallback(
    (name: string) => ({
      value: fields[name]?.value || "",
      error: fields[name]?.touched ? fields[name]?.error : null,
      isValid: fields[name]?.isValid || false,
      touched: fields[name]?.touched || false,
      onChange: (value: any) => updateField(name, value),
      onBlur: () => touchField(name),
    }),
    [fields, updateField, touchField],
  )

  return {
    fields,
    updateField,
    touchField,
    resetField,
    resetForm,
    isFormValid,
    getFieldProps,
  }
}
