// PostCard.tsx
import { useEffect, forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import Typography from "@mui/material/Typography";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

// Survey.js
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import './writeform.css';

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from 'react-chartjs-2'; // 棒グラフ

// ----------------------------------------------------------------------

function samePageLinkNavigation(event) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  );
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
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

const PostCard = forwardRef(({ post },) => {
  const { article_title, user_name } = post;

  const { getSessionData, updateSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData") || {};
  const data = {
    account_id: accountData.id,
  };

  const [open, setOpen] = useState(false);
  const [surveyModel, setSurveyModel] = useState(null);

  // ログイン中のid
  const MyUserId = data.account_id;
  console.log(MyUserId);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const css =
      `.sv-action__content .sd-btn--action.sd-navigation__complete-btn {
        display: none;
      }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
  }, []);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  const FormOpen = (user) => {
    if (user) {
      updateSessionData("accountData", "ChatOpenId", user.write_form_id);
      updateSessionData("accountData", "ChatOpenUserName", user.user_name);
      updateSessionData("accountData", "ChatOpenCompanyName", user.company_name || "");
      updateSessionData("accountData", "ChatOpenIcon", user.icon || "");
      updateSessionData("accountData", "ChatOpenFollowStatus", user.follow_status || "");

      const surveyData = transformFormFields(user.write_form, user.user_name);
      const survey = new Model(surveyData);

      console.log("survey",user.write_form);

      // Survey モデルを状態に保存
      setSurveyModel(survey);
    }
  };

  const transformFormFields = (fields, user_name) => {
    if (!Array.isArray(fields) || fields.length === 0) {
      console.error("フォームフィールドがありません。fields:", fields);
      return {
        title: user_name,
        pages: [],
      };
    }

    return {
      title: user_name,
      pages: [
        {
          name: "page1",
          elements: fields.map(field => ({
            type: field.type || "text", // typeがない場合のデフォルトを追加
            name: field.name || "default_name", // nameがない場合のデフォルトを追加
            title: field.title || "無題の質問", // titleがない場合のデフォルトを追加
            ...(field.inputType && { inputType: field.inputType }),
            ...(field.validators && { validators: field.validators }),
            ...(field.response && { defaultValue: field.response }),
            readOnly: true, // 全てのフィールドをreadOnlyに設定
          })),
        },
      ],
    };
  };

  const Graph = () => {
    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "グラフタイトル",
        },
      },
    };

    const labels = ["January", "February", "March", "April", "May", "June", "July"];

    const data = {
      labels,
      datasets: [
        {
          label: "データ1",
          data: [10, 40, 30, 40, 50, 80, 120],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return (
      <Box>
        <Line options={options} data={data} />
      </Box>
    );
  };

    return (
      <>
        <List
          sx={(theme) => ({
            width: '100%',
            height: '100%',
            maxWidth: 360,
            marginLeft: '0',
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
            <ListSubheader component="div" id="nested-list-subheader">
              ニュース一覧
            </ListSubheader>
          }
        >

          <ListItemButton
            onClick={handleClick}
          >
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {article_title}
                </Typography>
              }
            />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          送信者の名前一覧
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding
              sx={{
                pl: 4,
                background: user_name.some(u => u.write_form_id === accountData.ChatOpenId) ? '#cce5ff' : 'blue',
                '&:hover': {
                  background: user_name.some(u => u.write_form_id === accountData.ChatOpenId) ? '#cce5ff' : '#eee',
                },
              }}
            >
              {user_name.map((user, index) => (
                <Typography
                  key={user.write_form_id || index} // ユーザーIDまたはインデックスをキーにする
                  sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: "center" }}
                  onClick={() => FormOpen(user)}
                >
                  {user.user_name}さん {/* ユーザー名を表示 */}
                </Typography>
              ))}
            </List>
          </Collapse>
        </List>

        <Graph />

        {surveyModel &&
          <Box>
            <Survey model={surveyModel} />
          </Box>
        }
      </>
    );
  });

// displayName を設定
PostCard.displayName = 'PostCard';

PostCard.propTypes = {
  post: PropTypes.shape({
    article_title: PropTypes.string,
    user_name: PropTypes.arrayOf( // 配列の定義に変更
      PropTypes.shape({
        write_form_id: PropTypes.number,
        user_name: PropTypes.string,
        company_name: PropTypes.string,
        icon: PropTypes.string,
        follow_status: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    write_form_id: PropTypes.string,
    user_name: PropTypes.string,
    company_name: PropTypes.string,
    icon: PropTypes.string,
    follow_status: PropTypes.bool,
    write_form: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      name: PropTypes.string,
      title: PropTypes.string,
      inputType: PropTypes.string,
      validators: PropTypes.array,
      response: PropTypes.string,
    })),
  }).isRequired,
};

export default PostCard;
