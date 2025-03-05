import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Create an Account</h1>
      <input type="text" placeholder="Username" className="w-full p-2 mb-4 border rounded-md" />
      <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded-md" />
      <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded-md" />
      <button className="w-full bg-primary text-white py-2 rounded-md">Register</button>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-primary">Login Now</Link>
      </p>
    </div>
  );
};

export default Register;
