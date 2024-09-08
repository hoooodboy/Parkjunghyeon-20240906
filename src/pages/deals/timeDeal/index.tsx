import { BrandDealCard, Header, LureDealCard, TimeDeals } from "@/components";
import { webPath } from "@/router";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { getBrandDeals, getLureDeals } from "@/api/counter";
import styled from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";

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

const TimeDeal = () => {
  const navigate = useNavigate();
  const [lureDeals, setLureDeals] = useState<Deal[]>([]);
  const [brandDeals, setBrandDeals] = useState<Deal[]>([]);

  const handleClickGoToBrandDeal = () => {
    navigate(webPath.brandDeal(), {
      state: {
        previousDeals: brandDeals,
      },
    });
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const result = await getLureDeals();
        setLureDeals(result);
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchDeals();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const result: BrandDealResponse = await getBrandDeals(1);
        setBrandDeals(result.itemList);
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchDeals();
  }, []);

  console.log("brandDeals", brandDeals);
  console.log("deals", lureDeals);

  return (
    <div>
      <Header title="타임특가" isBackButtonVisible={false} />
      {lureDeals.length > 0 && (
        <CardContainer bg="#ff6231">
          <Title color="#fff">오늘만 이가격, 순삭 특가</Title>
          <ScrollContainer>
            <CardWrapper>
              {lureDeals.map((lureDeal) => (
                <LureDealCard lureDeal={lureDeal} key={lureDeal.id} />
              ))}
            </CardWrapper>
          </ScrollContainer>
        </CardContainer>
      )}

      {brandDeals.length > 0 && (
        <CardContainer bg="#fff">
          <Title color="#000">
            오늘의 브랜드 딜
            <ShowAll onClick={handleClickGoToBrandDeal}>전체보기</ShowAll>
          </Title>
          <ScrollContainer>
            <CardWrapper>
              {brandDeals.map((brandDeal) => (
                <BrandDealCard brandDeal={brandDeal} key={brandDeal.id} />
              ))}
            </CardWrapper>
          </ScrollContainer>
        </CardContainer>
      )}

      <Sectoin>
        <TimeDeals />
      </Sectoin>
    </div>
  );
};

const Sectoin = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardContainer = styled.div<{ bg?: string }>`
  display: flex;
  flex-direction: column;
  background: ${(p) => (p.bg ? p.bg : "#fff")};
  padding-bottom: 32px;
`;

const Title = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 10px 16px;
  color: ${(p) => (p.color ? p.color : "#000")};
  font-size: 20px;
  font-weight: 700;
  line-height: 130%;
  letter-spacing: -0.2px;
`;

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 0 16px;
`;

const ShowAll = styled.div`
  cursor: pointer;

  color: #9c9da4;
  font-size: 14px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.2px;
`;

export default TimeDeal;
