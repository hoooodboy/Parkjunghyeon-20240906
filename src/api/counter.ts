import api from ".";
import axios from "axios";

interface Deal {
  discountRate: number;
  discountedPrice: number;
  id: number;
  image: string;
  originalPrice: number;
  title: string;
  discountEndDate?: string;
  stockPercentage?: number;
}

interface BrandDealResponse {
  itemList: Deal[];
  isLastPage: boolean;
}

interface TimeDeal {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  image: string;
}

interface TimeDealResponse {
  itemList: TimeDeal[];
  isLastPage: boolean;
}

export const getLureDeals = async (): Promise<Deal[]> => {
  try {
    const { data } = await api.get<Deal[]>("/deals/lure-deal");
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw new Error("Failed to fetch deals. Please try again later.");
  }
};

export const getBrandDeals = async (
  page: number
): Promise<BrandDealResponse> => {
  try {
    const { data } = await api.get<BrandDealResponse>(
      `/deals/brand-deal?page=${page}`
    );
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw new Error("Failed to fetch brand deals. Please try again later.");
  }
};

export const getTimeDeals = async (
  time: "current" | "next",
  page: number
): Promise<TimeDealResponse> => {
  try {
    const { data } = await axios.get<TimeDealResponse>(
      `https://assignment-front.ilevit.com/deals/time-deal`,
      {
        params: { time, page },
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch time deals:", error);
    throw new Error("Failed to fetch time deals.");
  }
};
