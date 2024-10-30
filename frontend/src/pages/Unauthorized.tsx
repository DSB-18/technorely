import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="unauthorized-page">
      <div className="form-container">
        <h1>403 - Access Forbidden</h1>
        <p>You do not have permission to view this page.</p>
        <p>
          You will be redirected to the <a href="/login">login</a> page in{" "}
          {seconds} second
          {seconds !== 1 ? "s" : ""}.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
