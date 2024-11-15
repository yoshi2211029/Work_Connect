import { Helmet } from 'react-helmet-async';

import { CreateFormView } from 'src/sections/CreateForm/view';

// ----------------------------------------------------------------------

export default function CreateFormPage() {
  console.log("CreateFormPage通りました");
  return (
    <>
      <Helmet>
        <title> 応募する | Minimal UI </title>
      </Helmet>

      <CreateFormView />
    </>
  );
}
