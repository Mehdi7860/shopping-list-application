import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, ConfigProvider } from "antd";
import {
  FormCard,
  FormContainer,
  FormItemContainer,
  StyledInputNumber,
  CalendarContainer,
  DateInput,
  CalendarIcon,
  CalendarDropdown,
  AddButtonContainer,
  AddButtonIcon,
  AddButtonText,
} from "../../styles/StyledForm";
import { CalendarOutlined } from "@ant-design/icons";
import { Calendar } from "antd";
import { useTheme } from "../../ThemeProvider";
import { useShoppingList } from "../../context/ShoppingListContext";
import {
  FormValues,
  SubcategoriesMap,
  ItemData,
} from "../../types/ShoppingListForm.types";
import { Dayjs } from "dayjs";

const { Option } = Select;

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
      <FormCard $isDarkMode={isDarkMode}>
        <Form
          form={form}
          name="shopping_list_item"
          onFinish={onFinish}
          initialValues={{ date: selectedDate }}
          layout="horizontal"
        >
          <FormContainer>
            {/* Item Name */}
            <FormItemContainer $flex={1}>
              <Form.Item
                name="itemName"
                label="Add New Item"
                rules={[{ required: true, message: "Please enter item name" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Enter item name" />
              </Form.Item>
            </FormItemContainer>

            {/* Category */}
            <FormItemContainer $flex={1}>
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
            </FormItemContainer>

            {/* Subcategory */}
            <FormItemContainer $flex={1}>
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
            </FormItemContainer>

            {/* Quantity */}
            <FormItemContainer $flex={0.7}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please enter quantity" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <StyledInputNumber min={1} placeholder="0" />
              </Form.Item>
            </FormItemContainer>

            {/* Price */}
            <FormItemContainer $flex={0.7}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please enter price" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <StyledInputNumber
                  min={0.01}
                  step={0.01}
                  precision={2}
                  placeholder="0.00"
                  addonAfter="$"
                />
              </Form.Item>
            </FormItemContainer>

            {/* Custom Date Input */}
            <FormItemContainer $flex={0.8}>
              <Form.Item
                name="date"
                label="Date"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <CalendarContainer>
                  <DateInput
                    value={selectedDate}
                    placeholder="YYYY-MM-DD"
                    readOnly
                    onClick={() => setShowCalendar(!showCalendar)}
                    suffix={
                      <CalendarIcon
                        onClick={() => setShowCalendar(!showCalendar)}
                      >
                        <CalendarOutlined style={{ fontSize: 18 }} />
                      </CalendarIcon>
                    }
                  />
                  {showCalendar && (
                    <CalendarDropdown ref={calendarRef}>
                      <Calendar
                        fullscreen={false}
                        onSelect={handleDateSelect}
                      />
                    </CalendarDropdown>
                  )}
                </CalendarContainer>
              </Form.Item>
            </FormItemContainer>

            {/* Add Item Button */}
            <AddButtonContainer>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <AddButtonIcon>+</AddButtonIcon>{" "}
                  <AddButtonText>Add Item</AddButtonText>
                </Button>
              </Form.Item>
            </AddButtonContainer>
          </FormContainer>
        </Form>
      </FormCard>
    </ConfigProvider>
  );
};

export default ShoppingListForm;
