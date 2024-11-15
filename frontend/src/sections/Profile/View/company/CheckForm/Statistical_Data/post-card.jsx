import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { useSessionStorage } from "src/hooks/use-sessionStorage";
import Typography from "@mui/material/Typography";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TooltipTitle from '@mui/material/Tooltip';

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
  BarController,
  BarElement,
} from "chart.js";
import { Bar } from 'react-chartjs-2';

const PostCard = forwardRef(({ post }) => {
  const { application_form } = post;

  const { getSessionData } = useSessionStorage();
  const accountData = getSessionData("accountData") || {};
  const MyUserId = accountData.id;
  console.log(MyUserId);

  const [writeformshow, setWriteFormShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClick = (index) => {
    // 同じインデックスが選ばれた場合、何もせず
    if (selectedIndex === index) return;

    // 新しいインデックスを選択した場合、データを表示
    setWriteFormShow(true);
    setSelectedIndex(index);
  };

  const groupedResponses = application_form[selectedIndex]?.user_name.reduce((acc, user) => {
    user.write_form.forEach((response) => {
      if (!acc[response.title]) {
        acc[response.title] = { responses: [], type: response.type, contents: response.contents };
      }
      acc[response.title].responses.push(response.response);
    });
    return acc;
  }, {});

  // グラフ表示用のコンポーネント
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement
  );

  const Graph = ({ title, responses }) => {
    const responseCounts = responses.reduce((acc, response) => {
      acc[response] = (acc[response] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(responseCounts);
    const dataValues = Object.values(responseCounts);

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    };

    const data = {
      labels,
      datasets: [
        {
          label: '回答数',
          data: dataValues,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return (
      <Box sx={{ width: '100%', height: '200px' }}>
        <Bar options={options} data={data} style={{ height: '100%', width: '100%' }} />
      </Box>
    );
  };

  Graph.propTypes = {
    title: PropTypes.string.isRequired,
    responses: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  return (
    <>
      <div style={{ width: '100%', marginRight: '16px' }}>
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
            <ListItemButton onClick={() => handleClick(index)} key={index} id={index}>
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

      {/* 945 436.73
       928 634 */}

      {writeformshow && selectedIndex !== null && (
        <div style={{ flexGrow: 1 }}>
          <div className="write-form">
            <Stack direction="column" spacing={2}>
              <div className="writeform-container">
                <Typography className="writeform-title">
                  回答者: {application_form[selectedIndex].user_name.length}名
                </Typography>
                {application_form[selectedIndex].user_name.map((user, index) => (
                  <Typography key={user.write_form_id || index} className="writeform-answereddata">
                    <TooltipTitle title={`クリックすると${user.user_name}さんの回答が見られます`}>
                      {user.user_name}さん
                    </TooltipTitle>

                  </Typography>

                ))}
              </div>
              {groupedResponses &&
                Object.entries(groupedResponses).map(([title, { responses, type, contents }], index) => (
                  <div key={index} className="writeform-container">
                    <Typography className="writeform-title">
                      {title} ({type}):
                    </Typography>
                    <Typography className="writeform-contents">
                      {contents}
                    </Typography>
                    <Typography className="writeform-length">
                      {responses.length}件の回答
                    </Typography>
                    {responses.map((response, idx) => (
                      <Typography key={idx} className="writeform-answereddata">
                        {response}
                      </Typography>
                    ))}

                    {type == 'checkbox' &&
                      <Graph title={title} responses={responses} />
                    }
                  </div>
                ))}
            </Stack>
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
