const { Student, User, Course, Payment } = require('../models');
const { Op } = require('sequelize');

class StudentService {
  async getProfile(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const student = await Student.findOne({
        where: { userId: user.userId },
        include: [{ model: User, attributes: ['name', 'email', 'phones'] }]
      });

      if (!student) {
        throw new Error('Student profile not found');
      }

      return {
        userId: user.userId,
        studentId: student.studentId,
        name: user.name,
        email: user.email,
        institute: student.institute,
        levelOfStudy: student.levelOfStudy,
        registrationDate: student.registrationDate,
        phones: user.phones
      };
    } catch (error) {
      throw error;
    }
  }

  async getEnrolledCourses(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const student = await Student.findOne({ where: { userId: user.userId } });
      if (!student) {
        throw new Error('Student not found');
      }

      const payments = await Payment.findAll({
        where: { studentId: student.studentId },
        include: [
          {
            model: Course,
            attributes: ['courseId', 'title', 'category', 'price', 'duration']
          }
        ]
      });

      return payments.map(p => ({
        courseId: p.Course.courseId,
        title: p.Course.title,
        category: p.Course.category,
        price: p.Course.price,
        duration: p.Course.duration,
        enrollmentDate: p.paymentDate
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StudentService();
