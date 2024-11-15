import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import WorkDetailItem from "../WorkDetail-item";

const WorkDetail = () => {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">作品詳細</Typography>
      </Stack>
      <WorkDetailItem />
    </Container>
  );
};

export default WorkDetail;
