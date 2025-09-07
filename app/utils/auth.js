//check if user is authenticated and is a seller
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user_data');
  
  if (!token || !userData) return false;
  
  try {
    const user = JSON.parse(userData);
    return user.is_seller === true;
  } catch {
    return false;
  }
};

//get authentication token for API requests
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

//get user data
export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

//logout function
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  window.location.href = '/seller/login';
};