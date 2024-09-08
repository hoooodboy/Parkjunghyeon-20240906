import styled from "styled-components";

interface Deal {
  discountRate: number;
  discountedPrice: number;
  id: number;
  image: string;
  originalPrice: number;
  title: string;
}

interface LureDealCardProps {
  lureDeal: Deal;
}

const LureDealCard = ({ lureDeal }: LureDealCardProps) => {
  return (
    <CardBlock onClick={() => alert("준비중입니다.")}>
      <Img src={lureDeal.image} />
      <InfoWrapper>
        <ProductTitle>{lureDeal.title}</ProductTitle>
        <PriceWrapper>
          <DiscountRate>{lureDeal.discountRate}%</DiscountRate>
          {lureDeal.discountedPrice.toLocaleString()}원
        </PriceWrapper>
      </InfoWrapper>
    </CardBlock>
  );
};

const CardBlock = styled.div`
  min-width: 146px;
  height: 227px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
`;

const Img = styled.img`
  width: 146px;
  height: 142px;
  object-fit: cover;
`;

const InfoWrapper = styled.div`
  padding: 9px 10px 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

export default LureDealCard;
