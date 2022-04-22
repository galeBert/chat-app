import Table from 'components/Tables'
import './NotificationPage.css'
import { observeSnapshot } from "functions/auth";
import { useEffect, useState } from 'react';

const NotificationPage = () => {
    const [notification, setNotification] = useState([]);
    const [error, setError] = useState('');

    const onReceived = (doc) => setNotification(doc);
    const onError = (err) => setError(err);
    useEffect(() => {
        observeSnapshot('notifications', 'isVerify', false, onReceived, onError)
    }, [])

    return (
        <Table data={notification} type="Notification" noAddNew />

    );
}

export default NotificationPage;