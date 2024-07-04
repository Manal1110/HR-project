import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

const Login = () => {
    const userRef = useRef(null);
    const errRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login] = useLoginMutation();

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { accessToken } = await login({ username, password }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setUsername('');
            setPassword('');
            navigate('/dash');
        } catch (err) {
            const errorMessage = err?.status === 400 ? 'Missing Username or Password' :
                                 err?.status === 401 ? 'Unauthorized' :
                                 err?.status ? err.data?.message :
                                 'No Server Response';
            setErrMsg(errorMessage);
            errRef.current?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-playfair">
            <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
                <header className="mb-4 text-center">
                    <h1 className="text-2xl font-semibold">Welcome Back!</h1>
                    <p className="text-gray-600">Sign in to access your account</p>
                </header>
                <main>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Sign In'}
                        </button>
                        {errMsg && (
                            <p ref={errRef} className="text-red-500 text-sm mt-2" aria-live="assertive">
                                {errMsg}
                            </p>
                        )}
                    </form>
                </main>
                <footer className="mt-4 text-center">
                    <Link to="/" className="text-indigo-600 hover:underline">Back to Home</Link>
                </footer>
            </div>
        </section>
    );
};

export default Login;
