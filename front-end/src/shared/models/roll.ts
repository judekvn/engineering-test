export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
}

export interface RollEntity {
  type: string;
  date: string;
  entity: Roll;
}

export interface RollInput {
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
}

export type RolllStateType = "unmark" | "present" | "absent" | "late"

export interface AttendanceCount {
  all: number;
  present: number;
  absent: number;
  late: number;
}
