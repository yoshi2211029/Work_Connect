import { Helmet } from 'react-helmet-async';

import { WorkOfListView } from 'src/sections/WorkList/view';

// ----------------------------------------------------------------------

export default function workListPage() {
  return (
    <>
      <Helmet>
        <title> 作品一覧 | Work&Connect </title>
      </Helmet>

      <WorkOfListView />
    </>
  );
}
