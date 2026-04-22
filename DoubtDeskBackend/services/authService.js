const bcrypt = require('bcryptjs');
const { User, Student, Teacher, Admin, ResetToken } = require('../models');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

class AuthService {
  async registerStudent(data) {
    try {
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phones: data.phones || []
      });

      const student = await Student.create({
        userId: user.userId,
        institute: data.institute,
        levelOfStudy: data.levelOfStudy
      });

      return {
        userId: user.userId,
        studentId: student.studentId,
        name: user.name,
        email: user.email,
        institute: student.institute,
        levelOfStudy: student.levelOfStudy,
        registrationDate: student.registrationDate
      };
    } catch (error) {
      throw error;
    }
  }

  async registerTeacher(data) {
    try {
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phones: data.phones || []
      });

      const teacher = await Teacher.create({
        userId: user.userId,
        institute: data.institute,
        qualification: data.qualification
      });

      return {
        userId: user.userId,
        teacherId: teacher.teacherId,
        name: user.name,
        email: user.email,
        institute: teacher.institute,
        qualification: teacher.qualification,
        solvedCount: 0,
        joinDate: teacher.joinDate
      };
    } catch (error) {
      throw error;
    }
  }

  async registerAdmin(data) {
    try {
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phones: data.phones || []
      });

      const admin = await Admin.create({
        userId: user.userId,
        role: 'admin'
      });

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

  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      let role = 'user';
      let profile = null;

      const student = await Student.findOne({ where: { userId: user.userId } });
      if (student) {
        role = 'student';
        profile = student;
      }

      const teacher = await Teacher.findOne({ where: { userId: user.userId } });
      if (teacher) {
        role = 'teacher';
        profile = teacher;
      }

      const admin = await Admin.findOne({ where: { userId: user.userId } });
      if (admin) {
        role = 'admin';
        profile = admin;
      }

      return {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role,
        profile
      };
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const otp = generateOtp();
      const expiryDate = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

      await ResetToken.destroy({ where: { userId: user.userId } });
      await ResetToken.create({
        otp,
        expiryDate,
        userId: user.userId
      });

      return { message: 'OTP sent to email', otp }; // In production, send via email
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email, otp) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = await ResetToken.findOne({ where: { userId: user.userId } });
      if (!resetToken) {
        throw new Error('OTP expired or not found');
      }

      if (resetToken.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      if (new Date() > resetToken.expiryDate) {
        throw new Error('OTP expired');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email, newPassword) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      await ResetToken.destroy({ where: { userId: user.userId } });

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
