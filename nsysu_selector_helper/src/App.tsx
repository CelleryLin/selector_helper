import { FC, useEffect, useState } from 'react';
import { ConfigProvider, Button, List, Typography, Select } from 'antd';
import { useThemeConfig } from '@/hooks/useThemeConfig';
import { NSYSUCourseAPI } from '@/api/NSYSUCourseAPI';
import { Course, AcademicYear } from '@/types';
import SectionHeader from "#/SectionHeader.tsx";

const { Option } = Select;

const App: FC = () => {
  const [themeConfig, _setThemeConfig] = useThemeConfig();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState<AcademicYear | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  useEffect(() => {
    // 获取所有可用学期列表
    const fetchSemesters = async () => {
      try {
        const semesters = await NSYSUCourseAPI.getAvailableSemesters();
        setSemesters(semesters);
        setSelectedSemester(semesters.latest); // 默认选择最新学期
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };
    fetchSemesters().catch(console.error);
  }, []);

  useEffect(() => {
    // 加载最新学期课程
    if (selectedSemester) {
      const loadCourses = async () => {
        setLoading(true);
        try {
          const updates = await NSYSUCourseAPI.getSemesterUpdates(selectedSemester);
          const courses = await NSYSUCourseAPI.getCourses(selectedSemester, updates.latest);
          setCourses(courses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      };

      loadCourses().catch(console.error);
    }
  }, [selectedSemester]);

  return (
    <ConfigProvider theme={themeConfig}>
      <SectionHeader/>
    </ConfigProvider>
  );
};

export default App;
