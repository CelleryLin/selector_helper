import { Course, NSYSUCourse } from '@/types';

/**
 * Map the new API format to the old API format.
 * @param newApi The new API course format
 * @returns The old API course format
 */
export const mapNewApiToOldApiFormat = (newApi: NSYSUCourse): Course => {
  return {
    Change: newApi.change || '',
    Description: newApi.changeDescription || '',
    MultipleCompulsory: newApi.multipleCompulsory ? '是' : '',
    Department: newApi.department,
    Number: newApi.id,
    Grade: newApi.grade,
    Class: ['不分班', '全英班', '甲班', '乙班'].includes(newApi.class || '')
      ? (newApi.class as '不分班' | '全英班' | '甲班' | '乙班')
      : '不分班',
    Name: newApi.name.split('\n')[0],
    Url: newApi.url,
    Credit: newApi.credit,
    YearSemester: newApi.yearSemester,
    CompulsoryElective: newApi.compulsory ? '必' : '選',
    Restrict: newApi.restrict.toString(),
    Select: newApi.select.toString(),
    Selected: newApi.selected.toString(),
    Remaining: newApi.remaining.toString(),
    Teacher: newApi.teacher,
    Room: newApi.room,
    Monday: newApi.classTime[0],
    Tuesday: newApi.classTime[1],
    Wednesday: newApi.classTime[2],
    Thursday: newApi.classTime[3],
    Friday: newApi.classTime[4],
    Saturday: newApi.classTime[5],
    Sunday: newApi.classTime[6],
    Context: newApi.description,
    Programs: newApi.tags.join(', '),
    EMI: newApi.english ? '1' : '0',
  };
};

/**
 * Old API Sample
 *
 * {
 *     "Change": "新增",
 *     "Description": "7/15",
 *     "MultipleCompulsory": "",
 *     "Department": "中學學程",
 *     "Number": "STP101",
 *     "Grade": "0",
 *     "Class": "不分班",
 *     "Name": "教育心理學",
 *     "Url": "https://selcrs.nsysu.edu.tw/menu5/showoutline.asp?SYEAR=113&SEM=1&CrsDat=STP101&Crsname=教育心理學",
 *     "Credit": "2",
 *     "YearSemester": "期",
 *     "CompulsoryElective": "選",
 *     "Restrict": "50",
 *     "Select": "6",
 *     "Selected": "37",
 *     "Remaining": "13",
 *     "Teacher": "馮雅群",
 *     "Room": "三5,6(社SS 2001)",
 *     "Monday": "",
 *     "Tuesday": "",
 *     "Wednesday": "56",
 *     "Thursday": "",
 *     "Friday": "",
 *     "Saturday": "",
 *     "Sunday": "",
 *     "Context": "《講授類》本課程為教育學程課程",
 *     "Programs": "",
 *     "EMI": "0"
 * }
 */

/**
 * New API Sample
 *
 * {
 *   "url": "https://selcrs.nsysu.edu.tw/menu5/showoutline.asp?SYEAR=113&SEM=1&CrsDat=STP101&Crsname=教育心理學",
 *   "change": "新增",
 *   "changeDescription": "7/15",
 *   "multipleCompulsory": false,
 *   "department": "中學學程",
 *   "id": "STP101",
 *   "grade": "0",
 *   "class": "不分班",
 *   "name": "教育心理學\nEDUCATIONAL PSYCHOLOGY",
 *   "credit": "2",
 *   "yearSemester": "期",
 *   "compulsory": false,
 *   "restrict": 50,
 *   "select": 0,
 *   "selected": 37,
 *   "remaining": 13,
 *   "teacher": "馮雅群",
 *   "room": "三5,6(社SS 2001)",
 *   "classTime": [
 *     "",
 *     "",
 *     "56",
 *     "",
 *     "",
 *     "",
 *     ""
 *   ],
 *   "description": "《講授類》\n本課程為教育學程課程",
 *   "tags": [],
 *   "english": false
 * }
 */
