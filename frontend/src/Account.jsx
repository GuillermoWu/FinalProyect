import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

const Account = () => {
  const { user, fetchUser } = useContext(UserContext);

  useEffect(() => {
    fetchUser();
  }, []);

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
