import styled from "styled-components";
export const ProductName = styled.p`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
`;
export const ProductPrice = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  margin-right: 5px;
`;
export const SaledProductPrice = styled.p`
  font-size: 1rem;
  margin: 0;
  display: block;
  text-decoration-line: line-through;
  font-weight: 400;
`;
export const OptionBg = styled.div`
  border: 1px solid #4f5155;
  text-align: center;
  padding: 0.5rem 1rem;
  display: inline;
  border-radius: 0.5rem;
  margin-right: 1rem;
  cursor: pointer;
`;
export const OptionActiveBg = styled(OptionBg)`
  color: #e5e5e5;
  background-color: rgb(26, 26, 26);
`;
export const OptionValue = styled.p`
  text-transform: uppercase;
  display: inline-block;
`;

export const OrderFormBg = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;
export const OrderFormContainer = styled.div`
  position: fixed;
  left: 50%;
  overflow-y: auto;
  height: 400px;
  transform: translate(-50%, 0);
  z-index: 3;
  @media (max-width: 575.99px) {
    width: 75%;
  }
  @media (min-width: 576px) {
    width: 50%;
  }
`;
