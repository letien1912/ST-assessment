import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { IUsers } from '../../shared/types/get-users';
import { apiClient } from '../../shared/api-clients';

const TAKE = 10;
const Table: React.FC<{ uploading: boolean }> = ({ uploading }) => {
  const [data, setData] = useState<IUsers[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    try {
      const {
        data: { data, count },
      } = await apiClient.get.fetchUsers({
        search: searchTerm,
        skip: currentPage * TAKE,
        take: TAKE,
      });
      setData(data);
      setCount(count);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (!uploading) {
      fetchData();
    }
  }, [uploading]);

  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b py-2 px-4">ID</th>
            <th className="border-b py-2 px-4">Post ID</th>
            <th className="border-b py-2 px-4">Name</th>
            <th className="border-b py-2 px-4">Email</th>
            <th className="border-b py-2 px-4">Body</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td className="border-b py-2 px-4">{user.id}</td>
              <td className="border-b py-2 px-4">{user.postId}</td>
              <td className="border-b py-2 px-4">{user.name}</td>
              <td className="border-b py-2 px-4">{user.email}</td>
              <td className="border-b py-2 px-4">{user.body}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none"
          disabled={currentPage + 1 >= Math.floor(count / TAKE)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
