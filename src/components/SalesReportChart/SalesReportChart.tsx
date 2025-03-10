import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "antd";
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
import {
  ReportCard,
  CardTitle,
  CardValue,
  CardDescription,
  SectionTitle,
  ModalTitle,
} from "../../styles/StyledModal";
import {
  HighestCostItem,
  SalesReportChartProps,
  ChartData,
  CategoryData,
} from "../../types/SalesReportChart.types";
import { useShoppingList } from "../../context/ShoppingListContext";
import { useTheme } from "../../ThemeProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesReportChart: React.FC<SalesReportChartProps> = ({
  visible,
  onClose,
}) => {
  const { shoppingList } = useShoppingList(); // Get shopping list from context
  const [chartData, setChartData] = useState<ChartData | null>(null); // Chart data
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

    const categoryData: CategoryData = {};

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
      title={<ModalTitle>Report</ModalTitle>}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      {/* Report Cards Section */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <ReportCard $isDarkMode={isDarkMode}>
            <CardTitle level={3} $isDarkMode={isDarkMode}>
              Total Spending
            </CardTitle>
            <CardValue level={3}>${totalSpending.toFixed(2)}</CardValue>
            <CardDescription>
              {shoppingList.length} items in total
            </CardDescription>
          </ReportCard>
        </Col>
        <Col span={8}>
          <ReportCard $isDarkMode={isDarkMode}>
            <CardTitle level={3} $isDarkMode={isDarkMode}>
              Highest Cost Item
            </CardTitle>
            <CardValue level={3}>
              ${highestCostItem?.price.toFixed(2)}
            </CardValue>
            <CardDescription>
              {highestCostItem?.name} ({highestCostItem?.qty} unit)
            </CardDescription>
          </ReportCard>
        </Col>
        <Col span={8}>
          <ReportCard $isDarkMode={isDarkMode}>
            <CardTitle level={3} $isDarkMode={isDarkMode}>
              Average Cost
            </CardTitle>
            <CardValue level={3}>${averageCost.toFixed(2)}</CardValue>
            <CardDescription>Per Item</CardDescription>
          </ReportCard>
        </Col>
      </Row>

      {/* Chart Section */}
      <SectionTitle level={2}>Sales Report</SectionTitle>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </Modal>
  );
};

export default SalesReportChart;
