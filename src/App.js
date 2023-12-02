// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditModal from "./EditModal";
import './style.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const PAGE_SIZE = 10;
  useEffect(() => {
    axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      .then(response => {
        const initialUsers = response.data.map(user => ({ ...user, selected: false }));
        setUsers(initialUsers);
        setFilteredUsers(initialUsers);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  useEffect(() => {
    // update filters when search changes
    const filtered = users.filter(user => containsSearchTerm(user, searchTerm));
    setFilteredUsers(filtered);
    setCurrentPage(1); // Resetting first page
  }, [searchTerm, users]);
  const containsSearchTerm = (user, term) => {
    return Object.values(user).some(
      prop =>
        typeof prop === "string" &&
        prop.toLowerCase().includes(term.toLowerCase())
    );
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const toggleSelectAll = () => {
    const allPageUserIds = filteredUsers
      .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
      .map((user) => user.id);
    if (selectAll) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((userId) => !allPageUserIds.includes(userId))
      );
    } else {
      setSelectedRows((prevSelectedRows) =>
        [...new Set([...prevSelectedRows, ...allPageUserIds])]
      );
    }
    setSelectAll(!selectAll);
  };
  const toggleSelectRow = (userId) => {
    const isSelected = selectedRows.includes(userId);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(row => row !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };
  const deleteRow = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((row) => row !== userId)
    );
  };
  const bulkDelete = () => {
    // Perform bulk deletion of selected rows
    setUsers(prevUsers => prevUsers.filter((user) => !selectedRows.includes(user.id)));
    setSelectedRows([]);
  };
  return (
    <div className='header'>
      <h5>Admin Dashboard</h5>
      <div className="search-bar-and-delete">
        <input
          type="text"
          placeholder="Enter Value ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      <button onClick={bulkDelete}>
        <MdDelete />
      </button>
    </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === PAGE_SIZE}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((user) => (
            <tr key={user.id} style={{ background: selectedRows.includes(user.id) ? "#ddd" : "inherit" }}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => toggleSelectRow(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}>
                  <FaEdit />
                </button>
                <button onClick={() => deleteRow(user.id)}>
                  <MdDelete style={{ color: "red" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
      <div>
          <span>{selectedRows.length} of {users.length} rows selected</span>
        </div>
        <div>
          <span>Page {currentPage} of {Math.ceil(filteredUsers.length / PAGE_SIZE)}</span>
          <button
            className="first-page"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>
          <button
            className="previous-page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {Array.from({ length: Math.ceil(filteredUsers.length / PAGE_SIZE) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="next-page"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredUsers.length / PAGE_SIZE)}
          >
            {">"}
          </button>
          <button
            className="last-page"
            onClick={() => handlePageChange(Math.ceil(filteredUsers.length / PAGE_SIZE))}
            disabled={currentPage === Math.ceil(filteredUsers.length / PAGE_SIZE)}
          >
            {">>"}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <EditModal user={selectedUser} onClose={() => { setIsModalOpen(false); setSelectedUser(null); }} onSave={(editedUser) => { /* Implement save logic here */ }} />
      )}
    </div>
  );
}
export default App;
