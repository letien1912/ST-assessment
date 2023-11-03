import { FC, useState } from 'react';
import Upload from './upload/Upload';
import Table from './table/Table';

const HomePage: FC = () => {
  const [uploading, setUploading] = useState(false);
  return (
    <>
      <Upload setUploading={setUploading} />
      {uploading ? <p>Loading...</p> : <Table uploading={uploading} />}
    </>
  );
};

export default HomePage;
