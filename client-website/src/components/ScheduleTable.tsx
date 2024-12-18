import { Component } from 'react';
import styled, { css } from 'styled-components';

import type { Course, TimeSlot, Weekday } from '@/types';
import CourseBlock from './ScheduleTable/CourseBlock';
import { TIMESLOT, WEEKDAY } from '../config';

const StyledTableContainer = styled.div`
  border-radius: 0.375rem;
`;

const StyledTableContainerDetectiveMode = styled(StyledTableContainer)`
  cursor: zoom-in;
`;

const StyledTable = styled.table`
  font-size: 10px;
  width: 100%;
`;

const HeaderCell = styled.th`
  font-weight: normal;
  padding: 2px !important;
  opacity: 1 !important;
`;

const TimeSlotCell = styled.th`
  width: 4%;
  padding: 2px !important;
  font-weight: normal;
  opacity: 1 !important;
`;

// Cellery: 更改選取樣式
const SelectedTimeSlot = css`
  background-color: #e1e39f !important;
  opacity: 1 !important;
`;

const CourseCell = styled.td`
  width: 12.5%;
  padding: 2px !important;
  opacity: 0.8;

  &.selected-time-slot {
    ${SelectedTimeSlot}
  }
`;

const CourseCellDetectiveMode = styled(CourseCell)`
  &:hover {
    opacity: 1;
  }
`;

interface ScheduleTableProps {
  selectedCourses: Set<Course>;
  currentTab: string;
  handleCourseSelect: (course: Course, isSelected: boolean) => void;
  hoveredCourseId: string | null;
  onCourseHover: (courseId: string | null) => void;
  searchTimeSlot: TimeSlot[];
  toggleSearchTimeSlot: (timeSlot: TimeSlot) => void;
  onCourseClick: (course: Course) => void; // New prop for handling course click
}

class ScheduleTable extends Component<ScheduleTableProps> {
  setting = {
    columns: WEEKDAY.length + 1,
    weekday: WEEKDAY,
    timeSlots: TIMESLOT,
  };

  /**
   * 建立課表
   * @returns {{}} 課表
   */
  createCourseTable = (): {
    [key: string]: Course[];
  } => {
    const { selectedCourses } = this.props;
    const coursesTable: { [key: string]: Course[] } = {};

    this.setting.timeSlots.forEach((timeSlot) => {
      this.setting.weekday.forEach((weekday) => {
        coursesTable[`${weekday.key}-${timeSlot.key}`] = [];

        Array.from(selectedCourses).forEach((course) => {
          if (
            course[weekday.key] &&
            course[weekday.key].includes(timeSlot.key)
          ) {
            coursesTable[`${weekday.key}-${timeSlot.key}`].push(course);
          }
        });
      });
    });

    return coursesTable;
  };

  /**
   * 切換課程時間區塊選取狀態
   * @param {string} weekday 星期
   * @param {string} timeSlot 節次
   */
  toggleTimeSlotSelect = (weekday: Weekday, timeSlot: string) => {
    const { currentTab, toggleSearchTimeSlot } = this.props;
    if (currentTab !== '課程偵探') return;

    toggleSearchTimeSlot({ weekday, timeSlot });
  };

  /**
   * 檢查時間區塊是否被選取
   * @param {string} weekday 星期
   * @param {string} timeSlot 節次
   * @returns {boolean}
   */
  isTimeSlotSelected = (weekday: string, timeSlot: string): boolean => {
    const { currentTab, searchTimeSlot } = this.props;
    if (currentTab !== '課程偵探') return false;
    return searchTimeSlot.some(
      (slot) => slot.weekday === weekday && slot.timeSlot === timeSlot,
    );
  };

  render() {
    const {
      hoveredCourseId,
      onCourseHover,
      handleCourseSelect,
      currentTab,
      onCourseClick,
    } = this.props;
    const coursesTable = this.createCourseTable();

    const isAtCourseDetectiveTab = currentTab === '課程偵探';
    const TableContainerComponent = isAtCourseDetectiveTab
      ? StyledTableContainerDetectiveMode
      : StyledTableContainer;
    const CourseCellComponent = isAtCourseDetectiveTab
      ? CourseCellDetectiveMode
      : CourseCell;

    return (
      <TableContainerComponent className='table-responsive'>
        <StyledTable className='table table-bordered border-white border-5 table-secondary text-center mb-0'>
          <thead>
            <tr>
              <HeaderCell>期</HeaderCell>
              {this.setting.weekday.map((weekday, index) => (
                <HeaderCell
                  key={index}
                  style={{
                    backgroundColor:
                      weekday.key === 'Saturday' || weekday.key === 'Sunday'
                        ? '#dcdee3'
                        : '',
                  }}
                >
                  {weekday.value}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.setting.timeSlots.map((timeSlot, index) => (
              <tr key={index}>
                <TimeSlotCell>
                  <span className='d-block fw-bold'>{timeSlot.key}</span>
                  <span>{timeSlot.value}</span>
                </TimeSlotCell>
                {this.setting.weekday.map((weekday) => (
                  <CourseCellComponent
                    key={`${weekday.key}-${timeSlot.key}`}
                    className={
                      this.isTimeSlotSelected(weekday.key, timeSlot.key)
                        ? 'selected-time-slot'
                        : ''
                    }
                    style={{
                      backgroundColor:
                        weekday.key === 'Saturday' || weekday.key === 'Sunday'
                          ? '#dcdee3'
                          : '',
                    }}
                    onClick={() =>
                      this.toggleTimeSlotSelect(weekday.key, timeSlot.key)
                    }
                  >
                    {coursesTable[`${weekday.key}-${timeSlot.key}`].map(
                      (course, i) => (
                        <CourseBlock
                          key={i}
                          course={course}
                          handleCourseSelect={handleCourseSelect}
                          hoveredCourseId={hoveredCourseId}
                          onCourseHover={onCourseHover}
                          onCourseClick={onCourseClick}
                        />
                      ),
                    )}
                  </CourseCellComponent>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainerComponent>
    );
  }
}

export default ScheduleTable;
