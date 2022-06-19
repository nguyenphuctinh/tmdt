import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/images/shop.jpg";
import { useNavigate } from "react-router-dom";
import { Divider, Drawer, Grid, IconButton, List } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronRight";

import {
  Bg,
  Cart,
  NavbarLogo,
  NavbarWrapper,
  Quantity,
  StyledShoppingBagOutlinedIcon,
  StyledPersonOutlineOutlinedIcon,
  StyledSearchIcon,
  StyledCloseIcon,
  CategoryNavLink,
  Space,
  SearchInput,
  StyledMenuIcon,
} from "./NavBar.style";

import { Box } from "@mui/system";
function NavBar() {
  const navbar = useSelector((state) => state.navbar);
  const cart = useSelector((state) => state.cart);
  const [finding, setFinding] = useState(false);
  const [finded, setFinded] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputEl = useRef(null);
  let user = useSelector((state) => state.user);

  useEffect(() => {
    if (finding && inputEl.current) inputEl.current.focus();
    if (!finding) inputEl.current.value = "";
  }, [finding, finded]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const q = event.target.value;
      setFinded(true);
      navigate({
        pathname: "/search",
        search: "?q=" + q,
      });
      setFinding(false);
    }
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <NavbarWrapper>
        <Grid container sx={{ display: { xs: "flex", md: "none" } }}>
          <Grid item xs={2}>
            <NavbarLogo src={logo} alt="logo" />
          </Grid>

          <Grid item xs={8}>
            <input type="text" />
          </Grid>
          <Grid justifyContent={"center"} display="flex" item xs={2}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              sx={{ ...(open && { display: "none" }) }}
            >
              <StyledMenuIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container sx={{ display: { xs: "none", md: "flex" } }}>
          <Grid
            item
            xs={5}
            alignItems={"center"}
            justifyContent={"space-between"}
            display={finding ? "flex" : "none"}
          >
            <Box display={finding ? "flex" : "none"}>
              <SearchInput
                onBlur={() => setFinding(false)}
                ref={inputEl}
                onKeyDown={handleKeyDown}
                id="search"
                autoComplete="off"
                type="search"
                placeholder="Bạn tìm gì..."
                aria-label="Search"
              />
              <StyledCloseIcon onClick={() => setFinding(false)} />
            </Box>
          </Grid>
          <Grid
            display={!finding ? "flex" : "none"}
            justifyContent="space-between "
            alignItems={"center"}
            item
            xs={5}
            px={2}
          >
            {!user.data || user.data.role !== "admin" ? (
              <>
                <CategoryNavLink
                  to="/category/phone"
                  backgroundColor={navbar.value === "phone" ? "#2f3033" : ""}
                >
                  Phone
                </CategoryNavLink>
                <CategoryNavLink
                  to="/category/laptop"
                  backgroundColor={navbar.value === "laptop" ? "#2f3033" : ""}
                >
                  Laptop
                </CategoryNavLink>
                <CategoryNavLink
                  to="/category/tablet"
                  backgroundColor={navbar.value === "tablet" ? "#2f3033" : ""}
                >
                  Tablet
                </CategoryNavLink>
                <CategoryNavLink
                  to="/category/watch"
                  backgroundColor={navbar.value === "watch" ? "#2f3033" : ""}
                >
                  Watch
                </CategoryNavLink>
              </>
            ) : (
              <CategoryNavLink
                to="/admin?tab=product"
                backgroundColor={navbar.value === "admin" ? "#2f3033" : ""}
              >
                Admin
              </CategoryNavLink>
            )}
          </Grid>
          <Grid item xs={4} alignItems="center">
            <div onClick={() => setFinding(false)}>
              <Link to="/">
                <NavbarLogo src={logo} alt="" />
              </Link>
            </div>
          </Grid>

          <Grid
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            item
            px={2}
            xs={3}
          >
            {!user.data || user.data.role !== "admin" ? (
              <>
                <Box
                  onClick={() => {
                    setFinding(true);
                  }}
                >
                  <Bg>
                    <StyledSearchIcon />
                  </Bg>
                </Box>
                <Box onClick={() => setFinding(false)}>
                  <Link to="/cart">
                    <Bg>
                      <Cart>
                        <Quantity>
                          {cart.data.cartItems.reduce((a, b) => {
                            return a + b.quantity;
                          }, 0)}
                        </Quantity>
                      </Cart>
                      <StyledShoppingBagOutlinedIcon />
                    </Bg>
                  </Link>
                </Box>
              </>
            ) : (
              ""
            )}
            <Box onClick={() => setFinding(false)}>
              <Link to="/account?tab=security">
                <Bg>
                  <StyledPersonOutlineOutlinedIcon />
                </Bg>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </NavbarWrapper>
      <Space> </Space>
    </>
  );
}

export default NavBar;
