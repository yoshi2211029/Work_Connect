import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import VideoDetailItem from "../VideoDetail-Item";

const VideoDetail = () => {
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">動画詳細</Typography>
      </Stack>
      <VideoDetailItem />
    </Container>
  );
};

export default VideoDetail;
