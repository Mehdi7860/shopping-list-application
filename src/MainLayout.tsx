import React, { useState } from "react";
import { Button, Layout, Switch } from "antd";
import { useTheme } from "./ThemeProvider";
import styled from "styled-components";
import ShoppingListForm from "./components/ShopingListForm/ShoppingListForm";
import ShoppingListTable from "./components/ShoppingListTable/ShoppingListTable";
import SalesReportChart from "./components/SalesReportChart/SalesReportChart";

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)<{ $theme: "light" | "dark" }>`
  min-height: 100vh;
  background: ${(props) => (props.$theme === "dark" ? "#141414" : "#f0f2f5")};

  .ant-layout-header {
    background: #202020;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 24px;
  }

  .shopping-list-header {
    background: ${(props) => (props.$theme === "dark" ? "#141414" : "#ffffff")};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid
      ${(props) => (props.$theme === "dark" ? "#202020" : "#EAECF0")};
  }

  .view-report-button {
    margin-left: auto;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .view-report-btn {
    font-family: Lato;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
  }

  .view-report-btn:hover {
    background-color: transparent !important;
    color: ${(props) => (props.$theme === "dark" ? "#ffffff" : "#202020")};
    border-color: ${(props) =>
      props.$theme === "dark" ? "#ffffff" : "#202020"};
    cursor: pointer;
  }

  .export-btn:hover {
    background-color: transparent !important;
    color: ${(props) => (props.$theme === "dark" ? "#ffffff" : "#202020")};
    border-color: ${(props) =>
      props.$theme === "dark" ? "#ffffff" : "#202020"};
    cursor: pointer;
  }

  .export-btn {
    font-family: Lato;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
  }

  .ant-layout-footer {
    background: ${(props) => (props.$theme === "dark" ? "#1f1f1f" : "#f0f2f5")};
    color: ${(props) =>
      props.$theme === "dark"
        ? "rgba(255, 255, 255, 0.65)"
        : "rgba(0, 0, 0, 0.45)"};
    padding: 16px;
  }

  .app-logo {
    height: 40px;
    margin-right: 16px;
  }

  .bars {
    height: 16px;
    width: 16px;
    filter: ${(props) =>
      props.$theme === "dark"
        ? "invert(100%) brightness(2)"
        : "invert(0%) brightness(1)"};
  }

  .theme-toggle {
    margin-left: auto;
    display: flex;
    align-items: center;
    font-family: Inter;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
  }

  .theme-toggle .anticon {
    margin-right: 8px;
    font-size: 16px;
    color: #ffffff;
  }

  .theme-toggle .ant-switch {
    background-color: #e2e2e240;
  }

  .theme-toggle .ant-switch-checked {
    background-color: #1890ff;
  }

  .theme-toggle .ant-switch-checked .ant-switch-handle {
    background-color: #ffffff;
    border-radius: 50%;
  }

  .theme-label {
    margin-right: 8px;
    color: #ffffff;
  }

  .table-header {
    font-family: Lato;
    font-size: 14px;
    line-height: 22px;
    font-weight: 700;
  }

  .ant-table-row-hover-light:hover {
    background-color: #f2f9ff !important;
  }
  .ant-table-row-hover-light {
    font-family: Lato;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
  }

  .ant-table-row-hover-dark:hover {
    background-color: #777777 !important;
  }

  .ant-table-row-hover-dark {
    font-family: Lato;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
  }

  .ant-card-body {
    padding: 0px;
  }

  .hidden-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .hidden-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

.shopping-list-table .ant-table-thead > tr > th:first-child {
  border-top-left-radius: 0 !important;
}

.shopping-list-table .ant-table-thead > tr > th:last-child {
  border-top-right-radius: 0 !important;
}
`;

const MainLayout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <StyledLayout $theme={isDarkMode ? "dark" : "light"}>
      <Header>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.svg" alt="App Logo" className="app-logo" />
        </div>
        <div className="theme-toggle">
          <span className="theme-label">Dark Mode</span>
          <Switch checked={isDarkMode} onChange={toggleTheme} />
        </div>
      </Header>

      <div className="shopping-list-header">
        <h2
          style={{
            color: isDarkMode ? "#fff" : "#101828",
            margin: 0,
            display: "flex",
            fontFamily: "Proxima Nova Bold",
            fontSize: "20px",
            lineHeight: "28px",
          }}
        >
          <img
            src="/cart.svg"
            alt="Cart Logo"
            className="cart-logo"
            style={{ marginRight: "8px" }}
          />
          Shopping List Application
        </h2>
        <div className="view-report-button">
          <Button className="view-report-btn" onClick={showModal}>
            <img src="/bars.svg" alt="bars" className="bars" /> View Report
          </Button>
        </div>
      </div>

      <Content>
        <div>
          <ShoppingListForm />
        </div>
        <div
          style={{
            background: isDarkMode ? "#1f1f1f" : "#fff",
          }}
        >
          <ShoppingListTable onFilterChange={() => {}} />
        </div>
      </Content>

      <SalesReportChart visible={isModalVisible} onClose={handleCancel} />
    </StyledLayout>
  );
};

export default MainLayout;
