const { Teacher, User } = require('../models');

class TeacherService {
  async getProfile(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const teacher = await Teacher.findOne({
        where: { userId: user.userId },
        include: [{ model: User, attributes: ['name', 'email', 'phones'] }]
      });

      if (!teacher) {
        throw new Error('Teacher profile not found');
      }

      return {
        userId: user.userId,
        teacherId: teacher.teacherId,
        name: user.name,
        email: user.email,
        institute: teacher.institute,
        qualification: teacher.qualification,
        solvedCount: teacher.solvedCount,
        joinDate: teacher.joinDate,
        isActive: teacher.isActive,
        phones: user.phones
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TeacherService();
