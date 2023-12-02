// EditModal.js
import React, { useState } from "react";
import './EditModal.css';
function EditModal({ user, onClose, onSave }) {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedUser);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit User</h2>
        <label>Name:</label>
        <input type="text" name="name" value={editedUser.name} onChange={handleChange} />
        <label>Email:</label>
        <input type="text" name="email" value={editedUser.email} onChange={handleChange} />
        <label>Role:</label>
        <input type="text" name="role" value={editedUser.role} onChange={handleChange} />
        <button onClick={handleSave}  style={{backgroundColor:"#24A0ed",borderRadius:"5px",width:"80px"}}>Save</button>
      </div>
    </div>
  );
}

export default EditModal;
