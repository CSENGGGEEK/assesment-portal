import { describe, it, expect } from "@jest/globals"
import { renderHook, act } from "@testing-library/react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { TeacherRegistrationSchema } from "@/lib/definitions"

describe("useFormValidation Hook", () => {
  const mockSchema = TeacherRegistrationSchema
  const mockInitialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    college: "",
    gender: "",
  }

  it("should initialize with correct initial state", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: mockSchema,
        initialValues: mockInitialValues,
      }),
    )

    expect(result.current.fields.firstName.value).toBe("")
    expect(result.current.fields.firstName.error).toBe(null)
    expect(result.current.fields.firstName.touched).toBe(false)
    expect(result.current.fields.firstName.isValid).toBe(false)
  })

  it("should update field value correctly", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: mockSchema,
        initialValues: mockInitialValues,
      }),
    )

    act(() => {
      result.current.updateField("firstName", "John")
    })

    expect(result.current.fields.firstName.value).toBe("John")
  })

  it("should validate field on touch", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: mockSchema,
        initialValues: mockInitialValues,
      }),
    )

    act(() => {
      result.current.updateField("firstName", "J") // Too short
      result.current.touchField("firstName")
    })

    expect(result.current.fields.firstName.touched).toBe(true)
    expect(result.current.fields.firstName.error).toBeTruthy()
    expect(result.current.fields.firstName.isValid).toBe(false)
  })

  it("should show valid state for correct input", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: mockSchema,
        initialValues: mockInitialValues,
      }),
    )

    act(() => {
      result.current.updateField("firstName", "John")
      result.current.touchField("firstName")
    })

    expect(result.current.fields.firstName.touched).toBe(true)
    expect(result.current.fields.firstName.error).toBe(null)
    expect(result.current.fields.firstName.isValid).toBe(true)
  })

  it("should reset field correctly", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: mockSchema,
        initialValues: mockInitialValues,
      }),
    )

    act(() => {
      result.current.updateField("firstName", "John")
      result.current.touchField("firstName")
    })

    expect(result.current.fields.firstName.value).toBe("John")
    expect(result.current.fields.firstName.touched).toBe(true)

    act(() => {
      result.current.resetField("firstName")
    })

    expect(result.current.fields.firstName.value).toBe("")
    expect(result.current.fields.firstName.touched).toBe(false)
    expect(result.current.fields.firstName.error).toBe(null)
  })

  it("should reset entire form correctly", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: mockSchema,
        initialValues: mockInitialValues,
      }),
    )

    act(() => {
      result.current.updateField("firstName", "John")
      result.current.updateField("lastName", "Doe")
      result.current.touchField("firstName")
      result.current.touchField("lastName")
    })

    expect(result.current.fields.firstName.value).toBe("John")
    expect(result.current.fields.lastName.value).toBe("Doe")

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.fields.firstName.value).toBe("")
    expect(result.current.fields.lastName.value).toBe("")
    expect(result.current.fields.firstName.touched).toBe(false)
    expect(result.current.fields.lastName.touched).toBe(false)
  })

  it("should provide correct field props", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: mockSchema,
        initialValues: mockInitialValues,
      }),
    )

    const fieldProps = result.current.getFieldProps("firstName")

    expect(fieldProps.value).toBe("")
    expect(fieldProps.error).toBe(null)
    expect(fieldProps.isValid).toBe(false)
    expect(fieldProps.touched).toBe(false)
    expect(typeof fieldProps.onChange).toBe("function")
    expect(typeof fieldProps.onBlur).toBe("function")
  })
})
