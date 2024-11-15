import PropTypes from "prop-types";
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import TooltipTitle from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

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

const Summary = ({
  application_form,
  selectedIndex,
  GroupedResponses,
  HandleTabClick,
  setViewStudentName
}) => {
  console.log(GroupedResponses);

  const IndividualJump = (e, number,studentName) => {
    console.log("IndividualJump通りました");
    console.log(studentName);
    setViewStudentName(studentName)
    HandleTabClick(e, number);
  };



return (
  <>
    <div className="summary-form">

      <Stack direction="column" spacing={2}>
        <div className="writeform-container">
          <Typography className="writeform-title">
            回答者: {application_form[selectedIndex].user_name.length}名
          </Typography>
          {application_form[selectedIndex].user_name.map((user, index) => (
            <Typography
              key={user.write_form_id || index}
              className="writeform-answereddata"
              onClick={(e) => IndividualJump(e, 2,user.user_name)}
            >
              <TooltipTitle title={`クリックすると${user.user_name}の回答が見られます`}>
                <span>{user.user_name}さん</span>
              </TooltipTitle>
            </Typography>
          ))}
        </div>
        {GroupedResponses &&
          Object.entries(GroupedResponses).map(([title, { responses, type, contents }], index) => (
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
              {type === 'checkbox' && <Graph title={title} responses={responses} />}
            </div>
          ))}
      </Stack>

    </div>

  </>

)
}

Summary.propTypes = {
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

  selectedIndex: PropTypes.number,
  GroupedResponses: PropTypes.func.isRequired,
  HandleTabClick: PropTypes.func.isRequired,
  setViewStudentName: PropTypes.func.isRequired
}

export default Summary;


