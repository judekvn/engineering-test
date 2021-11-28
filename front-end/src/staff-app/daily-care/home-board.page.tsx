import React, { useState, useEffect, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Switch } from '@material-ui/core';
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [sortOrder, setSortOrder] = useState<string>('asc')
  const [sortName, setSortName] = useState<string>('first_name')
  const [searchName, setSearchName] = useState<string>('')

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
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

        {loadState === "loaded" && data?.students && (
          <>
            {data.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
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
  const { onItemClick, setSortOrder, sortOrder, searchName, setSearchName } = props

  return (
    <S.ToolbarContainer>
      <S.NameContainer>
        <S.ArrowButton onClick={() => sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc")}>
          <FontAwesomeIcon icon={sortOrder === "asc" ? faArrowDown : faArrowUp} />
        </S.ArrowButton>
        <S.ToolbarName> Name </S.ToolbarName>
        <S.SwitchContainer>
          <span>First Name</span>
          <Switch
            checked={sortByFirstName}
            onChange={() => sortByFirstName ? setSortByFirstName(false) : setSortByFirstName(true)}
            name="sortByName"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <span>Last Name</span>
        </S.SwitchContainer>
      </S.NameContainer>
      <S.InputContainer placeholder="Search" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
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
