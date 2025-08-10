// src/pages/institute/CreateTender.jsx
import { useState } from "react";
import { tendersApi } from "../../api/tenders";
import { showToast } from '../../utils/toast';
import { useNavigate } from "react-router-dom";

const CreateTender = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await tendersApi.createTender({ title, description, deadline });
      showToast.success("Tender created successfully");
      navigate("/institute/dashboard"); // to reload the dashboard component so we can again see the updated list of tenders.
    } catch (err) {
      showToast.error("Failed to create tender");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Tender</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Tender Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Tender Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Tender</button>
      </form>
    </div>
  );
};

export default CreateTender;
