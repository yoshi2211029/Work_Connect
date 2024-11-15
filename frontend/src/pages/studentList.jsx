import { Helmet } from 'react-helmet-async';

import { StudentListView } from 'src/sections/StudentList/view';

// ----------------------------------------------------------------------

export default function studentListPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <StudentListView />
    </>
  );
}
