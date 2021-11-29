import React from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { RollEntity } from "shared/models/roll"

interface Props {
  roll: RollEntity;
}
export const RollListTile: React.FC<Props> = ({ roll }) => {
  const date = roll.date.slice(0, 10);
  return (
    <S.Container>
      <S.Content>
        <S.RollContainer><span>{roll.entity.id}. {roll.entity.name}</span><span>Completed - {date}</span></S.RollContainer>
      </S.Content>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
  margin-top: ${Spacing.u3};
  padding-right: ${Spacing.u2};
  display: flex;
  align-items: center;
  height: 60px;
  border-radius: ${BorderRadius.default};
  background-color: #fff;
  box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
  }
  `,

  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
  Roll: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u4};
  `,
  RollContainer: styled.div`
  display: flex;
  justify-content: space-between;
  `

}
