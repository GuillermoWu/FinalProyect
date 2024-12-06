import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const { user, logout } = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/protected", {
          withCredentials: true,
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json", 
          },
        });
        if (response.data.user) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        alert(error.response?.data?.message||"Failed to fetch user");
        logout();
        navigate("/login");
      }
    };
    if (user.token) {
      fetchUser();
    }
  }, [user.token, logout, navigate]);

  return (
    <>
    <div className="account-stats">
      <h2>User info</h2>
        {currentUser ? (
          <div>
            <h3>{currentUser.username}</h3>
            <h3>{currentUser.email}</h3>
          </div>
        ) : (
          <h3>Gathering user info</h3>
        )}
    </div>
    </>
  );
};

export default Account;