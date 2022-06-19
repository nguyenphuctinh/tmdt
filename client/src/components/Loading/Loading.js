import React from "react";
import { Oval } from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Grid } from "@mui/material";
import { StyledDiv, StyledGrid } from "./Loading.style";

export default function Loading({
  height = 100,
  width = 100,
  heightContainer = "100vh",
}) {
  return (
    <StyledGrid container>
      <Grid>
        <StyledDiv heightContainer={heightContainer}>
          <Oval
            ariaLabel="loading-indicator"
            height={height}
            width={width}
            strokeWidth={3}
            color="gray"
            secondaryColor="black"
          />
        </StyledDiv>
      </Grid>
    </StyledGrid>
  );
}
