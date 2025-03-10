import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Row,
  Col,
  ConfigProvider,
  Button,
  TableProps,
  Spin,
} from "antd";
import {
  StyledCard,
  ItemCountTitle,
  FilterContainer,
  FilterLabel,
  StyledBadge,
  ItemName,
  ScrollContainer,
  EndOfListMessage,
  LoadingContainer,
} from "../../styles/StyledTable";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { useShoppingList } from "../../context/ShoppingListContext";
import type { SorterResult } from "antd/es/table/interface";
import { useTheme } from "../../ThemeProvider";
import { ItemData, FilterValues } from "../../types/ShoppingListTable.types";

const calculateTotalPrice = (quantity: number, price: number) =>
  quantity * price;

const isToday = (dateString: string) => {
  const today = new Date();
  const itemDate = new Date(dateString);

  return (
    itemDate.getDate() === today.getDate() &&
    itemDate.getMonth() === today.getMonth() &&
    itemDate.getFullYear() === today.getFullYear()
  );
};

const PAGE_SIZE = 10;

const ShoppingListTable: React.FC<{
  onFilterChange: (filters: FilterValues) => void;
}> = ({ onFilterChange }) => {
  const { shoppingList } = useShoppingList();
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

  // Default sort by date
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ItemData>>({
    columnKey: "date",
    order: "descend",
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filtered = [...shoppingList];

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

    // Sort by date
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const dataWithKeys = filtered.map((item, index) => ({
      ...item,
      key: `${index}-${item.name}`,
    }));

    setFilteredData(dataWithKeys);
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

  const loadMoreData = () => {
    if (loading || !hasMore) return;

    setLoading(true);

    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newItems = filteredData.slice(0, nextPage * PAGE_SIZE);

      setDisplayedData(newItems);
      setCurrentPage(nextPage);
      setHasMore(newItems.length < filteredData.length);
      setLoading(false);
    }, 300);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollHeight - scrollTop - clientHeight < 50 && !loading && hasMore) {
      loadMoreData();
    }
  };

  const handleTableChange: TableProps<ItemData>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(sorterResult as SorterResult<ItemData>);
  };

  const renderItemNameWithBadge = (name: string, date: string) => {
    if (isToday(date)) {
      return (
        <Space>
          <ItemName>{name}</ItemName>
          <StyledBadge count="New" />
        </Space>
      );
    }
    return <ItemName>{name}</ItemName>;
  };

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

  const rowClassName = () => {
    return isDarkMode
      ? "ant-table-row-hover-dark"
      : "ant-table-row-hover-light";
  };

  return (
    <ConfigProvider>
      <StyledCard>
        {/* Filters */}
        <Row
          justify="space-between"
          align="middle"
          style={{ padding: "0 24px 0 24px" }}
        >
          <Col>
            <ItemCountTitle level={4}>
              {filteredData.length} items
            </ItemCountTitle>
          </Col>
          <Col>
            <FilterContainer>
              <FilterLabel>Filter By</FilterLabel>
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
            </FilterContainer>
          </Col>
        </Row>
        <ScrollContainer ref={scrollContainerRef} onScroll={handleScroll}>
          <Table
            className="shopping-list-table"
            columns={columns}
            dataSource={displayedData}
            pagination={false}
            rowClassName={rowClassName}
            style={{ marginBottom: "0" }}
            onChange={handleTableChange}
            scroll={{ x: true }}
          />
          {loading && (
            <LoadingContainer>
              <Spin />
            </LoadingContainer>
          )}
          {!hasMore && displayedData.length > 0 && (
            <EndOfListMessage>End of List</EndOfListMessage>
          )}
        </ScrollContainer>
      </StyledCard>
    </ConfigProvider>
  );
};

export default ShoppingListTable;
