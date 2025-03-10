export interface HighestCostItem {
    price: number;
    name: string;
    qty: number;
  }
  
  export interface SalesReportChartProps {
    visible: boolean;
    onClose: () => void;
  }
  
  export interface CategoryData {
    [key: string]: {
      [key: string]: number;
    };
  }
  
  export interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderRadius: number;
      fontFamily: string;
      fontWeight: string;
      fontSize: string;
      lineHeight: string;
    }[];
  }
  