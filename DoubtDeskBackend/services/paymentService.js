const { Payment, Student, Course, User } = require('../models');

class PaymentService {
  async createPayment(data) {
    try {
      const studentEmail = data.studentEmail || data.email;
      const courseName = data.courseName || data.title;

      if (!studentEmail || !courseName) {
        throw new Error('studentEmail and courseName are required');
      }

      const student = await Student.findOne({
        include: [{ model: User, where: { email: studentEmail } }]
      });

      if (!student) {
        throw new Error('Student not found');
      }

      const course = await Course.findOne({ where: { title: courseName } });
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if already enrolled
      const existingPayment = await Payment.findOne({
        where: { studentId: student.studentId, courseId: course.courseId }
      });

      if (existingPayment) {
        throw new Error('Student already enrolled in this course');
      }

      const resolvedAmount = data.amount ?? course.price ?? 0;

      const payment = await Payment.create({
        amount: resolvedAmount,
        paymentMethod: data.paymentMethod,
        studentId: student.studentId,
        courseId: course.courseId,
        paymentDate: new Date()
      });

      return {
        paymentId: payment.paymentId,
        studentEmail,
        courseName,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate
      };
    } catch (error) {
      throw error;
    }
  }

  async getMoneyFlow() {
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

module.exports = new PaymentService();
