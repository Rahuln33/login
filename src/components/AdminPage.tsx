import React, { useEffect, useState } from "react";

interface UserDetails {
  name: string;
  rank: string;
  role: string;
  ship: string;
  approvalstatus: string;
}

interface NotificationResponse {
  message: string;
  user_details: UserDetails[];
}

const AdminPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/pending_approval");
      const data: NotificationResponse = await response.json();
      setUserDetails(data.user_details);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle action button clicks
  const handleAction = async (
    status: "approved" | "ignored",
    user: UserDetails
  ) => {
    // Add approval status to the user's details
    const updatedDetails = { ...user, approvalstatus: status };

    try {
      const response = await fetch("http://127.0.0.1:5000/approval_list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDetails),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Response from server:", result);

        // Remove the user from the list after action
        setUserDetails((prevDetails) =>
          prevDetails.filter((item) => item.name !== user.name)
        );
      } else {
        console.error("Failed to send data to /approval_list");
      }
    } catch (error) {
      console.error("Error sending data to /approval_list:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (userDetails.length === 0) {
    return <p>No pending approvals.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <table
        style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Rank</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Role</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Ship</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Approval Status
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {userDetails.map((user) => (
            <tr key={user.name}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.name}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.rank}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.role}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.ship}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.approvalstatus}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button
                  onClick={() => handleAction("approved", user)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction("ignored", user)}
                  style={{ padding: "5px 10px", cursor: "pointer" }}
                >
                  Ignore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
