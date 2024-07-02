import { FC, useEffect, useState } from 'react';
import { ConfigProvider, Button, List, Typography, Select } from 'antd';
import { useThemeConfig } from '@/hooks/useThemeConfig';
import { NSYSUCourseAPI } from '@/api/NSYSUCourseAPI';
import { Course, AcademicYear } from '@/types';

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
      <div style={{ padding: '20px' }}>
        <Typography.Title level={2}>Course Viewer</Typography.Title>
        <Select
          defaultValue={semesters?.latest}
          style={{ width: 200, marginBottom: '20px' }}
          onChange={(value) => setSelectedSemester(value)}
        >
          {semesters && Object.entries(semesters.history).map(([year, label]) => (
            <Option key={year} value={year}>{label} ({year})</Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            if (selectedSemester) {
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
            }
          }}
          loading={loading}
        >
          Load Selected Semester Courses
        </Button>
        <Typography.Title level={3} style={{ marginTop: '20px' }}>Total: {courses.length}</Typography.Title>
        <List
          bordered
          dataSource={courses}
          renderItem={course => (
            <List.Item>
              <Typography.Text>{course.id} {course.name}</Typography.Text> - {course.teacher} ({course.credit} credits)
            </List.Item>
          )}
          style={{ marginTop: '20px' }}
        />
      </div>
    </ConfigProvider>
  );
};

export default App;
