import { getBrandDeals } from "@/api/counter";
import { Header } from "@/components";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

interface BrandDeal {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  stockPercentage: number;
  image: string;
  discountEndDate: string;
}

interface BrandDealsResponse {
  itemList: BrandDeal[];
  isLastPage: boolean;
}

const BrandDeals = () => {
  const location = useLocation();
  const [brandDeals, setBrandDeals] = useState<BrandDeal[]>(
    location.state?.previousDeals || []
  );
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchBrandDeals = async (page: number) => {
    try {
      setIsFetching(true);
      const result = (await getBrandDeals(page)) as BrandDealsResponse;
      setBrandDeals((prev) => [...prev, ...result.itemList]);
      setIsLastPage(result.isLastPage);
    } catch (err) {
      console.error("err", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (brandDeals.length === 0 || page > 1) {
      fetchBrandDeals(page);
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        !isLastPage &&
        !isFetching
      ) {
        loadMoreDeals();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLastPage, isFetching]);

  const loadMoreDeals = () => {
    if (!isFetching && !isLastPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Container>
      <Header title="오늘의 브랜드딜" isBackButtonVisible={true} />
      <DealsList>
        {brandDeals.map((deal) => (
          <DealCard key={deal.id}>
            <DealImage src={deal.image} alt={deal.title} />

            <DealInfo>
              <ProductTitle>{deal.title}</ProductTitle>

              <ProgressBarContainer>
                <ProgressBar width={deal.stockPercentage}></ProgressBar>
                <DiscountRate>{deal.discountRate}%</DiscountRate>
              </ProgressBarContainer>

              <PriceWrapper>
                <DiscountedPrice>
                  할인가 {deal.discountedPrice.toLocaleString()}원
                </DiscountedPrice>
                <OriginalPrice>
                  곧 정상가 {deal.originalPrice.toLocaleString()}원 으로
                  돌아갑니다
                </OriginalPrice>
              </PriceWrapper>
            </DealInfo>
          </DealCard>
        ))}
      </DealsList>
    </Container>
  );
};

const progressAnimation = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

const Container = styled.div``;

const DealsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 16px;
`;

const DealCard = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  overflow: hidden;
  position: relative;
`;

const DealImage = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover;
  border: 1px solid #eeeff3;
  border-radius: 8px;
`;

const DealInfo = styled.div`
  width: 100%;
  padding: 12px;
`;

const ProductTitle = styled.div`
  width: 100%;
  margin-top: 12px;
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
  flex-direction: column;
  margin-bottom: 8px;
`;

const OriginalPrice = styled.div`
  color: #bcbdc3;

  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.2px;
`;

const DiscountedPrice = styled.div`
  color: #f8323e;
  font-size: 16px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.2px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  position: relative;
  height: 16px;
  background: #ffa98e;
  border-radius: 8px;
  overflow: hidden;
  margin: 8px 0 12px;
`;

const ProgressBar = styled.div<{ width?: number }>`
  max-width: ${(p) => p.width && `${p.width}%`};
  height: 100%;
  background: #ff6231;

  animation: ${progressAnimation} 1.5s ease-in;
  border-radius: 8px;
`;

const DiscountRate = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.2px;
`;

export default BrandDeals;
