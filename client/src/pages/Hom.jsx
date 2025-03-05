import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-dark text-center px-6">
      <h1 className="text-4xl font-bold text-primary mb-4">ChatterSync</h1>
      <p className="text-lg italic">"Stay connected, chat instantly!"</p>
      <div className="mt-6">
        <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-md mx-2">Login</Link>
        <Link to="/register" className="px-6 py-2 border border-primary text-primary rounded-md mx-2">Register</Link>
      </div>
    </div>
  );
};

export default Home;
