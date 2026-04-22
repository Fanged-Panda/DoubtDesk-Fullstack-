# Pending Questions Table - Visual Guide & Implementation Summary

## 🎯 Feature Overview

A tabular interface that groups pending questions by **Course** and **Subject**, allowing teachers to efficiently view and solve questions.

---

## 📊 Table View (Main Screen)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📋 Pending Questions by Subject                          │
│         Click the "Solve" button to view and answer questions               │
│                                                                              │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│ │   Total      │  │    Total     │  │   Courses    │  │   Status     │    │
│ │  Subjects    │  │  Questions   │  │              │  │              │    │
│ │      4       │  │      10      │  │      2       │  │   Pending    │    │
│ └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ Course Name              │ Subject     │ Pending │ Action          │ │
│  ├────────────────────────────────────────────────────────────────────────┤│
│  │ Science & Mathematics    │ Physics     │    3    │  [Solve]        │ │
│  │ Science & Mathematics    │ Chemistry   │    2    │  [Solve]        │ │
│  │ Science & Mathematics    │ Mathematics │    3    │  [Solve]        │ │
│  │ Engineering & Tech       │ ICT         │    2    │  [Solve]        │ │
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Showing 4 subject grouping(s)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Questions View (After Clicking Solve)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Table                                                              │
│                                                                              │
│ Science & Mathematics - Physics                                             │
│ 3 pending question(s)                                                       │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ What is the velocity of light in vacuum?                             │ ││
│ │                                                                      │ ││
│ │ I need to understand the exact value and significance              │ ││
│ │ of the speed of light.                                             │ ││
│ │                                                                      │ ││
│ │ 📚 Science and Mathematics • 📖 Physics                            │ ││
│ │                                                                      [Solve]│
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ Explain Newton's Third Law of Motion                               │ ││
│ │                                                                      │ ││
│ │ Can someone explain this law with practical examples?              │ ││
│ │                                                                      │ ││
│ │ 📚 Science and Mathematics • 📖 Physics                            │ ││
│ │                                                                      [Solve]│
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ How does momentum conservation work in collisions?                  │ ││
│ │                                                                      │ ││
│ │ I'm confused about how momentum is conserved in elastic            │ ││
│ │ and inelastic collisions.                                          │ ││
│ │                                                                      │ ││
│ │ 📚 Science and Mathematics • 📖 Physics                            │ ││
│ │                                                                      [Solve]│
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                                                                              │
│ [Previous]           Page 1 of 1            [Next]                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Solution Form (After Clicking Solve on Question)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                          [Solution Form Modal]                              │
│                                                                              │
│                           Solve Question                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ What is the velocity of light in vacuum?                            │  │
│  │                                                                       │  │
│  │ I need to understand the exact value and significance               │  │
│  │ of the speed of light.                                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Your Solution:                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │ The speed of light in vacuum is approximately 3 × 10⁸ m/s.         │  │
│  │ This is a fundamental constant denoted by "c" and is used in...    │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Attach Files:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Choose files...                                                   │ ├───┤  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│                  [Submit Solution]    [Cancel]                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Data Structure

### API Response 1: `/questions/grouping/summary`
```javascript
[
  {
    courseId: 1,
    courseName: "Science and Mathematics",
    subjectId: 1,
    subjectName: "Physics",
    pendingCount: 3,
    questions: [1, 2, 3]
  },
  {
    courseId: 1,
    courseName: "Science and Mathematics",
    subjectId: 2,
    subjectName: "Chemistry",
    pendingCount: 2,
    questions: [4, 5]
  },
  {
    courseId: 1,
    courseName: "Science and Mathematics",
    subjectId: 3,
    subjectName: "Mathematics",
    pendingCount: 3,
    questions: [6, 7, 8]
  },
  {
    courseId: 2,
    courseName: "Engineering and Tech",
    subjectId: 4,
    subjectName: "ICT",
    pendingCount: 2,
    questions: [9, 10]
  }
]
```

### API Response 2: `/questions/grouping/list?courseId=1&subjectId=1`
```javascript
{
  content: [
    {
      questionId: 1,
      questionTitle: "What is the velocity of light in vacuum?",
      description: "I need to understand the exact value...",
      status: "pending",
      postAt: "2024-01-15T10:30:00Z",
      courseName: "Science and Mathematics",
      subjectName: "Physics",
      studentName: "John Doe",
      studentEmail: "john@example.com",
      questionAttachments: []
    },
    // ... more questions
  ],
  totalElements: 3,
  totalPages: 1,
  currentPage: 0
}
```

---

## 🔌 API Endpoints

