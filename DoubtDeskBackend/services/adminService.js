const { 
  Admin, Student, Teacher, User, Question, Payment, Course, Subject, Answer, Attachment
} = require('../models');

class AdminService {
  async getProfile(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const admin = await Admin.findOne({
        where: { userId: user.userId }
      });

      if (!admin) {
        throw new Error('Admin not found');
      }

      return {
        userId: user.userId,
        adminId: admin.adminId,
        name: user.name,
        email: user.email,
        role: admin.role
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllStudents() {
    try {
      const students = await Student.findAll({
        include: [{ model: User, attributes: ['userId', 'name', 'email', 'isActive'] }]
      });

      return students.map(s => ({
        userId: s.User.userId,
        studentId: s.studentId,
        name: s.User.name,
        email: s.User.email,
        institute: s.institute,
        levelOfStudy: s.levelOfStudy,
        registrationDate: s.registrationDate,
        isActive: s.User.isActive
      }));
    } catch (error) {
      throw error;
    }
  }

  async toggleStudentStatus(userId, isActive) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive });
      return { message: 'Student status updated' };
    } catch (error) {
      throw error;
    }
  }

  async getAllTeachers() {
    try {
      const teachers = await Teacher.findAll({
        include: [{ model: User, attributes: ['userId', 'name', 'email', 'isActive'] }]
      });

      return teachers.map(t => ({
        userId: t.User.userId,
        teacherId: t.teacherId,
        name: t.User.name,
        email: t.User.email,
        institute: t.institute,
        qualification: t.qualification,
        solvedCount: t.solvedCount,
        solvedQuestionsCount: t.solvedCount,
        joinDate: t.joinDate,
        isActive: t.User.isActive
      }));
    } catch (error) {
      throw error;
    }
  }

  async toggleTeacherStatus(userId, isActive) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive });
      return { message: 'Teacher status updated' };
    } catch (error) {
      throw error;
    }
  }

  async getAllQuestions() {
    try {
      const questions = await Question.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            include: [{ model: User }]
          },
          { model: Course, as: 'course' },
          { model: Subject, as: 'subject' },
          { model: Attachment, as: 'questionAttachments' },
          {
            model: Answer,
            as: 'answer',
            include: [
              {
                model: Teacher,
                as: 'teacher',
                include: [{ model: User }]
              },
              {
                model: Attachment,
                as: 'answerAttachments'
              }
            ]
          }
        ]
      });

      return questions.map(q => ({
        questionId: q.questionId,
        questionTitle: q.questionTitle,
        title: q.questionTitle,
        description: q.description,
        status: q.status,
        postAt: q.postAt,
        answerAt: q.answer?.answerAt || null,
        solutionText: q.answer?.answerText || null,
        solvedByTeacherName: q.answer?.teacher?.User?.name || null,
        studentEmail: q.student.User.email,
        courseName: q.course?.title,
        subjectName: q.subject?.subjectName,
        solvedByTeacherEmail: q.answer?.teacher?.User?.email || null,
        questionAttachments: (q.questionAttachments || []).map((a) => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileType: a.fileType
        })),
        solutionAttachments: (q.answer?.answerAttachments || []).map((a) => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileType: a.fileType
        }))
      }));
    } catch (error) {
      throw error;
    }
  }

  async deleteQuestion(questionId) {
    try {
      const question = await Question.findByPk(questionId, {
        include: [{ model: Answer, as: 'answer' }]
      });
      if (!question) {
        throw new Error('Question not found');
      }

      // Delete question attachments
      await Attachment.destroy({ where: { questionId } });
      
      // If there is an answer, delete its attachments and then the answer
      if (question.answer) {
        await Attachment.destroy({ where: { answerId: question.answer.answerId } });
        await question.answer.destroy();
      }

      await question.destroy();
      return { message: 'Question deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getMoneyFlowData() {
    try {
      const payments = await Payment.findAll({
        include: [
          {
            model: Student,
            include: [{ model: User }]
          },
          { model: Course }
        ]
      });

      return payments.map(p => ({
        paymentId: p.paymentId,
        studentEmail: p.Student.User.email,
        courseName: p.Course.title,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        paymentDate: p.paymentDate
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdminService();
