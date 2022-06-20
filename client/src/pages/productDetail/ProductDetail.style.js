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
export const OptionActiveBg = styled.div`
  border: 1px solid #4f5155;
  text-align: center;
  padding: 0.5rem 1rem;
  display: inline;
  border-radius: 0.5rem;
  margin-right: 1rem;
  cursor: pointer;
  color: #e5e5e5;
  background-color: rgb(26, 26, 26);
`;
export const OptionValue = styled.p`
  text-transform: uppercase;
  display: inline-block;
`;
