// Comprehensive course and subject mapping
export const courseSubjectsData = {
  "Engineering + Biology Admission Program 2025": [
    "Physics - Mechanics & Waves",
    "Physics - Electricity & Magnetism",
    "Chemistry - Organic Chemistry",
    "Chemistry - Inorganic Chemistry",
    "Chemistry - Physical Chemistry",
    "Math - Calculus",
    "Math - Algebra & Geometry",
    "Math - Trigonometry",
    "Biology - Cell Biology",
    "Biology - Genetics",
    "Biology - Human Physiology",
    "Biology - Ecology",
  ],
  "SSC Full Course (Science Group)": [
    "Physics - Mechanics",
    "Physics - Heat & Light",
    "Physics - Sound & Waves",
    "Chemistry - Elements & Compounds",
    "Chemistry - Chemical Reactions",
    "Chemistry - Acid-Base Reactions",
    "Higher Mathematics - Algebra",
    "Higher Mathematics - Geometry",
    "Higher Mathematics - Calculus",
    "General Mathematics - Basic Arithmetic",
    "General Mathematics - Geometry",
    "Biology - Botany",
    "Biology - Zoology",
    "Biology - Human Body Systems",
    "ICT - Database Management",
    "ICT - Web Design Basics",
    "ICT - Programming Fundamentals",
  ],
  "HSC 1st Year (Prime Batch)": [
    "Physics 1st Paper - Mechanics & Properties of Matter",
    "Physics 1st Paper - Heat & Thermodynamics",
    "Physics 1st Paper - Waves & Sound",
    "Chemistry 1st Paper - Atomic Structure",
    "Chemistry 1st Paper - Chemical Bonding",
    "Chemistry 1st Paper - Periodic Table",
    "Chemistry 1st Paper - Gases & Solutions",
    "Math 1st Paper - Set Theory & Functions",
    "Math 1st Paper - Algebra",
    "Math 1st Paper - Trigonometry",
    "Math 1st Paper - Geometry & Coordinate",
    "Math 1st Paper - Calculus Basics",
    "Biology 1st Paper - Cell Division",
    "Biology 1st Paper - Genetics",
    "Biology 1st Paper - Evolution",
    "Biology 1st Paper - Ecology",
    "ICT - Database Fundamentals",
    "ICT - Web Technologies",
    "ICT - Programming Languages",
    "ICT - Software Development",
  ],
};

export const defaultSubjects = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "English",
  "Bangla",
  "ICT",
  "General Science",
  "Accounting",
  "Finance",
  "Management",
  "History",
  "Geography",
  "Economics",
  "Other"
];

// Get all subjects for a course
export const getSubjectsForCourse = (courseName) => {
  return courseSubjectsData[courseName] || defaultSubjects;
};

// Get all available courses
export const getAllCourses = () => {
  return Object.keys(courseSubjectsData);
};
