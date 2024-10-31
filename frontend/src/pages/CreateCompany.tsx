import React from "react";
import UserProfile from "../components/user_menu/user_menu";

const CreateCompany: React.FC = () => {
  const userName = "user.name";

  return (
    <div>
      <UserProfile userName={userName} />
      <p>under soonest development</p>
    </div>
  );
};

export default CreateCompany;
