const { Course, Subject, CourseSubject } = require('../models');
const { sequelize } = require('../config/database');

class CourseService {
  async getAllCourses() {
    try {
      const courses = await Course.findAll({
        include: [{ model: Subject, as: 'subjects', through: { attributes: [] } }]
      });
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async createCourse(data) {
    try {
      const course = await Course.create({
        title: data.title,
        category: data.category,
        price: data.price,
        duration: data.duration
      });

      if (data.subjects && data.subjects.length > 0) {
        await course.setSubjects(data.subjects);
      }

      return {
        courseId: course.courseId,
        title: course.title,
        category: course.category,
        price: course.price,
        duration: course.duration
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(courseId) {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      await course.destroy();
      return { message: 'Course deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getCourseById(courseId) {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CourseService();
