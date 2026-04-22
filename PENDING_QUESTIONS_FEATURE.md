# Pending Questions Tabular Form Feature

## Overview
Added a new tabular interface for viewing and solving pending questions grouped by course and subject. Teachers can now see all pending questions organized in a clean table format and click "Solve" to answer questions in each category.

---

## 📋 Features Added

### 1. **Tabular View**
- Displays pending questions grouped by Course and Subject
- Shows the count of pending questions for each combination
- Summary statistics (Total Subjects, Total Questions, Courses, Status)
- Responsive table design with alternating row colors
- Hover effects for better UX

### 2. **Solve Functionality**
- Click "Solve" button to view all questions in a course/subject combination
- Questions displayed with full details and attachments
- Pagination support for large number of questions
- Solution form appears when solving individual questions

### 3. **Database Integration**
- No database schema changes required
- Uses existing Question, Course, Subject tables
- Groups data on the fly from the database

---

## 🔧 Technical Implementation

### Backend Changes

#### 1. **New Service Methods** (`DoubtDeskBackend/services/questionService.js`)

**Method 1: `getPendingQuestionsByGrouping()`**
- Fetches all pending and follow-up-pending questions
- Groups them by course and subject
- Returns grouped data with count of pending questions
- **Response Structure:**
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
  // ... more groups
]
```

**Method 2: `getPendingQuestionsByGroupId(courseId, subjectId, page, size)`**
- Fetches paginated questions for a specific course/subject combination
- Supports pagination
- Includes full question details (title, description, attachments)
- **Response Structure:**
```javascript
{
  content: [/* questions */],
  totalElements: 10,
  totalPages: 2,
  currentPage: 0
}
```

#### 2. **New Routes** (`DoubtDeskBackend/routes/question.js`)

**Route 1: `GET /questions/grouping/summary`**
- Gets the grouped summary of pending questions
- No query parameters required
- Returns array of grouped questions

**Route 2: `GET /questions/grouping/list`**
- Gets questions for a specific group
- Query Parameters:
  - `courseId` (optional): Filter by course
  - `subjectId` (optional): Filter by subject
  - `page` (optional, default: 0): Page number
  - `size` (optional, default: 10): Items per page
- Returns paginated questions

### Frontend Changes

#### 1. **New Component** (`ddfrontend/my-project/src/components/teacher/PendingQuestionsGroupedTable.jsx`)

**Features:**
- **Table View**: Displays grouped pending questions
  - Column 1: Course Name
  - Column 2: Subject Name
  - Column 3: Number of Pending Questions (badge)
  - Column 4: Solve Button

- **Questions View**: When user clicks Solve
  - Shows all questions in the selected group
  - Full question details with attachments
  - Individual Solve buttons for each question
  - Pagination controls

- **Solution Form**: When user clicks Solve on a question
  - Reuses existing `SolutionForm` component
  - Submits solution through `/questions/:id/solve` endpoint
  - Updates both views on success

**State Management:**
```javascript
const [groupedQuestions, setGroupedQuestions] = useState([]);     // Table data
const [selectedGroup, setSelectedGroup] = useState(null);        // Current group
const [groupQuestions, setGroupQuestions] = useState([]);        // Questions in group
const [solvingQuestion, setSolvingQuestion] = useState(null);    // Current solving question
```

#### 2. **Router Update** (`ddfrontend/my-project/src/main.jsx`)
- Replaced `PendingQuestionsDashboard` import with `PendingQuestionsGroupedTable`
- Updated route `/teacher/dashboard` to use new component
- Old component still available if needed

---

## 🎨 UI/UX Components

### 1. **Summary Cards**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total Subjects  │  │ Total Questions │  │    Courses      │  │     Status      │
│        5        │  │       42        │  │        3        │  │    Pending      │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 2. **Table Structure**
```
┌─────────────────────────────┬─────────────┬─────────────────┬──────────────┐
│    Course Name              │   Subject   │ Pending Count   │   Action     │
├─────────────────────────────┼─────────────┼─────────────────┼──────────────┤
│ Science and Mathematics     │  Physics    │       3         │  [Solve]     │
│ Science and Mathematics     │  Chemistry  │       2         │  [Solve]     │
│ Science and Mathematics     │  Math       │       3         │  [Solve]     │
└─────────────────────────────┴─────────────┴─────────────────┴──────────────┘
```

### 3. **Questions View** (After clicking Solve)
- Shows all questions for the selected group
- Question cards with:
  - Title (bold, larger font)
  - Description
  - Course and Subject name
  - Attachments (if any)
  - Individual Solve button
- Pagination controls at bottom

---

## 📊 Data Flow

```
User Navigation
       ↓
