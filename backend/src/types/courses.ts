import { z } from "zod";

// Notes:
// difference between z.object() and z.record()
// z.object() is used when : Fixed keys and specified types + keys can be of different types
// z.record() is used when : Dynamic keys + and all values are of same type
export const DateSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const [day, month] = val.split("/").map(Number);
      const year = new Date().getFullYear(); // Assuming the current year
      return new Date(year, month - 1, day);
    }
    return val;
  },
  z.date().refine((val) => !isNaN(val.getTime()), {
    message: "Invalid date format",
  })
);
// example : "3/9"

export const TimeSchema = z.object({
  start: z
    .array(
      z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
      )
    )
    .transform((arr) => arr.map((num) => (num >= 0 && num <= 23 ? num : NaN)))
    .refine((arr) => arr.every((num) => !isNaN(num)), {
      message: "Start times must be between 0 and 23",
    }),
  end: z
    .array(
      z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
      )
    )
    .transform((arr) => arr.map((num) => (num >= 0 && num <= 23 ? num : NaN)))
    .refine((arr) => arr.every((num) => !isNaN(num)), {
      message: "End times must be between 0 and 23",
    }),
});

const handleDayValue = (val: string | number): any => {
  if (typeof val === "string") {
    return Number(val);
  }
  if (isNaN(val)) {
    return 0;
  }
  return val;
};

export const LessonSchema = z.object({
  startTimes: z.array(z.string()),
  endTimes: z.array(z.string()),
  day: z.array(z.union([z.string(), z.number()])).optional(),
  locations: z
    .array(z.string())
    .min(1, { message: "Locations cannot be empty" }),
  instructors: z
    .array(z.string())
    .min(1, { message: "Instructors cannot be empty" }),
  meetingDates: z.array(DateSchema),
});
// example : {
//   startTimes: [10, 30],
//   endTimes: [11, 15],
//   days: [2],
//   locations: ["Mong Man Wai Bldg 707"],
//   instructors: ["Professor WANG Liwei"],
//   meetingDates: [
//     "3/9",
//     "10/9",
//     "17/9",
//     "24/9",
//     "8/10",
//     "15/10",
//     "22/10",
//     "29/10",
//     "5/11",
//     "12/11",
//     "19/11",
//     "26/11",
//   ],
// },
export const LessonArraySchema = z.record(z.string(), LessonSchema);

export const TermArraySchema = z.record(z.string(), LessonArraySchema);

const aist1000terms = {
  "2024-25 Term 1": {
    "--LEC (8137)": {
      startTimes: ["10:30"],
      endTimes: ["11:15"],
      days: [2],
      locations: ["Mong Man Wai Bldg 707"],
      instructors: ["Professor WANG Liwei"],
      meetingDates: [
        "3/9",
        "10/9",
        "17/9",
        "24/9",
        "8/10",
        "15/10",
        "22/10",
        "29/10",
        "5/11",
        "12/11",
        "19/11",
        "26/11",
      ],
    },
    "-J01-PRJ (8138)": {
      startTimes: ["11:30"],
      endTimes: ["12:15"],
      days: [2],
      locations: ["Mong Man Wai Bldg 707"],
      instructors: ["Professor WANG Liwei"],
      meetingDates: [
        "3/9",
        "10/9",
        "17/9",
        "24/9",
        "8/10",
        "15/10",
        "22/10",
        "29/10",
        "5/11",
        "12/11",
        "19/11",
        "26/11",
      ],
    },
  },
};
export const AssessmentSchema = z.record(
  z.string(),
  z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  )
);
// e.g : assessments: {
//   Attendance: 20,
//   Project: 50,
//   Participation: 30,
// },

export const CourseSchema = z.object({
  code: z.string().nonempty({ message: "Course code cannot be empty" }),
  title: z.string().nonempty({ message: "Course title cannot be empty" }),
  career: z.string().nonempty({ message: "Career cannot be empty" }),
  units: z.string().nonempty({ message: "Units cannot be empty" }),
  grading: z.string().nonempty({ message: "Grading cannot be empty" }),
  components: z.string().nonempty({ message: "Components cannot be empty" }),
  campus: z.string().nonempty({ message: "Campus cannot be empty" }),
  academic_group: z
    .string()
    .nonempty({ message: "Academic group cannot be empty" }),
  requirements: z
    .string()
    .transform((val) => (val.trim() === "" ? "requirement_not_found" : val)),
  description: z.string().optional(),
  outcome: z.string().optional(),
  syllabus: z.string().optional(),
  required_readings: z.string().optional(),
  recommended_readings: z.string().optional(),
  terms: TermArraySchema.optional(),
  assessments: AssessmentSchema.optional(),
});

export const CoursesArraySchema = z.array(CourseSchema);

export type DateType = z.infer<typeof DateSchema>;
export type TimeType = z.infer<typeof TimeSchema>;
export type LessonType = z.infer<typeof LessonSchema>;
export type LessonArrayType = z.infer<typeof LessonArraySchema>;
export type TermArrayType = z.infer<typeof TermArraySchema>;
export type AssessmentType = z.infer<typeof AssessmentSchema>;
export type CourseType = z.infer<typeof CourseSchema>;
export type CoursesArrayType = z.infer<typeof CoursesArraySchema>;
