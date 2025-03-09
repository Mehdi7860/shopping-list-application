import React, { useEffect, useState } from "react";
import { Modal, Card, Row, Col, Typography } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useShoppingList } from "../../context/ShoppingListContext";
import { useTheme } from "../../ThemeProvider";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HighestCostItem {
  price: number;
  name: string;
  qty: number;
}

interface SalesReportChartProps {
  visible: boolean;
  onClose: () => void;
}

const SalesReportChart: React.FC<SalesReportChartProps> = ({
  visible,
  onClose,
}) => {
  const { shoppingList } = useShoppingList(); // Get shopping list from context
  const [chartData, setChartData] = useState<any>(null); // Chart data
  const [totalSpending, setTotalSpending] = useState(0);
  const [highestCostItem, setHighestCostItem] =
    useState<HighestCostItem | null>(null);
  const [averageCost, setAverageCost] = useState(0);

  const { isDarkMode } = useTheme();

  useEffect(() => {
    let total = 0;
    let highest: HighestCostItem = { price: 0, name: "", qty: 0 };
    let totalItems = 0;
    let totalPrice = 0;
    let totalItemsInList = 0;

    shoppingList.forEach((item) => {
      const totalPriceForItem = item.price * item.qty;
      total += totalPriceForItem;
      totalItems += item.qty;
      totalPrice += item.price;
      totalItemsInList += 1;

      if (item.price > highest.price) {
        highest = { price: item.price, name: item.name, qty: item.qty };
      }
    });

    const avgCost = totalItemsInList ? totalPrice / totalItemsInList : 0;

    setTotalSpending(total);
    setHighestCostItem(highest);
    setAverageCost(avgCost);

    const categoryData: { [key: string]: { [key: string]: number } } = {};

    shoppingList.forEach((item) => {
      const totalPriceForItem = item.price * item.qty;
      if (!categoryData[item.category]) {
        categoryData[item.category] = {};
      }
      if (categoryData[item.category][item.subcategory]) {
        categoryData[item.category][item.subcategory] += totalPriceForItem;
      } else {
        categoryData[item.category][item.subcategory] = totalPriceForItem;
      }
    });

    const chartLabels: string[] = [];
    const chartValues: number[] = [];
    const categoryStartIndex: { [key: string]: number } = {};

    // First, push all categories to the chart
    Object.keys(categoryData).forEach((category, idx) => {
      chartLabels.push(category);
      categoryStartIndex[category] = chartLabels.length - 1;
    });

    // Then, push all subcategories
    Object.keys(categoryData).forEach((category) => {
      Object.keys(categoryData[category]).forEach((subcategory) => {
        chartLabels.push(subcategory);
        chartValues.push(categoryData[category][subcategory]);
      });
    });

    // Push category values into the chart
    Object.keys(categoryData).forEach((category) => {
      const subcategoryValues = Object.values(categoryData[category]);
      chartValues.push(subcategoryValues.reduce((a, b) => a + b, 0));
    });

    // Set the chart data
    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: "Total Spending",
          data: chartValues,
          backgroundColor: "#91CAFF",
          borderRadius: 4,
          fontFamily: "Lato",
          fontWeight: "400",
          fontSize: "12px",
          lineHeight: "20px",
        },
      ],
    });
  }, [shoppingList]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          maxRotation: 90,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${value}`,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Modal
      title={
        <span
          style={{
            fontFamily: "Lato",
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          Report
        </span>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      {/* Report Cards Section */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <Card
            style={{
              border: isDarkMode ? "1px solid #333333" : "1px solid #D9D9D9",
            }}
          >
            <Typography.Title
              level={3}
              style={{
                color: isDarkMode ? "#D9D9D9" : "#000000",
                fontFamily: "Lato",
                fontWeight: "600",
                fontSize: "16px",
                lineHeight: "24px",
                marginTop: 0,
              }}
            >
              Total Spending
            </Typography.Title>
            <Typography.Title
              level={3}
              style={{
                color: "#1677FF",
                fontFamily: "Proxima Nova Bold",
                fontSize: "20px",
                lineHeight: "28px",
                marginTop: 0,
                marginBottom: "24px",
              }}
            >
              ${totalSpending.toFixed(2)}
            </Typography.Title>
            <Typography.Text
              style={{
                fontFamily: "Lato",
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "22px",
                color: "#808080",
              }}
            >
              {shoppingList.length} items in total
            </Typography.Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              border: isDarkMode ? "1px solid #333333" : "1px solid #D9D9D9",
            }}
          >
            <Typography.Title
              level={3}
              style={{
                color: isDarkMode ? "#D9D9D9" : "#000000",
                fontFamily: "Lato",
                fontWeight: "600",
                fontSize: "16px",
                lineHeight: "24px",
                marginTop: 0,
              }}
            >
              Highest Cost Item
            </Typography.Title>
            <Typography.Title
              level={3}
              style={{
                color: "#1677FF",
                fontFamily: "Proxima Nova Bold",
                fontSize: "20px",
                lineHeight: "28px",
                marginTop: 0,
                marginBottom: "24px",
              }}
            >
              ${highestCostItem?.price.toFixed(2)}
            </Typography.Title>
            <Typography.Text
              style={{
                fontFamily: "Lato",
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "22px",
                color: "#808080",
              }}
            >
              {highestCostItem?.name} ({highestCostItem?.qty} unit)
            </Typography.Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              border: isDarkMode ? "1px solid #333333" : "1px solid #D9D9D9",
            }}
          >
            <Typography.Title
              level={3}
              style={{
                color: isDarkMode ? "#D9D9D9" : "#000000",
                fontFamily: "Lato",
                fontWeight: "600",
                fontSize: "16px",
                lineHeight: "24px",
                marginTop: 0,
              }}
            >
              Average Cost
            </Typography.Title>
            <Typography.Title
              level={3}
              style={{
                color: "#1677FF",
                fontFamily: "Proxima Nova Bold",
                fontSize: "20px",
                lineHeight: "28px",
                marginTop: 0,
                marginBottom: "24px",
              }}
            >
              ${averageCost.toFixed(2)}
            </Typography.Title>
            <Typography.Text
              style={{
                color: "#808080",
                fontFamily: "Lato",
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "22px",
              }}
            >
              Per Item
            </Typography.Text>
          </Card>
        </Col>
      </Row>

      {/* Chart Section */}
      <Typography.Title
        level={2}
        style={{
          fontFamily: "Lato",
          fontWeight: "700",
          fontSize: "20px",
          lineHeight: "28px",
          marginTop: "32px",
        }}
      >
        Sales Report
      </Typography.Title>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </Modal>
  );
};

export default SalesReportChart;
