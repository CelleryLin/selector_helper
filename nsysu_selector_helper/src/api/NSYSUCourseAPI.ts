import { AcademicYear, Course, SemesterUpdate } from '@/types';

const BASE_URL = 'https://whats2000.github.io/NSYSUCourseAPI';

export class NSYSUCourseAPI {
  static async getAvailableSemesters(): Promise<AcademicYear> {
    const response = await fetch(`${BASE_URL}/version.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch available semesters');
    }
    return response.json();
  }

  static async getSemesterUpdates(academicYear: string): Promise<SemesterUpdate> {
    const response = await fetch(`${BASE_URL}/${academicYear}/version.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch semester updates');
    }
    return response.json();
  }

  static async getCourses(academicYear: string, updateTime: string): Promise<Course[]> {
    const response = await fetch(`${BASE_URL}/${academicYear}/${updateTime}/all.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return response.json();
  }

  static async getLatestCourses(): Promise<Course[]> {
    const semesters = await NSYSUCourseAPI.getAvailableSemesters();
    const latestAcademicYear = semesters.latest;
    const updates = await NSYSUCourseAPI.getSemesterUpdates(latestAcademicYear);
    const latestUpdateTime = updates.latest;
    return NSYSUCourseAPI.getCourses(latestAcademicYear, latestUpdateTime);
  }
}
