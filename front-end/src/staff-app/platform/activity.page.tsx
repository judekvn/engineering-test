import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useApi } from "shared/hooks/use-api";
import { RollEntity } from "shared/models/roll"
import { BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollListTile } from "staff-app/components/roll-list-tile/roll-list-tile.component"

export const ActivityPage: React.FC = () => {
  // Api calls.
  const [getActivity, data, loadState] = useApi<{ activity: RollEntity[] }>({ url: "get-activities" })

  // Set Roll state.
  const [rollList, setRollList] = useState<RollEntity[]>()

  // Call activity api.
  useEffect(() => {
    void getActivity()
  }, [getActivity])

  // Set Roll list once we get the data.
  useEffect(() => {
    setRollList(data?.activity)
  }, [data]);

  return (
    <>
      <S.Container>
        <S.ToolbarContainer>
          Roll List
        </S.ToolbarContainer>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && rollList && (
          <>
            {rollList.map((s) => (
              <RollListTile key={s.entity.id} roll={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}

      </S.Container>
    </>
  )
}

const S = {
  Container: styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 16px auto 142px 230px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    line-height: 30px;
    font-size: 20px;
  `,
}
