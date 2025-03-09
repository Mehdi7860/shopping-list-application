import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Card,
  ConfigProvider,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { Calendar } from "antd";
import { useTheme } from "../../ThemeProvider";
import { useShoppingList } from "../../context/ShoppingListContext";
import { ItemData } from "../../types/itemData";
import { Dayjs } from "dayjs";

const { Option } = Select;

interface FormValues {
  itemName: string;
  category: string;
  subcategory: string;
  quantity: number;
  price: number;
  date: string;
}

interface SubcategoriesMap {
  [key: string]: string[];
}

const ShoppingListForm: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoriesMap>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { isDarkMode } = useTheme();
  const { addItem } = useShoppingList();
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const mockCategories: string[] = [
      "Dairy",
      "Vegetables",
      "Meat",
      "Snacks",
      "Beverages",
    ];
    const mockSubcategories: SubcategoriesMap = {
      Dairy: ["Milk", "Cheese", "Yogurt", "Butter", "Cream"],
      Vegetables: [
        "Leafy Greens",
        "Root Vegetables",
        "Peppers",
        "Tomatoes",
        "Onions",
      ],
      Meat: ["Chicken", "Beef", "Pork", "Fish", "Lamb"],
      Snacks: ["Chips", "Nuts", "Chocolate", "Crackers", "Cookies"],
      Beverages: ["Water", "Soda", "Juice", "Coffee", "Tea"],
    };

    setCategories(mockCategories);
    setSubcategories(mockSubcategories);
  }, []);

  useEffect(() => {
    form.setFieldsValue({ date: selectedDate });
  }, [selectedDate, form]);

  const handleCategoryChange = (value: string): void => {
    setSelectedCategory(value);
    form.setFieldsValue({ subcategory: undefined });
  };

  const onFinish = (values: FormValues): void => {
    const newItem: ItemData = {
      name: values.itemName,
      category: values.category,
      subcategory: values.subcategory || "",
      qty: values.quantity,
      price: values.price,
      date: values.date,
    };

    addItem(newItem);
    form.resetFields();
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const handleDateSelect = (date: Dayjs): void => {
    const dateString = date.format("YYYY-MM-DD");
    setSelectedDate(dateString);
    setShowCalendar(false);
  };

  return (
    <ConfigProvider form={{ requiredMark: false }}>
      <Card
        style={{
          width: "100%",
          fontFamily: "Lato",
          fontWeight: "700",
          fontSize: "14px",
          lineHeight: "22px",
          background: isDarkMode ? "#202020" : "#f0f2f5",
          padding: "24px 32px 8px 32px",
        }}
      >
        <Form
          form={form}
          name="shopping_list_item"
          onFinish={onFinish}
          initialValues={{ date: selectedDate }}
          layout="horizontal"
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {/* Item Name */}
            <div style={{ minWidth: "200px", flex: 1 }}>
              <Form.Item
                name="itemName"
                label="Add New Item"
                rules={[{ required: true, message: "Please enter item name" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Enter item name" />
              </Form.Item>
            </div>

            {/* Category */}
            <div style={{ minWidth: "150px", flex: 1 }}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Select placeholder="Select" onChange={handleCategoryChange}>
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Subcategory*/}
            <div style={{ minWidth: "150px", flex: 1 }}>
              <Form.Item
                name="subcategory"
                label="Subcategory"
                rules={[
                  { required: false, message: "Please select subcategory" },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Select placeholder="Select" disabled={!selectedCategory}>
                  {selectedCategory &&
                    subcategories[selectedCategory]?.map((subcat) => (
                      <Option key={subcat} value={subcat}>
                        {subcat}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>

            {/* Quantity */}
            <div style={{ minWidth: "120px", flex: 0.7 }}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please enter quantity" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <InputNumber
                  min={1}
                  placeholder="0"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            {/* Price */}
            <div style={{ minWidth: "120px", flex: 0.7 }}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please enter price" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  precision={2}
                  placeholder="0.00"
                  style={{ width: "100%" }}
                  addonAfter="$"
                />
              </Form.Item>
            </div>

            {/* Custom Date Input */}
            <div style={{ minWidth: "150px", flex: 0.8 }}>
              <Form.Item
                name="date"
                label="Date"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <div style={{ position: "relative" }}>
                  <Input
                    value={selectedDate}
                    placeholder="YYYY-MM-DD"
                    readOnly
                    onClick={() => setShowCalendar(!showCalendar)}
                    style={{ cursor: "pointer", width: "100%" }}
                    suffix={
                      <span
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{ cursor: "pointer" }}
                      >
                        <CalendarOutlined style={{ fontSize: 18 }} />
                      </span>
                    }
                  />
                  {showCalendar && (
                    <div
                      ref={calendarRef}
                      style={{
                        position: "fixed",
                        zIndex: 1000,
                        background: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "2px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <Calendar
                        fullscreen={false}
                        onSelect={handleDateSelect}
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </div>

            {/* Add Item Button */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                minWidth: "120px",
              }}
            >
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <span style={{ fontSize: "24px", marginBottom: "8px" }}>
                    +
                  </span>{" "}
                  <span
                    style={{
                      fontFamily: "Lato",
                      fontWeight: "700",
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  >
                    Add Item
                  </span>
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default ShoppingListForm;
