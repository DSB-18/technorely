import React from 'react';
import UserProfile from '../components/user_menu/user_menu';
import { Avatar } from '@mui/material';

const Dashboard: React.FC = () => {
  const userName = 'user.name';

  return (
    <div>
      <UserProfile userName={userName} />
    </div>
  );
};

export default Dashboard;