### 1. Get Grouped Summary
```
Endpoint: GET /api/questions/grouping/summary
Method: GET
Auth: None required
Query Parameters: None
Response: Array of grouped questions
```

**Example:**
```bash
curl http://localhost:5000/api/questions/grouping/summary
```

### 2. Get Questions in Group
```
Endpoint: GET /api/questions/grouping/list
Method: GET
Auth: None required
Query Parameters:
  - courseId (optional, integer): Filter by course ID
  - subjectId (optional, integer): Filter by subject ID
  - page (optional, integer, default=0): Page number for pagination
  - size (optional, integer, default=10): Items per page
Response: Paginated questions with metadata
```

**Example:**
```bash
curl "http://localhost:5000/api/questions/grouping/list?courseId=1&subjectId=1&page=0&size=10"
```

---

## 📱 Frontend Component Usage

### Import
```javascript
import PendingQuestionsGroupedTable from "./components/teacher/PendingQuestionsGroupedTable";
```

### Route Setup
```javascript
{
  path: "teacher/dashboard",
  element: <PendingQuestionsGroupedTable />
}
```

### Component Props
The component doesn't require any props. It:
- Fetches data from the API automatically
- Uses AuthContext for user information
- Manages its own state
- Integrates with SolutionForm for solving

---

## 🔄 User Flow Sequence

```
1. Teacher navigates to /teacher/dashboard
   ↓
2. Component mounts and calls GET /questions/grouping/summary
   ↓
3. Display grouped table with all course/subject combinations
   ↓
4. Teacher clicks "Solve" on a group
   ↓
5. Component calls GET /questions/grouping/list?courseId=X&subjectId=Y
   ↓
6. Display all questions in that group with pagination
   ↓
7. Teacher clicks "Solve" on a specific question
   ↓
8. Show SolutionForm modal
   ↓
9. Teacher submits solution (uses existing /questions/:id/solve endpoint)
   ↓
10. On success: refresh both views and return to table
```

---

## 🧮 Grouping Algorithm

The backend groups pending questions as follows:

```javascript
// Group by: courseId + subjectId combination
const key = `${courseId}_${subjectId}`;

// For each unique combination:
{
  courseId,           // Primary key
  courseName,         // From Course model
  subjectId,          // Primary key  
  subjectName,        // From Subject model
  pendingCount,       // Count of pending questions
  questions: []       // Array of question IDs
}

// Sort by: courseName (asc), then subjectName (asc)
```

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Grouping** | Questions grouped by course and subject |
| **Summary Stats** | Shows total subjects, questions, courses, status |
| **Count Badge** | Each group shows pending question count |
| **Pagination** | Questions view supports pagination |
| **Attachments** | Shows question attachments with viewer |
| **Responsive** | Works on mobile and desktop |
| **Integration** | Uses existing SolutionForm and AttachmentDisplay |
| **Back Button** | Easy navigation between views |
| **Empty State** | Graceful handling when no pending questions |

---

## 🔧 Code Structure

### Service Methods Location
**File:** `DoubtDeskBackend/services/questionService.js`
- `getPendingQuestionsByGrouping()` - Lines ~476-520
- `getPendingQuestionsByGroupId()` - Lines ~522-570

### Route Definitions Location
**File:** `DoubtDeskBackend/routes/question.js`
- `/grouping/summary` - GET route for grouped summary
- `/grouping/list` - GET route for questions in group
- **Important:** These routes come BEFORE the `/:id` catch-all route

### Component Location
**File:** `ddfrontend/my-project/src/components/teacher/PendingQuestionsGroupedTable.jsx`
- 400+ lines of component code
- Full state management
- API integration
- UI rendering

---

## 🚀 Deployment Checklist

- [x] Backend service methods added and tested
- [x] Backend routes added with correct ordering
- [x] Frontend component created
- [x] Route integration updated
- [x] No syntax errors
- [x] Existing functionality maintained
- [ ] Manual testing in development
- [ ] Integration testing with database
- [ ] Load testing with large datasets

---

## 📞 Support Notes

If experiencing issues:

1. **Table not showing?**
   - Check if `/questions/grouping/summary` endpoint works
   - Verify teacher is logged in
   - Check browser console for errors

2. **Can't click Solve?**
   - Check if onClick handler is firing
   - Verify `/questions/grouping/list` endpoint works with parameters
   - Check console for API errors

3. **Solution not submitting?**
   - Verify SolutionForm is properly imported
   - Check `/questions/:id/solve` endpoint
   - Verify teacher email in context

4. **Route ordering issues?**
   - Check that `/grouping/*` routes come before `/:id` route
   - Routes were fixed in this implementation

