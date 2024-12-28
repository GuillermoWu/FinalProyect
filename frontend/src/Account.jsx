import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const { user, logout , fetchUser} = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser()
  },[]);

  return (
    <>
    <div className="account-stats">
      <h2>User info</h2>
        {user ? (
          <div>
            <h3>{user.username}</h3>
            <h3>{user.email}</h3>
          </div>
        ) : (
          <h3>Gathering user info</h3>
        )}
    </div>
    </>
  );
};

export default Account;