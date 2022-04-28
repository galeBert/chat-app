import './NotificationPage.css';

import { useEffect, useState } from 'react';

import Table from '../../components/Tables';
import { observeSnapshot } from '../../functions/auth';

const NotificationPage = () => {
  const [notification, setNotification] = useState([]);
  const [error, setError] = useState('');
  console.log(error);

  const onReceived = (doc) => setNotification(doc);
  const onError = (err) => setError(err);
  useEffect(() => {
    observeSnapshot('notifications', 'isVerify', false, onReceived, onError);
  }, []);

  return <Table data={notification} noAddNew type='Notification' />;
};

export default NotificationPage;
