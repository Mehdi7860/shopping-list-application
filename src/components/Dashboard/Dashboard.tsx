import React, { useState } from "react";
import { Button, Layout, Switch } from "antd";
import { useTheme } from "../../ThemeProvider";
import ShoppingListForm from "../ShopingListForm/ShoppingListForm";
import ShoppingListTable from "../ShoppingListTable/ShoppingListTable";
import SalesReportChart from "../SalesReportChart/SalesReportChart";
import { StyledLayout } from "../../styles/StyledLayout";

const { Header, Content } = Layout;

const Dashboard: React.FC = () => {
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

export default Dashboard;
