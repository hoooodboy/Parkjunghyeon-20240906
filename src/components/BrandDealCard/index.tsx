import { useEffect, useState } from "react";
import styled from "styled-components";

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

interface BrandDealCardProps {
  brandDeal: Deal;
}

const BrandDealCard = ({ brandDeal }: BrandDealCardProps) => {
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    const calculateRemainingTime = () => {
      if (!brandDeal.discountEndDate) return;

      const endDate = new Date(brandDeal.discountEndDate).getTime();
      const now = new Date().getTime();
      const timeDiff = endDate - now;

      if (timeDiff <= 0) {
        setRemainingTime("할인 종료");
        return;
      }

      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setRemainingTime(
        `${hours > 0 ? hours + "시간" : ""} ${
          minutes > 0 ? minutes + "분" : ""
        } ${seconds > 0 ? seconds + "초" : ""} `
      );
    };

    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [brandDeal.discountEndDate]);

  return (
    <CardBlock onClick={() => alert("준비중입니다.")}>
      <Img src={brandDeal.image} />
      <Timer>{remainingTime}</Timer>
      <InfoWrapper>
        <ProductTitle>{brandDeal.title}</ProductTitle>
        <PriceWrapper>
          <DiscountRate>{brandDeal.discountRate}%</DiscountRate>
          {brandDeal.discountedPrice.toLocaleString()}원
        </PriceWrapper>
      </InfoWrapper>
    </CardBlock>
  );
};

const CardBlock = styled.div`
  min-width: 120px;
  height: 227px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
`;

const Img = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 1px solid #eeeff3;
  border-radius: 8px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 2px;
`;

const ProductTitle = styled.div`
  width: 100%;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: keep-all;
`;

const PriceWrapper = styled.div`
  display: flex;
  gap: 4px;

  font-size: 16px;
  font-weight: 700;
  line-height: 140%; /* 22.4px */
  letter-spacing: -0.2px;
`;

const DiscountRate = styled.div`
  color: #f8323e;
`;

const Timer = styled.div`
  width: fit-content;
  padding: 2px 4px;
  border-radius: 4px;
  background: #ffedee;
  margin-top: 6px;
  color: #f8323e;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.2px;
`;

export default BrandDealCard;
