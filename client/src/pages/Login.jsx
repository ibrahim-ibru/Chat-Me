import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Welcome Back!</h1>
      <input type="email" placeholder="Enter email" className="w-full p-2 mb-4 border rounded-md" />
      <input type="password" placeholder="Enter password" className="w-full p-2 mb-4 border rounded-md" />
      <button className="w-full bg-primary text-white py-2 rounded-md">Login</button>
      <p className="mt-4 text-sm">
        Don't have an account? <Link to="/register" className="text-primary">Register Now</Link>
      </p>
    </div>
  );
};

export default Login;
