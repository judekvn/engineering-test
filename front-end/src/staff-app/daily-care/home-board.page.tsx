import React, { useState, useEffect, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { AttendanceCount } from "shared/models/roll"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Switch } from '@material-ui/core';
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import {  useNavigate } from "react-router-dom";

export const HomeBoardPage: React.FC = () => {
  // Api calls.
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRoll] = useApi<{ students: Person[] }>({ url: "save-roll" })
  
  // Student list state.
  const [studentList, setStudentList] = useState<Person[]>();

  // Search and sort state.
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [sortName, setSortName] = useState<string>('first_name');
  const [searchName, setSearchName] = useState<string>('');

  // Roll mode and Attendance filter and counter state.
  const [isRollMode, setIsRollMode] = useState<boolean>(false)
  const [attendanceCount, setAttendanceCount] = useState<AttendanceCount>({ all: 0, present: 0, absent: 0, late: 0 });
  const [attendanceFilter, setAttendanceFilter] = useState<string>('all');

  let navigate = useNavigate();

  
  // Call students api function.
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  // Set student list once we get the data.
  useEffect(() => {
    if (data && data.students) {
      setStudentList(data.students)
    }
  }, [data]);

  // Set attendance count on Roll mode.
  useEffect(() => {
    if (studentList && studentList.length > 0) {
      const presentStudent: number = studentList.filter((item) => item.attendance === 'present').length;
      const lateStudent: number = studentList.filter((item) => item.attendance === 'late').length;
      const absentStudent: number = studentList.filter((item) => item.attendance === 'absent').length;
      const all: number = studentList.length;

      setAttendanceCount({ all: all, present: presentStudent, late: lateStudent, absent: absentStudent })
    }

  }, [studentList])

  //Enable roll mode.
  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  // Roll mode action items(exit, complete).
  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
      setAttendanceFilter('all')
      setStudentList(data?.students);
    } else {
      const student_roll_states = studentList?.map((item) => {
        return {
          student_id: item.id,
          roll_state: item.attendance ? item.attendance : 'unmark'
        }
      })

      saveRoll({ student_roll_states })
      navigate('/staff/activity')
    }
  }

  // Sort the student list alphabetically and first_name or last_name basis.
  const sortByOrderAndName = (studentA: Person, studentB: Person) => {
    if (sortOrder === 'asc' && (sortName === 'first_name' || sortName === 'last_name')) {
      return studentA[sortName].toLowerCase() > studentB[sortName].toLowerCase()
        ? 1 : -1;
    } else {
      return ((sortName === 'first_name' || sortName === 'last_name')
        &&
        studentA[sortName].toLowerCase() < studentB[sortName].toLowerCase())
        ? 1 : -1;
    }

  }

  // Search by name.
  const sortBySearchName = (student: Person) => {
    if ((student.first_name + ' ' + student.last_name).toLowerCase().includes(searchName.toLowerCase())) {
      return true
    }
  }

  // Filter students list by attendance selected on roll on mode.
  const filterByAttendance = (student: Person) => {

    if (attendanceFilter === 'present' && student.attendance === 'present') {
      return true;
    } else if (attendanceFilter === 'absent' && student.attendance === 'absent') {
      return true;
    } else if (attendanceFilter === 'late' && student.attendance === 'late') {
      return true;
    } else if (attendanceFilter === 'all') {
      return true;
    }
  }


  // Call search,filter,sort function on student list.
  let studentsArray = studentList;
  studentsArray = studentsArray?.sort((a, b) => sortByOrderAndName(a, b));
  studentsArray = studentsArray?.filter(student => sortBySearchName(student));

  if (isRollMode) {
    studentsArray = studentsArray?.filter(student => filterByAttendance(student));
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortName={sortName}
          setSortName={setSortName}
          searchName={searchName}
          setSearchName={setSearchName}

        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentsArray && (
          <>
            {studentsArray.map((s, index) => (
              <StudentListTile
                key={s.id}
                isRollMode={isRollMode}
                student={s}
                setStudentList={setStudentList}
                studentsArray={studentsArray} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
        attendanceCount={attendanceCount}
        setAttendanceFilter={setAttendanceFilter}
        studentList={studentList} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void;
  sortOrder: string;
  setSortOrder: Dispatch<SetStateAction<string>>;
  sortName: string;
  setSortName: Dispatch<SetStateAction<string>>;
  searchName: string;
  setSearchName: Dispatch<SetStateAction<string>>;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const [sortByFirstName, setSortByFirstName] = useState(false)
  const { onItemClick, setSortOrder, sortOrder, searchName, setSearchName, setSortName } = props

  // Switch handler between names.
  const nameSwitchHandle = () => {
    if (sortByFirstName) {
      setSortByFirstName(false);
      setSortName('first_name');
    } else {
      setSortByFirstName(true);
      setSortName('last_name');
    }
  }

  return (
    <S.ToolbarContainer>
      <S.NameContainer>
        <S.ArrowButton onClick={() => sortOrder === 'asc' ? setSortOrder('desc') : setSortOrder('asc')}>
          <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowDown : faArrowUp} />
        </S.ArrowButton>
        <S.ToolbarName> Name </S.ToolbarName>
        <S.SwitchContainer>
          <span>First Name</span>
          <Switch
            checked={sortByFirstName}
            onChange={() => nameSwitchHandle()}
            name='sortByName'
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <span>Last Name</span>
        </S.SwitchContainer>
      </S.NameContainer>
      <S.InputContainer placeholder='Search' value={searchName} onChange={(e) => setSearchName(e.target.value)} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  InputContainer: styled.input`
  background-color: ${Colors.neutral.lighter};
  border: transparent;
  font-size: 15px;
  border-radius: 5px;
  padding 10px;
  outline: none;
  `,
  ArrowButton: styled.a`
  text-decoration: none;
  cursor: pointer;
  `,
  ToolbarName: styled.span`
  margin: 0 10px;
  `,
  SwitchContainer: styled.div`
  font-size: 12px;
  margin-left: 30px
  `,
  NameContainer: styled.div`
  min-width: 220px;
  text-align: justify;
  font-size: 15px;
  `,

}
