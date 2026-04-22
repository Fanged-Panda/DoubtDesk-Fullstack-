const { sequelize } = require('../config/database');

const User = require('./User')(sequelize);
const Student = require('./Student')(sequelize);
const Teacher = require('./Teacher')(sequelize);
const Admin = require('./Admin')(sequelize);
const Course = require('./Course')(sequelize);
const Subject = require('./Subject')(sequelize);
const Question = require('./Question')(sequelize);
const Answer = require('./Answer')(sequelize);
const Attachment = require('./Attachment')(sequelize);
const Payment = require('./Payment')(sequelize);
const Feedback = require('./Feedback')(sequelize);
const ResetToken = require('./ResetToken')(sequelize);

// Associations

// User relationships
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Teacher, { foreignKey: 'userId', onDelete: 'CASCADE' });
Teacher.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Admin, { foreignKey: 'userId', onDelete: 'CASCADE' });
Admin.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(ResetToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
ResetToken.belongsTo(User, { foreignKey: 'userId' });

// Student relationships
Student.hasMany(Question, { foreignKey: 'studentId', as: 'askedQuestions' });
Question.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Student.hasMany(Answer, { foreignKey: 'studentId' });
Answer.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Student.hasMany(Payment, { foreignKey: 'studentId' });
Payment.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Feedback, { foreignKey: 'studentId' });
Feedback.belongsTo(Student, { foreignKey: 'studentId' });

// Teacher relationships
Teacher.hasMany(Answer, { foreignKey: 'teacherId', as: 'providedAnswers' });
Answer.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });

Teacher.hasMany(Feedback, { foreignKey: 'teacherId', as: 'receivedFeedbacks' });
Feedback.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });

// Course relationships
Course.hasMany(Payment, { foreignKey: 'courseId' });
Payment.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(Question, { foreignKey: 'courseId', as: 'questions' });
Question.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Subject relationships
Subject.hasMany(Question, { foreignKey: 'subjectId' });
Question.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

// Question relationships
Question.hasOne(Answer, { foreignKey: 'questionId', as: 'answer' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

Question.hasMany(Attachment, { foreignKey: 'questionId', as: 'questionAttachments' });
Attachment.belongsTo(Question, { foreignKey: 'questionId' });

Question.hasMany(Question, { foreignKey: 'originalQuestionId', as: 'followUpQuestions', sourceKey: 'questionId' });
Question.belongsTo(Question, { foreignKey: 'originalQuestionId', as: 'originalQuestion' });

// Answer relationships
Answer.hasMany(Attachment, { foreignKey: 'answerId', as: 'answerAttachments' });
Attachment.belongsTo(Answer, { foreignKey: 'answerId' });

// Course-Subject M:M
const CourseSubject = sequelize.define('CourseSubject', {}, { tableName: 'course_subjects' });
Course.belongsToMany(Subject, { through: CourseSubject, as: 'subjects' });
Subject.belongsToMany(Course, { through: CourseSubject, as: 'courses' });

module.exports = {
  sequelize,
  User,
  Student,
  Teacher,
  Admin,
  Course,
  Subject,
  Question,
  Answer,
  Attachment,
  Payment,
  Feedback,
  ResetToken,
  CourseSubject
};
