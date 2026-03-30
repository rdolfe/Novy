import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute — redirige vers /login si l'utilisateur n'est pas connecté
 * Vérifie la présence du token JWT dans localStorage
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('novy_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
