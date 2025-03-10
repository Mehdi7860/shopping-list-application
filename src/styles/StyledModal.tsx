import styled from "styled-components";
import { Card, Typography } from "antd";

export const ReportCard = styled(Card)<{ $isDarkMode: boolean }>`
  border: ${(props) =>
    props.$isDarkMode ? "1px solid #333333" : "1px solid #D9D9D9"};
`;

export const CardTitle = styled(Typography.Title)<{ $isDarkMode: boolean }>`
  color: ${(props) => (props.$isDarkMode ? "#D9D9D9" : "#000000")};
  font-family: Lato;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-top: 0;
`;

export const CardValue = styled(Typography.Title)`
  color: #1677ff !important;
  font-family: Proxima Nova Bold;
  font-size: 20px;
  line-height: 28px;
  margin-top: 0 !important;
  margin-bottom: 24px !important;
`;

export const CardDescription = styled(Typography.Text)`
  font-family: Lato;
  font-weight: 400;
  font-size: 14px !important;
  line-height: 22px !important;
  color: #808080;
`;

export const SectionTitle = styled(Typography.Title)`
  font-family: Lato;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  margin-top: 32px;
`;

export const ModalTitle = styled.span`
  font-family: Lato;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;
