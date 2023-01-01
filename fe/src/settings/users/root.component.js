import React, { useEffect, useState } from "react";
import { notification } from "antd";
import api from "../../data";

import { Loader } from "../../utils/ui_helper";
import UsersTable from "./users.table";
import UsersStats from "./users.stats";

function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    loadUsersList();
  }, []);

  function loadUsersList() {
    setIsLoading(true);
    api.Authorization("users").Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setUsersList(data);
        setIsLoading(false);
        return;
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
      setIsLoading(false);
    })
  }

  return (
    <div className="users">
      {isLoading && <Loader />}
      <UsersStats usersList={usersList} />
      <br />
      <UsersTable usersList={usersList} />
    </div>
  )
}

export default Users;
