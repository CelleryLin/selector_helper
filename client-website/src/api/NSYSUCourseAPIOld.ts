import { Course, CourseDataFilesInfo } from '@/types';
import Papa from 'papaparse';

const BASE_URL =
  'https://api.github.com/repos/CelleryLin/selector_helper_old/contents/all_classes';

export class NSYSUCourseAPIOld {
  /**
   * 解析 CSV 內容並返回去重的課程資料
   * @param csvText CSV 文字
   */
  private static parseCourseData(csvText: string): Course[] {
    const results = Papa.parse<Course>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    return results.data.filter(
      (course, index, self) =>
        index ===
        self.findIndex(
          (c) =>
            c['Name'] === course['Name'] &&
            c['Number'] === course['Number'] &&
            c['Teacher'] === course['Teacher'],
        ),
    );
  }

  /**
   * 取得所有可用課程資料檔案
   */
  static async getAvailableSemesters(): Promise<CourseDataFilesInfo[]> {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        console.error('Failed to fetch available course data files');
        return [];
      }
      const files = await response.json();
      if (!Array.isArray(files)) {
        console.error('Invalid course data files, it should be an array');
        return [];
      }

      if (files.length === 0) {
        console.error('No course data files found');
        return [];
      }

      const groupedFiles = files
        .filter((file) => file.name.endsWith('.csv'))
        .reduce(
          (
            acc: {
              [key: string]: CourseDataFilesInfo[];
            },
            file,
          ) => {
            const match = file.name.match(/all_classes_(\d{3})([123])_/);
            if (!match) return acc;

            const key = `${match[1]}-${match[2]}`; // Group key: academicYear-semester
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(file);

            return acc;
          },
          {},
        );

      // Select the latest file for each academic year and semester
      return Object.values(groupedFiles).map((group) => {
        return group.sort((a, b) => b.name.localeCompare(a.name))[0];
      });
    } catch (error) {
      console.error(error);
    }

    return [];
  }

  /**
   * 下載指定課程資料檔案
   * @param version 課程資料檔案資訊
   */
  static async getSemesterUpdates(
    version: CourseDataFilesInfo,
  ): Promise<Course[]> {
    try {
      const response = await fetch(version.download_url);
      if (!response.ok) {
        console.error('Failed to fetch course data file');
        return [];
      }
      const csvText = await response.text();

      if (!csvText) {
        console.error('Empty course data file');
        return [];
      }

      return this.parseCourseData(csvText);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
