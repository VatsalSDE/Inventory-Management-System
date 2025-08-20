import React, { useState } from 'react';
import loginImage from '../assets/images/login-image.jpg'
import logo from '../assets/images/logo.png'
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setToken } from '../apiClient';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            if (data?.token) {
                setToken(data.token);
                navigate('/admin/dashboard');
            } else {
                setError('Login failed');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    }

    {/*---------------- Left Image Section--------------- */ }
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-[55%] w-full h-[100vh]">
                <img
                    src={loginImage}
                    alt="Login Visual"
                    className="w-full h-full object-cover animate-float"
                />
            </div>

            {/* ----------------Right Login Form Section --------------------*/}
            <div className="md:w-[45%] w-full flex items-center justify-center p-8 bg-blue-50">
                <div className="w-full max-w-md">
                    {/* ----------Logo---------------- */}
                    <div className="mb-6 text-center">
                        <img
                            src={logo}
                            alt="Invenza Admin Logo"
                            className="mx-auto h-24 w-[95%] object-contain"
                        />
                    </div>


                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-base font-semibold text-gray-800 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg text-base font-semibold text-gray-800 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>

                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-base shadow-md hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 ease-in-out"
                        >
                            Let's Go
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
