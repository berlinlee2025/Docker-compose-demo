// src/util/resetUser.jsx

const resetUser = (updateState) => {
    const localStorage = window.localStorage;
    localStorage.removeItem('user');
  
    updateState({
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    });
  };
  
  export default resetUser;