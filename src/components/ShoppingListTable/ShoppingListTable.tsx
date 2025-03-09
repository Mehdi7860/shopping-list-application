import React, { useState, useEffect, useRef, CSSProperties } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Card,
  ConfigProvider,
  Button,
  Badge,
  TableProps,
  Spin,
} from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { useShoppingList } from "../../context/ShoppingListContext";
import type { SorterResult } from "antd/es/table/interface";
import { useTheme } from "../../ThemeProvider";

// Helper function to calculate total price
const calculateTotalPrice = (quantity: number, price: number) =>
  quantity * price;

// Helper function to check if a date is today
const isToday = (dateString: string) => {
  const today = new Date();
  const itemDate = new Date(dateString);

  return (
    itemDate.getDate() === today.getDate() &&
    itemDate.getMonth() === today.getMonth() &&
    itemDate.getFullYear() === today.getFullYear()
  );
};

// Updated interface to include the key property
interface ItemData {
  name: string;
  category: string;
  subcategory: string;
  qty: number;
  price: number;
  date: string;
  isNew?: boolean;
}

// Number of items to load at once
const PAGE_SIZE = 10;

const ShoppingListTable: React.FC<{
  onFilterChange: (filters: {
    category?: string;
    subcategory?: string;
    searchText?: string;
  }) => void;
}> = ({ onFilterChange }) => {
  const { shoppingList } = useShoppingList(); // Assuming the shopping list comes from context
  const [filteredData, setFilteredData] = useState<ItemData[]>([]);
  const [displayedData, setDisplayedData] = useState<ItemData[]>([]);
  const [categories] = useState<string[]>([
    "Dairy",
    "Vegetables",
    "Meat",
    "Bakery",
    "Fruits",
    "Grains",
  ]);
  const [subcategories] = useState<string[]>([
    "Milk",
    "Cheese",
    "Yogurt",
    "Eggs",
    "Bread",
    "Tomatoes",
    "Chicken",
    "Rice",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | undefined
  >(undefined);
  const [searchText, setSearchText] = useState<string>("");
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Default sort by date (newest first)
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ItemData>>({
    columnKey: "date",
    order: "descend",
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filtered = [...shoppingList]; // Create a copy to avoid modifying the original

    // Apply filters
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (selectedSubcategory) {
      filtered = filtered.filter(
        (item) => item.subcategory === selectedSubcategory
      );
    }
    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort by date (newest first) by default
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Add unique keys for each item if not already present
    const dataWithKeys = filtered.map((item, index) => ({
      ...item,
      key: `${index}-${item.name}`,
    }));

    setFilteredData(dataWithKeys);
    // Reset pagination when filters change
    setCurrentPage(1);
    setHasMore(dataWithKeys.length > PAGE_SIZE);
    setDisplayedData(dataWithKeys.slice(0, PAGE_SIZE));

    onFilterChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      searchText,
    });
  }, [
    selectedCategory,
    selectedSubcategory,
    searchText,
    shoppingList,
    onFilterChange,
  ]);

  // Load more data when scrolling
  const loadMoreData = () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newItems = filteredData.slice(0, nextPage * PAGE_SIZE);

      setDisplayedData(newItems);
      setCurrentPage(nextPage);
      setHasMore(newItems.length < filteredData.length);
      setLoading(false);
    }, 300);
  };

  // Handle scroll event
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    // Load more when user scrolls to the bottom (with a small threshold)
    if (scrollHeight - scrollTop - clientHeight < 50 && !loading && hasMore) {
      loadMoreData();
    }
  };

  // Handle table change for sorting
  const handleTableChange: TableProps<ItemData>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(sorterResult as SorterResult<ItemData>);
  };

  // Render item name with a badge if it was added today
  const renderItemNameWithBadge = (name: string, date: string) => {
    if (isToday(date)) {
      return (
        <Space
          style={{
            fontFamily: "Lato",
            fontWeight: "700",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          {name}
          <Badge
            count="New"
            style={{
              backgroundColor: "#e6f7ff",
              color: "#1890ff",
              boxShadow: "0 0 0 1px #E3EEFF inset",
              fontSize: "10px",
              fontFamily: "Proxima Nova Bold",
              borderRadius: "4px",
              border: "1px solid #E3EEFF",
            }}
          />
        </Space>
      );
    }
    return (
      <span
        style={{
          fontFamily: "Lato",
          fontWeight: "700",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        {name}
      </span>
    );
  };

  // Table columns configuration
  const columns = [
    {
      title: <span className="table-header">Item Name</span>,
      dataIndex: "name",
      key: "name",
      sorter: (a: ItemData, b: ItemData) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      render: (text: string, record: ItemData) =>
        renderItemNameWithBadge(text, record.date),
    },
    {
      title: <span className="table-header">Category</span>,
      dataIndex: "category",
      key: "category",
      sorter: (a: ItemData, b: ItemData) =>
        a.category.localeCompare(b.category),
      sortOrder: sortedInfo.columnKey === "category" ? sortedInfo.order : null,
    },
    {
      title: <span className="table-header">Subcategory</span>,
      dataIndex: "subcategory",
      key: "subcategory",
      sorter: (a: ItemData, b: ItemData) =>
        a.subcategory.localeCompare(b.subcategory),
      sortOrder:
        sortedInfo.columnKey === "subcategory" ? sortedInfo.order : null,
    },
    {
      title: <span className="table-header">Quantity</span>,
      dataIndex: "qty",
      key: "qty",
      sorter: (a: ItemData, b: ItemData) => a.qty - b.qty,
      sortOrder: sortedInfo.columnKey === "qty" ? sortedInfo.order : null,
    },
    {
      title: <span className="table-header">Price</span>,
      dataIndex: "price",
      key: "price",
      sorter: (a: ItemData, b: ItemData) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
    },
    {
      title: <span className="table-header">Total Price</span>,
      key: "totalPrice",
      sorter: (a: ItemData, b: ItemData) =>
        calculateTotalPrice(a.qty, a.price) -
        calculateTotalPrice(b.qty, b.price),
      sortOrder:
        sortedInfo.columnKey === "totalPrice" ? sortedInfo.order : null,
      render: (text: string, record: ItemData) =>
        calculateTotalPrice(record.qty, record.price),
    },
    {
      title: <span className="table-header">Date</span>,
      dataIndex: "date",
      key: "date",
      sorter: (a: ItemData, b: ItemData) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      sortOrder: sortedInfo.columnKey === "date" ? sortedInfo.order : null,
      defaultSortOrder: "descend" as const,
    },
  ];

  // Set row class for hover effect based on theme (light/dark)
  const rowClassName = () => {
    return isDarkMode
      ? "ant-table-row-hover-dark"
      : "ant-table-row-hover-light";
  };

  // CSS to hide scrollbar properly with TypeScript
  const scrollContainerStyle: CSSProperties = {
    height: "400px",
    overflow: "auto",
    marginBottom: "16px",
  };

  return (
    <ConfigProvider>
      <Card>
        {/* Filters */}
        <Row
          justify="space-between"
          align="middle"
          style={{ padding: "0 24px 0 24px" }}
        >
          <Col>
            <Typography.Title
              level={4}
              style={{
                fontFamily: "Lato",
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "28px",
                marginBottom: "1em",
              }}
            >
              {filteredData.length} items
            </Typography.Title>
          </Col>
          <Col>
            <Space
              style={{
                fontFamily: "Lato",
                fontWeight: "700",
                fontSize: "14px",
                lineHeight: "22px",
              }}
            >
              <div style={{ marginRight: 8 }}>Filter By</div>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Select Category"
                style={{ width: 150 }}
                allowClear
              >
                {categories.map((category) => (
                  <Select.Option key={category} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
              <Select
                value={selectedSubcategory}
                onChange={setSelectedSubcategory}
                placeholder="Select Subcategory"
                style={{ width: 150 }}
                disabled={!selectedCategory}
                allowClear
              >
                {subcategories.map((subcategory) => (
                  <Select.Option key={subcategory} value={subcategory}>
                    {subcategory}
                  </Select.Option>
                ))}
              </Select>
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                prefix={<SearchOutlined style={{ marginRight: "8px" }} />}
                style={{ width: 200 }}
              />
              <CSVLink data={filteredData} filename="shopping_list.csv">
                <Button icon={<ExportOutlined />} className="export-btn">
                  Export Data
                </Button>
              </CSVLink>
            </Space>
          </Col>
        </Row>
        {/* Table with scroll container with hidden scrollbar using className */}
        <div
          ref={scrollContainerRef}
          style={scrollContainerStyle}
          className="hidden-scrollbar"
          onScroll={handleScroll}
        >
          <Table
          className="shopping-list-table"
            columns={columns}
            dataSource={displayedData}
            pagination={false} // No pagination
            rowClassName={rowClassName} // Apply rowClassName based on theme
            style={{ marginBottom: "0" }}
            onChange={handleTableChange}
            scroll={{ x: true }} // Allow horizontal scrolling if needed
          />
          {loading && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <Spin />
            </div>
          )}
          {!hasMore && displayedData.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "12px 0",
                color: "#999",
                fontFamily: "Lato",
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "22px",
              }}
            >
              End of List
            </div>
          )}
        </div>
      </Card>
    </ConfigProvider>
  );
};

export default ShoppingListTable;
