import styled from "styled-components";
import Loading from "./Loading";
import { Grid } from "@mui/material";
export const StyledLoading = styled(Loading)`
  position: fixed;
  z-index: 4;
`;
export const StyledDiv = styled.div`
  height: ${(props) => props.heightContainer};
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
`;
export const StyledGrid = styled(Grid)`
  position: fixed;
  z-index: 4;
`;
