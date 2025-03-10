import styled from "styled-components";
import { Card, InputNumber, Input } from "antd";

export const FormCard = styled(Card)<{ $isDarkMode: boolean }>`
  width: 100% !important;
  font-family: Lato !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  line-height: 22px !important;
  background: ${props => props.$isDarkMode ? "#202020" : "#f0f2f5"} !important;
  padding: 24px 32px 8px 32px !important;
`;

export const FormContainer = styled.div`
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 16px !important;
`;

export const FormItemContainer = styled.div<{ $flex?: number }>`
  min-width: ${props => props.$flex ? "auto" : "150px"} !important;
  flex: ${props => props.$flex || 1} !important;
`;

export const StyledInputNumber = styled(InputNumber)`
  width: 100% !important;
`;

export const CalendarContainer = styled.div`
  position: relative !important;
`;

export const DateInput = styled(Input)`
  cursor: pointer !important;
  width: 100% !important;
`;

export const CalendarIcon = styled.span`
  cursor: pointer !important;
`;

export const CalendarDropdown = styled.div`
  position: fixed !important;
  z-index: 1000 !important;
  background: #fff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 2px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
`;

export const AddButtonContainer = styled.div`
  display: flex !important;
  align-items: flex-end !important;
  min-width: 120px !important;
`;

export const AddButtonIcon = styled.span`
  font-size: 24px !important;
  margin-bottom: 8px !important;
`;

export const AddButtonText = styled.span`
  font-family: Lato !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  line-height: 24px !important;
`;
