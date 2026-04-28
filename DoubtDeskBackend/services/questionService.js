const { 
  Question, Student, Teacher, User, Answer, Attachment, Course, Subject, Notification 
} = require('../models');
const { Op } = require('sequelize');

class QuestionService {
  toQuestionResponseDTO(question) {
    const q = question?.toJSON ? question.toJSON() : question;
    const answer = q?.answer || null;
    const teacherUser = answer?.teacher?.User || null;
    const studentUser = q?.student?.User || null;

    const followUps = (q?.followUpQuestions || []).map((followUp) => {
      const followUpAnswer = followUp?.answer || null;

      return {
        questionId: followUp.questionId,
        questionTitle: followUp.questionTitle,
        description: followUp.description,
        status: followUp.status,
        postAt: followUp.postAt,
        answerAt: followUpAnswer?.answerAt || followUp.answeredAt || null,
        solutionText: followUpAnswer?.answerText || null,
        questionAttachments: (followUp.questionAttachments || []).map((a) => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileType: a.fileType
        })),
        solutionAttachments: (followUpAnswer?.answerAttachments || []).map((a) => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileType: a.fileType
        }))
      };
    });

    return {
      questionId: q.questionId,
      questionTitle: q.questionTitle,
      description: q.description,
      status: q.status,
      postAt: q.postAt,
      answerAt: answer?.answerAt || q.answeredAt || null,
      subjectName: q.subject?.subjectName || null,
      courseName: q.course?.title || null,
      studentEmail: studentUser?.email || null,
      studentName: studentUser?.name || null,
      solutionText: answer?.answerText || null,
      solvedByTeacherName: teacherUser?.name || null,
      solvedByTeacherEmail: teacherUser?.email || null,
      questionAttachments: (q.questionAttachments || []).map((a) => ({
        fileName: a.fileName,
        fileUrl: a.fileUrl,
        fileType: a.fileType
      })),
      solutionAttachments: (answer?.answerAttachments || []).map((a) => ({
        fileName: a.fileName,
        fileUrl: a.fileUrl,
        fileType: a.fileType
      })),
      followUpQuestions: followUps
    };
  }

  async createQuestion(data) {
    try {
      const studentEmail = data.studentEmail || data.email;
      if (!studentEmail) {
        throw new Error('studentEmail is required');
      }

      const student = await Student.findOne({
        include: [{ model: User, where: { email: studentEmail } }]
      });

      if (!student) {
        throw new Error('Student not found');
      }

      let subjectId = null;
      let courseId = null;

      if (data.subjectName) {
        const [subject] = await Subject.findOrCreate({
          where: { subjectName: data.subjectName }
        });
        subjectId = subject.subjectId;
      }

      if (data.courseName) {
        const [course] = await Course.findOrCreate({
          where: { title: data.courseName },
          defaults: { price: 0 }
        });
        courseId = course.courseId;
      }

      const question = await Question.create({
        questionTitle: data.questionTitle,
        description: data.description,
        studentId: student.studentId,
        subjectId,
        courseId,
        status: 'pending'
      });

      if (data.attachments && data.attachments.length > 0) {
        await Attachment.bulkCreate(
          data.attachments.map(att => ({
            ...att,
            questionId: question.questionId
          }))
        );
      }

      return await this.getQuestionById(question.questionId);
    } catch (error) {
      throw error;
    }
  }

  async getQuestionsByStudentEmail(email, page = 0, size = 10) {
    try {
      const offset = page * size;

      const student = await Student.findOne({
        include: [{ model: User, where: { email } }]
      });

      if (!student) {
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      const { count, rows } = await Question.findAndCountAll({
        include: [
          {
            model: Student,
            as: 'student',
            include: [{ model: User }]
          },
          { model: Subject, as: 'subject' },
          { model: Course, as: 'course' },
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
          },
          {
            model: Attachment,
            as: 'questionAttachments'
          },
          {
            model: Question,
            as: 'followUpQuestions',
            include: [
              {
                model: Answer,
                as: 'answer',
                include: [
                  {
                    model: Attachment,
                    as: 'answerAttachments'
                  }
                ]
              },
              {
                model: Attachment,
                as: 'questionAttachments'
              }
            ]
          }
        ],
        where: {
          studentId: student.studentId
        },
        offset,
        limit: size
      });

      return {
        content: rows.map((q) => this.toQuestionResponseDTO(q)),
        totalElements: count,
        totalPages: Math.ceil(count / size),
        currentPage: page
      };
    } catch (error) {
      throw error;
    }
  }

  async getQuestionsByStudentEmailAndCourse(email, courseName, page = 0, size = 10) {
    try {
      const offset = page * size;

      const course = await Course.findOne({ where: { title: courseName } });
      if (!course) {
        throw new Error('Course not found');
      }

      const student = await Student.findOne({
        include: [{ model: User, where: { email } }]
      });

      if (!student) {
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      const { count, rows } = await Question.findAndCountAll({
        include: [
          {
            model: Student,
            as: 'student',
            include: [{ model: User }]
          },
          { model: Subject, as: 'subject' },
          { model: Course, as: 'course' },
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
          },
          {
            model: Attachment,
            as: 'questionAttachments'
          },
          {
            model: Question,
            as: 'followUpQuestions',
            include: [
              {
                model: Answer,
                as: 'answer',
                include: [
                  {
                    model: Attachment,
                    as: 'answerAttachments'
                  }
                ]
              },
              {
                model: Attachment,
                as: 'questionAttachments'
              }
            ]
          }
        ],
        where: {
          studentId: student.studentId,
          courseId: course.courseId
        },
        offset,
        limit: size
      });

      return {
        content: rows.map((q) => this.toQuestionResponseDTO(q)),
        totalElements: count,
        totalPages: Math.ceil(count / size),
        currentPage: page
      };
    } catch (error) {
      throw error;
    }
  }

  async getPendingQuestionsForTeacher(email, page = 0, size = 10) {
    try {
      const offset = page * size;

      const { count, rows } = await Question.findAndCountAll({
        include: [
          {
            model: Student,
            as: 'student',
            include: [{ model: User }]
          },
          { model: Subject, as: 'subject' },
          { model: Course, as: 'course' },
          {
            model: Answer,
            as: 'answer',
            include: [
              {
                model: Teacher,
                as: 'teacher',
                include: [{ model: User }]
              }
            ]
          },
          {
            model: Attachment,
            as: 'questionAttachments'
          },
          {
            model: Question, as: "Question",
            as: 'followUpQuestions',
            include: [
              {
                model: Attachment,
                as: 'questionAttachments'
              }
            ]
          }
        ],
        where: {
          status: {
            [Op.in]: ['pending', 'follow-up-pending']
          }
        },
        offset,
        limit: size
      });

      return {
        content: rows.map((q) => this.toQuestionResponseDTO(q)),
        totalElements: count,
        totalPages: Math.ceil(count / size),
        currentPage: page
      };
    } catch (error) {
      throw error;
    }
  }

  async getSolvedQuestionsByTeacher(email) {
    try {
      const teacher = await Teacher.findOne({
        include: [{ model: User, where: { email } }]
      });

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      const answers = await Answer.findAll({
        where: { teacherId: teacher.teacherId },
        include: [
          {
            model: Question, as: "Question",
            include: [
              {
                model: Student,
                as: 'student',
                include: [{ model: User }]
              },
              { model: Subject, as: 'subject' },
              { model: Course, as: 'course' },
              {
                model: Attachment,
                as: 'questionAttachments'
              }
            ]
          },
          {
            model: Attachment,
            as: 'answerAttachments'
          }
        ]
      });

      return answers.map((a) => ({
        questionId: a.Question.questionId,
        questionTitle: a.Question.questionTitle,
        description: a.Question.description,
        status: a.Question.status,
        postAt: a.Question.postAt,
        answerAt: a.answerAt,
        subjectName: a.Question.subject?.subjectName || null,
        courseName: a.Question.course?.title || null,
        studentEmail: a.Question.student?.User?.email || null,
        studentName: a.Question.student?.User?.name || null,
        solutionText: a.answerText || null,
        solvedByTeacherName: teacher.User?.name || null,
        solvedByTeacherEmail: teacher.User?.email || null,
        questionAttachments: (a.Question.questionAttachments || []).map((att) => ({
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          fileType: att.fileType
        })),
        solutionAttachments: (a.answerAttachments || []).map((att) => ({
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          fileType: att.fileType
        }))
      }));
    } catch (error) {
      throw error;
    }
  }

  async solveQuestion(questionId, data) {
    try {
      const question = await Question.findByPk(questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      const teacher = await Teacher.findOne({
        include: [{ model: User, where: { email: data.teacherEmail } }]
      });

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      const answer = await Answer.create({
        answerText: data.solutionText,
        questionId,
        teacherId: teacher.teacherId,
        studentId: question.studentId
      });

      if (data.attachments && data.attachments.length > 0) {
        await Attachment.bulkCreate(
          data.attachments.map(att => ({
            ...att,
            answerId: answer.answerId
          }))
        );
      }

      const statusUpdate = question.status === 'follow-up-pending' ? 'follow-up-solved' : 'solved';
      await question.update({ status: statusUpdate, answeredAt: new Date() });

      await teacher.increment('solvedCount');

      const student = await Student.findByPk(question.studentId, {
        include: [{ model: User }]
      });

      if (student?.User?.email) {
        await Notification.create({
          recipientEmail: student.User.email,
          questionId,
          message: `Your question "${question.questionTitle}" has been answered.`,
          type: 'solution',
          read: false
        });
      }

      return await this.getQuestionById(questionId);
    } catch (error) {
      throw error;
    }
  }

  async editSolution(questionId, data) {
    try {
      const question = await Question.findByPk(questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      const answer = await Answer.findOne({ where: { questionId } });
      if (!answer) {
        throw new Error('Answer not found');
      }

      const teacher = await Teacher.findOne({
        include: [{ model: User, where: { email: data.teacherEmail } }]
      });

      if (!teacher || teacher.teacherId !== answer.teacherId) {
        throw new Error('Not authorized to edit this solution');
      }

      await answer.update({ answerText: data.solutionText, answerAt: new Date() });

      if (data.attachments && data.attachments.length > 0) {
        // Option to handle attachments. We'll add them to existing attachments for simplicity,
        // or the frontend can send all attachments. Since the form currently just appends, we'll create new ones.
        await Attachment.bulkCreate(
          data.attachments.map(att => ({
            ...att,
            answerId: answer.answerId
          }))
        );
      }

      return await this.getQuestionById(questionId);
    } catch (error) {
      throw error;
    }
  }

  async markQuestionAsSatisfied(questionId) {
    try {
      const question = await Question.findByPk(questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      await question.update({ status: 'satisfied' });
      return { message: 'Question marked as satisfied' };
    } catch (error) {
      throw error;
    }
  }

  async createFollowUpQuestion(originalQuestionId, data) {
    try {
      const originalQuestion = await Question.findByPk(originalQuestionId);
      if (!originalQuestion) {
        throw new Error('Original question not found');
      }

      const followUp = await Question.create({
        questionTitle: data.questionTitle,
        description: data.description,
        studentId: originalQuestion.studentId,
        subjectId: originalQuestion.subjectId,
        courseId: originalQuestion.courseId,
        originalQuestionId,
        status: 'follow-up-pending'
      });

      if (data.attachments && data.attachments.length > 0) {
        await Attachment.bulkCreate(
          data.attachments.map(att => ({
            ...att,
            questionId: followUp.questionId
          }))
        );
      }

      return await this.getQuestionById(followUp.questionId);
    } catch (error) {
      throw error;
    }
  }

  async getQuestionById(questionId) {
    try {
      const question = await Question.findByPk(questionId, {
        include: [
          {
            model: Student,
            as: 'student',
            include: [{ model: User }]
          },
          { model: Subject, as: 'subject' },
          { model: Course, as: 'course' },
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
          },
          {
            model: Attachment,
            as: 'questionAttachments'
          }
        ]
      });

      if (!question) {
        throw new Error('Question not found');
      }

      return this.toQuestionResponseDTO(question);
    } catch (error) {
      throw error;
    }
  }

  async getPendingQuestionsByGrouping() {
    try {
      const pendingQuestions = await Question.findAll({
        include: [
          { model: Course, as: 'course' },
          { model: Subject, as: 'subject' }
        ],
        where: {
          status: {
            [Op.in]: ['pending', 'follow-up-pending']
          }
        }
      });

      // Group by course and subject
      const groupedData = {};

      pendingQuestions.forEach((question) => {
        const courseName = question.course?.title || 'Unassigned Course';
        const subjectName = question.subject?.subjectName || 'Unassigned Subject';
        const courseId = question.course?.courseId || null;
        const subjectId = question.subject?.subjectId || null;

        const key = `${courseId}_${subjectId}`;

        if (!groupedData[key]) {
          groupedData[key] = {
            courseId,
            courseName,
            subjectId,
            subjectName,
            pendingCount: 0,
            questions: []
          };
        }

        groupedData[key].pendingCount += 1;
        groupedData[key].questions.push(question.questionId);
      });

      // Convert to array and sort
      const result = Object.values(groupedData).sort((a, b) => {
        if (a.courseName !== b.courseName) {
          return a.courseName.localeCompare(b.courseName);
        }
        return a.subjectName.localeCompare(b.subjectName);
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPendingQuestionsByGroupId(courseId, subjectId, page = 0, size = 10) {
    try {
      const offset = page * size;
      
      const where = {
        status: {
          [Op.in]: ['pending', 'follow-up-pending']
        }
      };

      if (courseId && courseId !== 'null') {
        where.courseId = courseId;
      } else {
        where.courseId = null;
      }

      if (subjectId && subjectId !== 'null') {
        where.subjectId = subjectId;
      } else {
        where.subjectId = null;
      }

      const { count, rows } = await Question.findAndCountAll({
        include: [
          {
            model: Student,
            as: 'student',
            include: [{ model: User }]
          },
          { model: Subject, as: 'subject' },
          { model: Course, as: 'course' },
          {
            model: Attachment,
            as: 'questionAttachments'
          }
        ],
        where,
        offset,
        limit: size,
        order: [['postAt', 'DESC']]
      });

      return {
        content: rows.map((q) => this.toQuestionResponseDTO(q)),
        totalElements: count,
        totalPages: Math.ceil(count / size),
        currentPage: page
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new QuestionService();
