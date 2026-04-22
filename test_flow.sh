#!/bin/bash
BASE_URL="http://localhost:3001/api"
TS=$(date +%s)
STUDENT_EMAIL="student_${TS}@test.com"
TEACHER_EMAIL="teacher_${TS}@test.com"
PASSWORD="password123"

echo "1) Create course title 'Flow Course'"
# Note: Course creation might fail if subjects don't exist in DB as IDs. Let's try sending just basic info.
# Or if it's many-to-many, we might need existing Subject records.
curl -s -X POST "$BASE_URL/courses" -H "Content-Type: application/json" -d '{"title": "Flow Course", "price": 99.99, "category": "Test"}'
echo ""

echo -e "\n2) Register student + teacher"
curl -s -X POST "$BASE_URL/auth/register/student" -H "Content-Type: application/json" -d "{\"email\": \"$STUDENT_EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"Student $TS\", \"institute\": \"Test School\"}"
echo ""
curl -s -X POST "$BASE_URL/auth/register/teacher" -H "Content-Type: application/json" -d "{\"email\": \"$TEACHER_EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"Teacher $TS\", \"institute\": \"Test College\", \"qualification\": \"PhD\"}"
echo ""

echo -e "\n3) Student payment enrollment for Flow Course"
curl -s -X POST "$BASE_URL/payments" -H "Content-Type: application/json" -d "{\"studentEmail\": \"$STUDENT_EMAIL\", \"courseName\": \"Flow Course\", \"paymentMethod\": \"Stripe\", \"amount\": 99.99}"
echo ""

echo -e "\n4) Create question for that student"
QUESTION_RESP=$(curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -d "{\"studentEmail\": \"$STUDENT_EMAIL\", \"courseName\": \"Flow Course\", \"subjectName\": \"Math\", \"questionTitle\": \"How to solve 1+1?\", \"description\": \"Please help\", \"attachments\": []}")
echo $QUESTION_RESP
QUESTION_ID=$(echo $QUESTION_RESP | sed -n 's/.*"questionId":\([0-9]*\).*/\1/p')
echo "Question ID: $QUESTION_ID"

echo -e "\n5) Query student question history"
curl -s -X GET "$BASE_URL/questions/by-student?email=$STUDENT_EMAIL"
echo ""

echo -e "\n6) Query teacher pending questions"
curl -s -X GET "$BASE_URL/questions/pending?email=$TEACHER_EMAIL"
echo ""

echo -e "\n7) Solve the created question"
curl -s -X POST "$BASE_URL/questions/$QUESTION_ID/solve" -H "Content-Type: application/json" -d "{\"teacherEmail\": \"$TEACHER_EMAIL\", \"solutionText\": \"1+1=2\", \"attachments\": []}"
echo ""

echo -e "\n8) Query solved-by-teacher list"
curl -s -X GET "$BASE_URL/questions/solved-by-teacher?email=$TEACHER_EMAIL"
echo ""

echo -e "\n9) Mark question satisfied"
curl -s -X PATCH "$BASE_URL/questions/$QUESTION_ID/status/satisfied"
echo ""

echo -e "\n10) Fetch question by id"
curl -s -X GET "$BASE_URL/questions/$QUESTION_ID"
echo ""
