import { describe, it, expect } from "@jest/globals"
import {
  INDIAN_COLLEGES,
  ACADEMIC_DEPARTMENTS,
  ACADEMIC_COURSES,
  GENDER_OPTIONS,
  ACADEMIC_YEARS,
  SEMESTER_OPTIONS,
  EXPERIENCE_YEARS,
} from "@/lib/data"

describe("Data Constants", () => {
  describe("INDIAN_COLLEGES", () => {
    it("should contain major Indian institutions", () => {
      expect(INDIAN_COLLEGES).toContain("Indian Institute of Technology (IIT) Bombay")
      expect(INDIAN_COLLEGES).toContain("Indian Institute of Management (IIM) Ahmedabad")
      expect(INDIAN_COLLEGES).toContain("National Institute of Technology (NIT) Trichy")
      expect(INDIAN_COLLEGES).toContain("Jawaharlal Nehru University (JNU), Delhi")
    })

    it("should be sorted alphabetically", () => {
      const sortedColleges = [...INDIAN_COLLEGES].sort()
      expect(INDIAN_COLLEGES).toEqual(sortedColleges)
    })

    it("should have reasonable number of colleges", () => {
      expect(INDIAN_COLLEGES.length).toBeGreaterThan(100)
      expect(INDIAN_COLLEGES.length).toBeLessThan(500)
    })
  })

  describe("ACADEMIC_DEPARTMENTS", () => {
    it("should contain major academic departments", () => {
      expect(ACADEMIC_DEPARTMENTS).toContain("Computer Science and Engineering")
      expect(ACADEMIC_DEPARTMENTS).toContain("Mechanical Engineering")
      expect(ACADEMIC_DEPARTMENTS).toContain("Business Administration")
      expect(ACADEMIC_DEPARTMENTS).toContain("English Literature")
    })

    it("should be sorted alphabetically", () => {
      const sortedDepartments = [...ACADEMIC_DEPARTMENTS].sort()
      expect(ACADEMIC_DEPARTMENTS).toEqual(sortedDepartments)
    })

    it("should cover diverse academic fields", () => {
      expect(ACADEMIC_DEPARTMENTS.some((dept) => dept.includes("Engineering"))).toBe(true)
      expect(ACADEMIC_DEPARTMENTS.some((dept) => dept.includes("Science"))).toBe(true)
      expect(ACADEMIC_DEPARTMENTS.some((dept) => dept.includes("Arts"))).toBe(true)
      expect(ACADEMIC_DEPARTMENTS.some((dept) => dept.includes("Management"))).toBe(true)
    })
  })

  describe("ACADEMIC_COURSES", () => {
    it("should contain undergraduate and postgraduate courses", () => {
      expect(ACADEMIC_COURSES.some((course) => course.startsWith("B.Tech"))).toBe(true)
      expect(ACADEMIC_COURSES.some((course) => course.startsWith("M.Tech"))).toBe(true)
      expect(ACADEMIC_COURSES.some((course) => course.startsWith("MBA"))).toBe(true)
      expect(ACADEMIC_COURSES.some((course) => course.startsWith("Ph.D"))).toBe(true)
    })

    it("should be sorted alphabetically", () => {
      const sortedCourses = [...ACADEMIC_COURSES].sort()
      expect(ACADEMIC_COURSES).toEqual(sortedCourses)
    })
  })

  describe("GENDER_OPTIONS", () => {
    it("should contain standard gender options", () => {
      expect(GENDER_OPTIONS).toHaveLength(3)
      expect(GENDER_OPTIONS.map((g) => g.value)).toContain("male")
      expect(GENDER_OPTIONS.map((g) => g.value)).toContain("female")
      expect(GENDER_OPTIONS.map((g) => g.value)).toContain("other")
    })

    it("should have proper label-value structure", () => {
      GENDER_OPTIONS.forEach((option) => {
        expect(option).toHaveProperty("value")
        expect(option).toHaveProperty("label")
        expect(typeof option.value).toBe("string")
        expect(typeof option.label).toBe("string")
      })
    })
  })

  describe("ACADEMIC_YEARS", () => {
    it("should contain recent academic years", () => {
      expect(ACADEMIC_YEARS).toContain("2024-2025")
      expect(ACADEMIC_YEARS).toContain("2023-2024")
    })

    it("should be in descending order", () => {
      for (let i = 0; i < ACADEMIC_YEARS.length - 1; i++) {
        const current = Number.parseInt(ACADEMIC_YEARS[i].split("-")[0])
        const next = Number.parseInt(ACADEMIC_YEARS[i + 1].split("-")[0])
        expect(current).toBeGreaterThan(next)
      }
    })
  })

  describe("SEMESTER_OPTIONS", () => {
    it("should contain 12 semesters", () => {
      expect(SEMESTER_OPTIONS).toHaveLength(12)
    })

    it("should have proper structure", () => {
      SEMESTER_OPTIONS.forEach((option, index) => {
        expect(option.value).toBe((index + 1).toString())
        expect(option.label).toBe(`Semester ${index + 1}`)
      })
    })
  })

  describe("EXPERIENCE_YEARS", () => {
    it("should contain 51 options (0-50 years)", () => {
      expect(EXPERIENCE_YEARS).toHaveLength(51)
    })

    it("should have proper structure", () => {
      expect(EXPERIENCE_YEARS[0].value).toBe("0")
      expect(EXPERIENCE_YEARS[0].label).toBe("Fresher")
      expect(EXPERIENCE_YEARS[1].value).toBe("1")
      expect(EXPERIENCE_YEARS[1].label).toBe("1 Year")
      expect(EXPERIENCE_YEARS[2].value).toBe("2")
      expect(EXPERIENCE_YEARS[2].label).toBe("2 Years")
    })
  })
})
