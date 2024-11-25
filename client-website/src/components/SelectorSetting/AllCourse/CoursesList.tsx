import React, { Component, createRef } from 'react';
import { Card } from 'react-bootstrap';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import type { Course } from '@/types';
import Header from './AllCourseList/Header';
import Item from './AllCourseList/Item';

interface CoursesListProps {
  isCollapsed: boolean;
  courses: Course[];
  displaySelectedOnly: boolean;
  selectedCourses: Set<Course>;
  displayConflictCourses: boolean;
  detectTimeConflict: (course: Course, selectedCourses: Set<Course>) => boolean;
  onCourseSelect: (course: Course, isSelected: boolean) => void;
  onCourseHover: (courseId: string | null) => void;
  hoveredCourseId: string | null;
  clickedCourseId: string | null;
}

class CoursesList extends Component<CoursesListProps> {
  private virtuosoRef = createRef<VirtuosoHandle>();

  componentDidUpdate(prevProps: Readonly<CoursesListProps>) {
    if (
      prevProps.clickedCourseId !== this.props.clickedCourseId &&
      this.props.clickedCourseId
    ) {
      const course = this.props.courses.find(
        (c) => c['Number'] === this.props.clickedCourseId,
      );
      if (course) {
        this.scrollToCourse(course);
      }
    }
  }

  /**
   * 渲染列表項目
   * @param {number} index
   * @returns {React.ReactNode}
   */
  renderItem = (index: number): React.ReactNode => {
    if (index === 0) {
      return <Header />;
    }

    const {
      courses,
      displaySelectedOnly,
      selectedCourses,
      displayConflictCourses,
      detectTimeConflict,
      onCourseSelect,
      onCourseHover,
      hoveredCourseId,
      isCollapsed,
    } = this.props;

    // 由於頂部有一個固定項目，所以所有後續項目的索引都要向前移動一位
    const course = courses[index - 1];

    // 如果課程不存在，則不渲染該課程，動態篩選時可能會發生
    if (!course) return null;

    const isSelected = selectedCourses.has(course);
    const isHovered = hoveredCourseId === course['Number'];
    let isConflict = false;

    // 如果設定為僅顯示已選擇的課程，且當前課程未被選擇，則不渲染該課程
    if (displaySelectedOnly && !isSelected) {
      return null;
    }

    // 如果設定為顯示包含衝堂課程，則計算該課程是否衝堂
    if (displayConflictCourses) {
      isConflict = detectTimeConflict(course, selectedCourses);
    }

    // 渲染課程項目
    return (
      <Item
        isCollapsed={isCollapsed}
        course={course}
        isSelected={isSelected}
        isConflict={isConflict}
        isHovered={isHovered}
        onCourseSelect={onCourseSelect}
        onCourseHover={onCourseHover}
      />
    );
  };

  /**
   * 滾動到特定課程
   * @param {Course} course - 要滾動到的課程
   */
  scrollToCourse = (course: Course) => {
    if (this.virtuosoRef.current) {
      const courseIndex = this.props.courses.findIndex(
        (c) => c['Number'] === course['Number'],
      );
      if (courseIndex !== -1) {
        // Add 1 to account for the header
        this.virtuosoRef.current.scrollToIndex(courseIndex + 1);
      }
    }
  };

  render() {
    const { courses } = this.props;

    if (courses.length === 0) {
      return (
        <>
          <Header />
          <Card.Text className='text-center p-5'>
            沒有符合篩選條件的課程
          </Card.Text>
        </>
      );
    }

    const dataWithHeader = [{}, ...courses];

    return (
      <Virtuoso
        ref={this.virtuosoRef}
        data={dataWithHeader}
        itemContent={this.renderItem}
        topItemCount={1}
      />
    );
  }
}

export default CoursesList;
