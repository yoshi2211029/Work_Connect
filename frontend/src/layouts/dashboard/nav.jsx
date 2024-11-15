import { useContext, useEffect } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { alpha } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";
import { useResponsive } from "src/hooks/use-responsive";
import Logo from "src/components/logo";
import Scrollbar from "src/components/scrollbar/scrollbar";

import { NAV } from "./config-layout";
import navConfig from "./config-navigation";
import { MyContext } from "src/layouts/dashboard/index";
import { AllItemsContext } from "src/layouts/dashboard/index";

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const Display = useContext(MyContext);
  const pathname = usePathname();
  const upLg = useResponsive("up", "lg");


  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F9FAFB",
        },
      }}
    >

      {/* ロゴ:Work&Connect */}
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
        // display: Display,
        display: Display.HomePage,
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  const { AllItems, setAllItems } = useContext(AllItemsContext);
  const { /*DataList,*/ IsSearch, Page, sortOption } = AllItems;

  // Page1にしてもworkOfListは初期化されていないので表示は変わらない
  // IsSearch Check がfalseの時は検索タグを初期化
  // selectedOption の初期化は正常に動いている。

  // サイドバークリック 一覧アイテム・並び替え・検索タグ 初期化
  const handleReset = () => {
    console.log("item.path", item.path)

    if (item.path !== pathname || sortOption !== "orderNewPostsDate" || Page > 1 || IsSearch.Check == true) {
      setAllItems((prevItems) => ({
        ...prevItems,
        IsLoading : true, // 一時的にローディングを解除
      }));
      console.log("あいうえお")
      setAllItems((prevItems) => ({
        ...prevItems, //既存のパラメータ値を変更するためにスプレッド演算子を使用
        ResetItem: true,
        DataList: [], //検索してない状態にするために初期化 //searchbar.jsxのsearchSourceも初期化
        IsSearch: { searchToggle: 0, Check: false, searchResultEmpty: false },
        Page: 1, //スクロールする前の状態にするために初期化
        sortOption: "orderNewPostsDate", //並び替える前の状態にするために初期化
      }));
      // 必要に応じて、スクロール位置や他の状態もリセット
    }
  };

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        fontWeight: "fontWeightMedium",
        ...(active && {
          color: "primary.main",
          fontWeight: "fontWeightSemiBold",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
      onClick={handleReset}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