Teacher Dashboard → PendingQuestionsGroupedTable
       ↓
GET /questions/grouping/summary (fetch grouped data)
       ↓
Display Table with Summary Stats
       ↓
User clicks "Solve" on a group
       ↓
GET /questions/grouping/list?courseId=X&subjectId=Y (fetch questions)
       ↓
Display Questions in the Group
       ↓
User clicks "Solve" on a question
       ↓
Show SolutionForm Modal
       ↓
POST /questions/:id/solve (submit solution)
       ↓
Solution Success
       ↓
Refresh Data & Return to Table
```

---

## 🔄 Integration Points

### 1. **With Existing Components**
- Uses existing `SolutionForm` component for solving
- Uses existing `AttachmentDisplay` component for showing files
- Maintains same solve logic and teacher profile update

### 2. **With Backend**
- Works with existing Answer model creation
- Updates teacher's `solvedCount` through existing mechanism
- Maintains question status updates (pending → solved)

### 3. **With Authentication**
- Uses `AuthContext` for user info
- No new authentication required

---

## 🧪 Testing Checklist

- [ ] Verify table displays all course/subject combinations
- [ ] Test "Solve" button opens correct questions
- [ ] Test pagination in questions view
- [ ] Test solving a question updates the count
- [ ] Test returning to table shows updated data
- [ ] Test with multiple questions per group
- [ ] Test with single question per group
- [ ] Test empty state (no pending questions)
- [ ] Test with attachments on questions
- [ ] Verify teacher profile solvedCount updates

---

## 🚀 How to Use

### For Teachers:
1. Login as teacher
2. Navigate to "Pending Questions" (teacher/dashboard)
3. View table with all pending questions grouped by subject
4. Click "Solve" button next to the course/subject combination
5. View all questions in that category
6. Click "Solve" on individual question
7. Fill solution form and submit
8. Return to table to see updated counts

### API Usage:

**Get Summary:**
```bash
GET /api/questions/grouping/summary
Response:
[
  {
    courseId: 1,
    courseName: "Science",
    subjectId: 1,
    subjectName: "Physics",
    pendingCount: 3,
    questions: [1, 2, 3]
  }
]
```

**Get Questions in Group:**
```bash
GET /api/questions/grouping/list?courseId=1&subjectId=1&page=0&size=10
Response:
{
  content: [{...question}, {...question}],
  totalElements: 3,
  totalPages: 1,
  currentPage: 0
}
```

---

## 📝 Files Modified

1. ✅ `DoubtDeskBackend/services/questionService.js` - Added 2 new methods
2. ✅ `DoubtDeskBackend/routes/question.js` - Added 2 new routes
3. ✅ `ddfrontend/my-project/src/components/teacher/PendingQuestionsGroupedTable.jsx` - Created new component
4. ✅ `ddfrontend/my-project/src/main.jsx` - Updated router import and route

---

## 🔍 Notes

- The feature gracefully handles:
  - No pending questions (shows success message)
  - Questions without course or subject assigned
  - Multiple questions in same group
  - Pagination for large question sets
  
- Old `PendingQuestionsDashboard` component still exists for reference
- All existing functionality maintained (solving, teacher updates, notifications)
- Responsive design works on mobile and desktop

