const getNameFromCookie = () => {
  // 1. Buscamos la cookie por su nombre (tokencito)
  const cookieArray = document.cookie.split('; ');
  const tokenCookie = cookieArray.find(row => row.startsWith('tokencito='));
  
  if (!tokenCookie) return null;

  const token = tokenCookie.split('=')[1];

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    
    return payload.name;
  } catch (e) {
    console.error("Error al decodificar el token", e);
    return null;
  }
};

export default getNameFromCookie;