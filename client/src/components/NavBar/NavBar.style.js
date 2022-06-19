import styled from "styled-components";
import { Grid } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

import { Link } from "react-router-dom";
export const NavbarWrapper = styled(Grid)`
  background-color: #0d0d0d;
  position: fixed;
  z-index: 3;
  width: 100%;
`;

export const NavbarLogo = styled.img`
  width: 60%;
`;

export const Cart = styled.div`
  display: grid;
  place-items: center;
  background-color: brown;
  border-radius: 50%;
  color: white;
  width: 1.3rem;
  height: 1.3rem;
  z-index: 2;
  position: relative;
  right: 5px;
`;
export const Bg = styled.div`
  height: 2.5rem;
  position: relative;
  width: 2.5rem;
  background-color: #2f3033;
  border-radius: 50%;
  &:hover {
    background-color: #4f5155;
  }
`;
export const Quantity = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
`;

export const StyledShoppingBagOutlinedIcon = styled(ShoppingBagOutlinedIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
export const StyledPersonOutlineOutlinedIcon = styled(
  PersonOutlineOutlinedIcon
)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
export const StyledSearchIcon = styled(SearchIcon)`
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
export const StyledCloseIcon = styled(CloseIcon)`
  color: white;
`;
export const CategoryNavLink = styled(Link)`
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: ${(props) => props.backgroundColor};
  &:hover {
    background-color: #2f3033;
  }
`;
export const SearchInput = styled.input`
  padding: 0rem 2rem;
  background-color: transparent;
  width: 100%;
  border: none;
  color: white;
  transition: all 1s;
`;
export const StyledMenuIcon = styled(MenuIcon)`
  color: white;
`;
export const Space = styled.div`
  @media (max-width: 349.99px) {
    padding-top: 4.5rem;
  }
  @media (min-width: 350px) and (max-width: 575.99px) {
    padding-top: 4.5rem;
  }
  @media (min-width: 576px) and (max-width: 767.98px) {
    padding-top: 2.5rem;
  }
  @media (min-width: 768px) and (max-width: 991.98px) {
    padding-top: 2.5rem;
  }
  @media (min-width: 992px) and (max-width: 1340.98px) {
    padding-top: 2.5rem;
  }
  @media (min-width: 1341px) and (max-width: 1999px) {
    padding-top: 2.5rem;
  }
  @media (min-width: 2000px) and (max-width: 2505px) {
    padding-top: 3.5rem;
  }
  @media (min-width: 2506px) {
    padding-top: 3.5rem;
  }
`;
