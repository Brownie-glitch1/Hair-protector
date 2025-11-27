// Local storage utilities

export const storage = {
  // Token management
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),

  // User data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user'),

  // Hair profile
  getHairProfile: () => {
    const profile = localStorage.getItem('hairProfile');
    return profile ? JSON.parse(profile) : null;
  },
  setHairProfile: (profile) => 
    localStorage.setItem('hairProfile', JSON.stringify(profile)),
  removeHairProfile: () => localStorage.removeItem('hairProfile'),

  // Clear all
  clearAll: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hairProfile');
  },
};