import React from "react";

const Container = ({ children }) => {
  const containerStyle = {
    maxWidth: "600px",
    margin: "60px auto",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    position: "relative",
  };

  return <div style={containerStyle}>{children}</div>;
};

export default Container;
