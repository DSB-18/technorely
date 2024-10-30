import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState, useRef } from "react";

const verifyToken = async (token: string): Promise<any> => {
  try {
    const response = await fetch("http://localhost:3000/auth/verify-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    return await response.json();
  } catch (error) {
    return null;
  }
};

interface PrivateRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const PrivateRoute = ({ children, requiredRoles }: PrivateRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);
  const token = localStorage.getItem("accessToken");
  const hasVerified = useRef(false);

  const getRoleFromToken = (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const verifyUserToken = async () => {
      if (token && !hasVerified.current) {
        hasVerified.current = true;
        const verifiedData = await verifyToken(token);
        if (!verifiedData) {
          setRedirect("/login");
        }
      }
      setLoading(false);
    };
    verifyUserToken();
  }, [token]);

  const userRole = token ? getRoleFromToken(token) : null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
