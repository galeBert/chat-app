import { useContext } from 'react';

import { UserContext } from '../context/UserContext';

export const useAdminContext = () => useContext(UserContext);
