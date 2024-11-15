import { Helmet } from 'react-helmet-async';

import { WorkOfDetailView } from 'src/sections/WorkList/WorkDetail';

// ----------------------------------------------------------------------

export default function workListPage() {
  return (
    <>
      <Helmet>
        <title> 作品詳細 | Work&Connect </title>
      </Helmet>

      <WorkOfDetailView />
    </>
  );
}
