import React, { useState, useEffect } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Person } from "shared/models/person"
interface Props {
  initialState?: string
  size?: number
  onStateChange?: (newState: RolllStateType) => void;
  attendance?: string;
  setStudentList?: any
  studentId: number | string;
  studentsArray?: Person[]
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, attendance, setStudentList, studentId, studentsArray }) => {
  // Mark attendance for each student state.
  const [rollState, setRollState] = useState(initialState);

  useEffect(() => {
    const rollState = attendance ? attendance : 'unmark';
    setRollState(rollState);
  }, [attendance])

  // Change attendance in student list.
  const changeStudentAttendance = (studentState: string) => {
    let updatedList = studentsArray && studentsArray.length > 0 && studentsArray.map(item => {
      if (item.id === studentId) {
        return { ...item, attendance: studentState };
      }
      return item;
    });

    setStudentList(updatedList);
  }

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  // Mark attendance on click.
  const onClick = () => {
    const next = nextState()
    changeStudentAttendance(next)
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
