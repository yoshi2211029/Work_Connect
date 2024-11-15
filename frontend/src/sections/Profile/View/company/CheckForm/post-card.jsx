import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import Typography from "@mui/material/Typography";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import TooltipTitle from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import { AllItemsContext } from "src/layouts/dashboard/index";
import Summary from "./Summary"
import Question from "./Question"
import Individual from "./Individual"

import './checkform.css';


const PostCard = forwardRef(({ post }) => {
  const { application_form } = post;

  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData") || {};
  const MyUserId = accountData.id;
  console.log(MyUserId);

  const [writeformshow, setWriteFormShow] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [viewingStudentName, setViewStudentName] = useState("");
  // const { setAllItems } = useContext(AllItemsContext);


  const handleClick = (index) => {
    setOpen(!open);
    // 同じインデックスが選ばれた場合、何もしない
    if (selectedIndex === index) return;
    // 新しいインデックスを選択した場合、データを表示
    setWriteFormShow(true);
    setSelectedIndex(index);
  };

  const handleTabClick = (event, newValue) => {

    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== 'click' ||
      (event.type === 'click' && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
    }
    // setAllItems((prevItems) => ({
    //   ...prevItems,
    //   ResetItem: true,
    //   DataList: [],
    //   IsSearch: { searchToggle: 0, Check: false, searchResultEmpty: false },
    //   Page: 1,
    //   sortOption: "orderNewPostsDate",
    // }));
  };

  // 同一ページ内リンク用のナビゲーション制御
  function samePageLinkNavigation(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 || // 左クリックのみ許可
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return false;
    }
    return true;
  }

  const groupedResponses = application_form[selectedIndex]?.user_name.reduce((acc, user) => {
    user.write_form.forEach((response) => {
      if (!acc[response.title]) {
        acc[response.title] = { responses: [], type: response.type, contents: response.contents };
      }
      acc[response.title].responses.push(response.response);
    });
    return acc;
  }, {});

  // カスタムリンクタブ
  function LinkTab(props) {
    return (
      <Tab
        component="a"
        onClick={(event) => {
          if (samePageLinkNavigation(event)) {
            event.preventDefault(); // ナビゲーションを防止
          }
        }}
        aria-current={props.selected ? 'page' : undefined}
        {...props}
      />
    );
  }

  LinkTab.propTypes = {
    selected: PropTypes.bool,
  };




  return (
    <>
      <div style={{ width: '90%', margin: 'auto',}}>
        <List
          sx={(theme) => ({
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            overflow: 'auto',
            border: '#DAE2ED 2px solid',
            borderRadius: '10px',
            [theme.breakpoints.down('1200')]: {
              marginLeft: '2%',
            },
          })}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader" className="news-list">
              ニュース一覧
            </ListSubheader>
          }
        >
          {application_form.map((posts, index) => (
            <ListItemButton onClick={() => handleClick(index)} key={index} id={index}
            sx={{
              backgroundColor: selectedIndex === index ? 'gray' : 'transparent', // クリックされた場合は背景色をグレーに
              '&:hover': {
                backgroundColor: selectedIndex === index ? 'darkgray' : 'lightgray', // ホバー時の背景色
              }
            }}
            >
              <ListItemText
                primary={
                  <>
                    <Typography className="circle_number">
                      {posts.user_name.length}
                    </Typography>
                    <TooltipTitle title={posts.article_title}>
                      <Typography
                        textOverflow="ellipsis"
                        sx={{
                          fontSize: '0.8rem',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis', // 省略記号を表示
                        }}
                      >
                        {posts.article_title}
                      </Typography>
                    </TooltipTitle>

                  </>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </div>

      {writeformshow && selectedIndex !== null && (
        <div style={{ flexGrow: 1 }}>
          <div className="write-form">

            <Box sx={{ width: '100%', paddingBottom: '10%' }}>
              <Tabs
                value={value}
                aria-label="nav tabs example"
                role="navigation"
              >
                <Tab label="要約" onClick={(e) => handleTabClick(e, 0)} />
                <Tab label="回答別" onClick={(e) => handleTabClick(e, 1)} />
                <Tab label="個別" onClick={(e) => handleTabClick(e, 2)} />
              </Tabs>
              {value === 0 && <Summary
                application_form={application_form}
                selectedIndex={selectedIndex}
                GroupedResponses={groupedResponses}
                HandleTabClick = {handleTabClick}
                setViewStudentName={setViewStudentName}
                />}
              {value === 1 && <Question
                application_form={application_form}
                selectedIndex={selectedIndex}
                GroupedResponses={groupedResponses}
              />}
              {value === 2 && <Individual
                application_form={application_form}
                selectedIndex={selectedIndex}
                GroupedResponses={groupedResponses}
                viewingStudentName ={viewingStudentName}
                // 名前
              />}
            </Box>

          </div >
        </div >
      )}


    </>
  );
});


PostCard.displayName = 'PostCard';

PostCard.propTypes = {
  post: PropTypes.shape({
    application_form: PropTypes.arrayOf(
      PropTypes.shape({
        article_title: PropTypes.string.isRequired,
        user_name: PropTypes.arrayOf(
          PropTypes.shape({
            news_created_at: PropTypes.string.isRequired,
            user_name: PropTypes.string.isRequired,
            write_form: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                response: PropTypes.string.isRequired,
                contents: PropTypes.string.isRequired,
              })
            ).isRequired,
            write_form_id: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  responses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PostCard;
