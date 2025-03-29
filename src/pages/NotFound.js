import { Link } from "react-router-dom";

const NotFound = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      color: "#333",
      textAlign: "center",
    },
    title: {
      fontSize: "6rem",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    text: {
      fontSize: "1.5rem",
      marginBottom: "20px",
    },
    button: {
      padding: "12px 24px",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "5px",
      textDecoration: "none",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Page Not Found</p>
      <Link
        to="/"
        style={styles.button}
        onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
