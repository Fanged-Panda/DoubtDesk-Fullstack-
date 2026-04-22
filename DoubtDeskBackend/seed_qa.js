const { sequelize, User, Student, Teacher, Course, Subject, Question, Answer } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    
    // Get or create students, courses, and subjects
    let student = await Student.findOne();
    if (!student) {
      console.log("Creating a student user...");
      const user = await User.create({ 
        name: 'Sajad Student', 
        email: 'sajad.student@example.com', 
        password: 'password', 
        role: 'student' 
      });
      student = await Student.create({ 
        userId: user.userId, 
        institute: 'Engineering Institute',
        levelOfStudy: '12th Grade'
      });
    }

    let course = await Course.findOne();
    if (!course) {
      console.log("Creating a course...");
      course = await Course.create({ title: 'Science and Mathematics', price: 5000 });
    }

    // Create/Get subjects: Physics, Chemistry, Math, ICT
    const subjectNames = ['Physics', 'Chemistry', 'Mathematics', 'ICT'];
    const subjects = {};
    
    for (const subjectName of subjectNames) {
      let subject = await Subject.findOne({ where: { subjectName } });
      if (!subject) {
        console.log(`Creating subject: ${subjectName}`);
        subject = await Subject.create({ subjectName });
      }
      subjects[subjectName] = subject;
    }

    // Get or create a teacher
    let teacher = await Teacher.findOne();
    if (!teacher) {
      console.log("Creating a teacher user...");
      const user = await User.create({ 
        name: 'Expert Teacher', 
        email: 'expert.teacher@example.com', 
        password: 'password', 
        role: 'teacher' 
      });
      teacher = await Teacher.create({ 
        userId: user.userId, 
        institute: 'Expert Academy',
        qualification: 'M.Sc, B.Ed',
        solvedCount: 0
      });
    }

    // Define pending questions with details
    const pendingQuestionsData = [
      // Physics
      { subject: 'Physics', title: 'What is the velocity of light in vacuum?', desc: 'I need to understand the exact value and significance of the speed of light.' },
      { subject: 'Physics', title: 'Explain Newton\'s Third Law of Motion', desc: 'Can someone explain this law with practical examples?' },
      { subject: 'Physics', title: 'How does momentum conservation work in collisions?', desc: 'I\'m confused about how momentum is conserved in elastic and inelastic collisions.' },
      
      // Chemistry
      { subject: 'Chemistry', title: 'What is the difference between oxidation and reduction?', desc: 'Please explain with examples.' },
      { subject: 'Chemistry', title: 'How does Le Chatelier\'s principle work?', desc: 'I don\'t understand how a system responds to changes in conditions.' },
      
      // Mathematics
      { subject: 'Mathematics', title: 'Solve: Find the roots of x² - 5x + 6 = 0', desc: 'Can someone solve this quadratic equation step by step?' },
      { subject: 'Mathematics', title: 'Explain derivatives and their applications', desc: 'What are derivatives and how do we use them in real life?' },
      { subject: 'Mathematics', title: 'What is the binomial theorem?', desc: 'How is it used to expand expressions like (a+b)^n?' },
      
      // ICT
      { subject: 'ICT', title: 'What is the difference between RAM and ROM?', desc: 'Can someone explain the key differences and uses?' },
      { subject: 'ICT', title: 'How does the Internet work?', desc: 'Explain the basic concept of how data travels across the internet.' }
    ];

    // Add 10 pending questions
    console.log("\n✓ Adding 10 pending questions from different subjects...");
    const pendingQuestions = [];
    for (let i = 0; i < pendingQuestionsData.length; i++) {
      const qData = pendingQuestionsData[i];
      const question = await Question.create({
        questionTitle: qData.title,
        description: qData.desc,
        status: 'pending',
        studentId: student.studentId,
        courseId: course.courseId,
        subjectId: subjects[qData.subject].subjectId,
        postAt: new Date()
      });
      pendingQuestions.push(question);
      console.log(`  [${i + 1}] ${qData.subject}: ${qData.title}`);
    }

    // Define solutions for the questions
    const solutionTexts = [
      'The speed of light in vacuum is approximately 3 × 10⁸ m/s. This is a fundamental constant denoted by "c" and is used in many physics equations like E=mc².',
      'Newton\'s Third Law states "For every action, there is an equal and opposite reaction." Example: When you push a wall, the wall pushes back with equal force.',
      'In collisions, the total momentum before collision equals the total momentum after collision. This holds true in both elastic (bouncy) and inelastic (sticky) collisions.',
      'Oxidation is the loss of electrons while reduction is the gain of electrons. In a reaction like 2H₂ + O₂ → 2H₂O, hydrogen is oxidized and oxygen is reduced.',
      'Le Chatelier\'s principle states that when a system in equilibrium is disturbed, it shifts to counteract the disturbance. For example, increasing pressure shifts equilibrium toward fewer gas molecules.',
      'x² - 5x + 6 = 0. Factoring: (x-2)(x-3) = 0. Therefore, x = 2 or x = 3. These are the roots of the equation.',
      'Derivatives measure the rate of change of a function. They are used in optimization problems, physics (velocity, acceleration), and many real-world applications like calculating profit margins.',
      'The binomial theorem states (a+b)ⁿ = Σ C(n,r) × aⁿ⁻ʳ × bʳ. For example, (a+b)² = a² + 2ab + b². It\'s useful in probability and algebra.',
      'RAM (Random Access Memory) is volatile, fast, and used for temporary storage during processing. ROM (Read-Only Memory) is non-volatile, slower, and contains permanent instructions like the BIOS.',
      'The Internet works through packet switching where data is broken into packets, sent through various routers using IP addresses, and reassembled at the destination. TCP/IP protocols ensure reliable delivery.'
    ];

    // Create answers for pending questions (mark them as solved)
    console.log("\n✓ Creating solutions for the questions...");
    let solvedCount = 0;
    for (let i = 0; i < pendingQuestions.length; i++) {
      const question = pendingQuestions[i];
      
      // Update question status to solved
      question.status = 'solved';
      question.answeredAt = new Date();
      await question.save();

      // Create answer
      await Answer.create({
        answerText: solutionTexts[i],
        questionId: question.questionId,
        teacherId: teacher.teacherId,
        studentId: student.studentId,
        answerAt: new Date()
      });

      solvedCount++;
      const subjectName = pendingQuestionsData[i].subject;
      console.log(`  ✓ Solution added: ${subjectName} - "${pendingQuestionsData[i].title}"`);
    }

    // Update teacher's solved count
    teacher.solvedCount = (teacher.solvedCount || 0) + solvedCount;
    await teacher.save();
    console.log(`\n✓ Teacher solved count updated: ${teacher.solvedCount} questions`);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✓ Database seeded successfully!");
    console.log(`  • Questions solved: ${solvedCount}`);
    console.log(`  • Teacher: ${teacher.userId} (${await User.findByPk(teacher.userId).then(u => u.name)})`);
    console.log(`  • Total solve count: ${teacher.solvedCount}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
