import { getTimeDeals } from "@/api/counter";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface TimeDeal {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  image: string;
}

const TimeDeals = () => {
  const getTimeSlot = (): { currentSlot: string; nextSlot: string } => {
    const now = new Date();
    const hour = now.getHours();

    const slots = [
      "오전 7시",
      "오전 8시",
      "오전 9시",
      "오전 10시",
      "오전 11시",
      "오후 12시",
      "오후 1시",
      "오후 2시",
      "오후 3시",
      "오후 4시",
      "오후 5시",
      "오후 6시",
      "오후 7시",
      "오후 8시",
      "오후 9시",
      "오후 10시",
      "오후 11시",
    ];

    const currentIndex = hour - 7;
    const nextIndex = (currentIndex + 1) % slots.length;

    const currentSlot = slots[currentIndex];
    const nextSlot = slots[nextIndex];

    return { currentSlot, nextSlot };
  };

  const { currentSlot, nextSlot } = getTimeSlot();
  console.log("currentSlot", currentSlot);

  const [currentDeals, setCurrentDeals] = useState<TimeDeal[]>([]);
  const [nextDeals, setNextDeals] = useState<TimeDeal[]>([]);
  const [isLastPageCurrent, setIsLastPageCurrent] = useState<boolean>(false);
  const [isLastPageNext, setIsLastPageNext] = useState<boolean>(false);
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [pageNext, setPageNext] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"current" | "next">("current");
  const [error, setError] = useState<boolean>(false);

  const fetchDeals = async (tab: "current" | "next", page: number) => {
    try {
      const result = await getTimeDeals(tab, page);

      if (tab === "current") {
        setCurrentDeals((prev) => [...prev, ...result.itemList]);
        setIsLastPageCurrent(result.isLastPage);
      } else if (tab === "next") {
        setNextDeals((prev) => [...prev, ...result.itemList]);
        setIsLastPageNext(result.isLastPage);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    if (activeTab === "current" && currentDeals.length === 0) {
      fetchDeals("current", pageCurrent);
    } else if (activeTab === "next" && nextDeals.length === 0) {
      fetchDeals("next", pageNext);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreDeals();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, isLastPageCurrent, isLastPageNext]);

  const loadMoreDeals = () => {
    if (activeTab === "current" && !isLastPageCurrent) {
      const nextPage = pageCurrent + 1;
      setPageCurrent(nextPage);
      fetchDeals("current", nextPage);
    } else if (activeTab === "next" && !isLastPageNext) {
      const nextPage = pageNext + 1;
      setPageNext(nextPage);
      fetchDeals("next", nextPage);
    }
  };

  const handleTabSwitch = (tab: "current" | "next") => {
    setActiveTab(tab);
  };

  return (
    <Container>
      {error && (
        <ErrorOverlay>
          에러가 발생했습니다.
          <ErrorButton onClick={() => location.reload()}>새로고침</ErrorButton>
        </ErrorOverlay>
      )}
      {currentSlot !== "오후 10시" &&
        currentSlot !== "오후 11시" &&
        currentSlot !== undefined && (
          <Tabs>
            <Tab
              active={activeTab === "current"}
              onClick={() => handleTabSwitch("current")}
            >
              {currentSlot}
            </Tab>
            <Tab
              active={activeTab === "next"}
              onClick={() => handleTabSwitch("next")}
            >
              {nextSlot}
            </Tab>
          </Tabs>
        )}

      {currentSlot === "오후 10시" && (
        <Title color="#000">11시에 끝나는 오늘의 마지막 타임특가!</Title>
      )}
      {(currentSlot === "오후 11시" || currentSlot === undefined) && (
        <Title color="#000"> 7시에 시작되는 오늘의 타임특가!</Title>
      )}

      <DealList>
        {(activeTab === "current" ? currentDeals : nextDeals).map((deal) => (
          <DealCard key={deal.id} onClick={() => alert("준비중입니다.")}>
            <DealImageBlock>
              {(!currentSlot ||
                currentSlot === undefined ||
                activeTab !== "current") && (
                <OpenSchedule>오픈예정</OpenSchedule>
              )}
              <DealImage src={deal.image} alt={deal.title} />
            </DealImageBlock>
            <DealInfo>
              <ProductTitle>{deal.title}</ProductTitle>
              <PriceWrapper>
                <OriginalPrice>
                  {deal.originalPrice.toLocaleString()}원
                </OriginalPrice>

                <DiscountedPrice>
                  <DiscountRate>{deal.discountRate}%</DiscountRate>
                  {deal.discountedPrice.toLocaleString()}원
                </DiscountedPrice>
              </PriceWrapper>
            </DealInfo>
          </DealCard>
        ))}
      </DealList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eeeff3;
  justify-content: space-around;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid ${(p) => (p.active ? "#000" : "none")};
  font-weight: ${(p) => (p.active ? "700" : "500")};
  font-size: 16px;
  line-height: 140%;
  letter-spacing: -0.2px;
`;

const DealList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px 16px;
  gap: 12px 0;
`;

const DealCard = styled.div`
  width: calc(50% - 4px);
  overflow: hidden;
  cursor: pointer;
`;

const DealImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const ProductTitle = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: keep-all;
`;

const DealInfo = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OriginalPrice = styled.div`
  color: #bcbdc3;
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;
  text-decoration: line-through;
`;

const DiscountedPrice = styled.div`
  display: flex;
  gap: 2px;
  font-size: 16px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.6px;
`;

const DiscountRate = styled.div`
  color: #f8323e;
`;

const DealImageBlock = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eeeff3;
`;

const ErrorOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;

  font-size: 18px;
  z-index: 9999;
`;

const ErrorButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
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

const OpenSchedule = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;

  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.2px;
`;

export default TimeDeals;
