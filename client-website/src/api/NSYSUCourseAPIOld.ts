import { CourseDataFilesInfo } from '@/types';
import Papa from 'papaparse';

const BASE_URL =
  'https://api.github.com/repos/CelleryLin/selector_helper_old/contents/all_classes';

export class NSYSUCourseAPIOld {
  /**
   * 取得所有可用課程資料檔案
   */
  static async getAvailableCourseDataFiles(): Promise<CourseDataFilesInfo[]> {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch available course data files');
    }
    return response.json();
  }

  /**
   * 下載指定課程資料檔案
   * @param fileName 課程資料檔案名稱
   */
  static async getCourseData(fileName: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/${fileName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course data');
    }
    return response.text();
  }

  /**
   * 解析 CSV 內容並返回去重的課程資料
   * @param csvText CSV 文字
   */
  static parseCourseData(csvText: string): Course[] {
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
}
