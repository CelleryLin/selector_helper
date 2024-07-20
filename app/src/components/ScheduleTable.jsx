import { Component } from 'react';
import styled from 'styled-components';

import CourseBlock from './ScheduleTable/CourseBlock';

import { timeSlot, weekday } from '../config';

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
  // background-color: lightgray !important;
  opacity: 1; !important;
`;

const TimeSlotCell = styled.th`
  width: 4%;
  padding: 2px !important;
  font-weight: normal;
  // background-color: lightgray !important;
  opacity: 1; !important;
`;

// Cellery: 更改選取樣式
const SelectedTimeSlot = `
  // background-color: #e1e39f !important;
  -webkit-animation: pulse 800ms infinite alternate;
  animation: pulse 800ms infinite alternate;

  @-webkit-keyframes pulse {
    0% {  }
    20% { background-color: #e1e39f; }
    80% { background-color: #e1e39f; }
    100% {  }
  }
  @keyframes pulse {
    0% {  }
    20% { background-color: #e1e39f; }
    80% { background-color: #e1e39f; }
    100% {  }
  }
`

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

class ScheduleTable extends Component {
  setting = {
    columns: weekday.length + 1,
    weekday: weekday,
    timeSlots: timeSlot,
  };

  /**
   * 建立課表
   * @returns {{}} 課表
   */
  createCourseTable = () => {
    const { selectedCourses } = this.props;
    const coursesTable = {};

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
   */
  toggleTimeSlotSelect = (weekday, timeSlot) => {
    const { currentTab, toggleSearchTimeSlot } = this.props;
    if (currentTab !== '課程偵探') return;

    toggleSearchTimeSlot({ weekday, timeSlot });
  };

  /**
   * 檢查時間區塊是否被選取
   * @returns {boolean}
   */
  isTimeSlotSelected = (weekday, timeSlot) => {
    const { currentTab, searchTimeSlot } = this.props;
    if (currentTab !== '課程偵探') return false;
    return searchTimeSlot.some(
      (slot) => slot.weekday === weekday && slot.timeSlot === timeSlot,
    );
  };

  render() {
    const { hoveredCourseId, onCourseHover, handleCourseSelect, currentTab } =
      this.props;
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
        <StyledTable className='table table-bordered border-white border-5 table-secondary text-center'>
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
