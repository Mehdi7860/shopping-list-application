import styled from "styled-components";
import { Badge, Card, Typography, Space } from "antd";

export const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 0px !important;
  }
`;

export const ItemCountTitle = styled(Typography.Title)`
  font-family: Lato !important;
  font-weight: 700 !important;
  font-size: 20px !important;
  line-height: 28px !important;
  margin-bottom: 1em !important;
`;

export const FilterContainer = styled(Space)`
  font-family: Lato !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  line-height: 22px !important;
`;

export const FilterLabel = styled.div`
  margin-right: 8px !important;
`;

export const StyledBadge = styled(Badge)`
  .ant-badge-count {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
    box-shadow: 0 0 0 1px #e3eeff inset !important;
    font-size: 10px !important;
    font-family: Proxima Nova Bold !important;
    border-radius: 4px !important;
    border: 1px solid #e3eeff !important;
  }
`;


export const ItemName = styled.span`
  font-family: Lato !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  line-height: 24px !important;
`;

export const ScrollContainer = styled.div`
  height: 400px;
  overflow: auto;
  margin-bottom: 16px;
  -ms-overflow-style: none !important; /* IE and Edge */
  scrollbar-width: none !important; /* Firefox */
  
  &::-webkit-scrollbar {
    display: none !important; /* Chrome, Safari, Opera */
  }
`;

export const EndOfListMessage = styled.div`
  text-align: center;
  padding: 12px 0;
  color: #999;
  font-family: Lato !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  line-height: 22px !important;
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 12px 0;
`;
