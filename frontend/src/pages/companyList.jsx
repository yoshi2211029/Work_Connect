import { Helmet } from 'react-helmet-async';

import { CompanyListView } from 'src/sections/CompanyList/view';

// ----------------------------------------------------------------------

export default function CompanyListPage() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>

      <CompanyListView />
    </>
  );
}
