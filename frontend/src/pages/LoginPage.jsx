import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch("http://localhost:3200/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
    
            if (!response.ok) throw new Error(data.error || "Login failed");
    
            login(data.token, data.user);
            console.log("Login success — user object:", data.user);
    
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };
    

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default LoginPage;
