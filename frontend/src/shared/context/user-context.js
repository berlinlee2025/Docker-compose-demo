import { createContext } from 'react';

export const UserContext = createContext({
    user: {},
    isSignedIn: false,
    token: false,
    saveUser: () => {},
    resetUser: () => {},
    onRouteChange: () => {},
    fetchUserData: () => {},
    resetState: () => {},
    onSignout: () => {}
});