// check if user is authenticated (has valid token)
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  //simple token expiration check
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false;
  }
};

//get authentication token for API requests
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

//get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

//get user data
export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : { is_seller: true }; // Default to seller
};

//logout function
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  window.location.href = '/seller/login';
};