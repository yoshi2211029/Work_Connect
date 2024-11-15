import { Helmet } from 'react-helmet-async';

import { TopPageListView } from 'src/sections/TopPageList/view';

// ----------------------------------------------------------------------

export default function TopPage() {
  return (
    <>
      <Helmet>
        <title> トップページ | Work&Connect </title>
      </Helmet>

      <TopPageListView />
    </>
  );
}

// sections ディレクトリの傘下にTopPageListViewコンポーネントファイルを置く。