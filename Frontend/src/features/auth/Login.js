import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import './Login.css'; // Import custom styles for Login page

const Login = () => {
    const userRef = useRef(null);
    const errRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to manage loading state

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login] = useLoginMutation();

    useEffect(() => {
        userRef.current?.focus(); // Focus on username input when component mounts
    }, []);

    useEffect(() => {
        setErrMsg(''); // Clear error message when username or password changes
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true during login attempt
        try {
            const { accessToken } = await login({ username, password }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setUsername('');
            setPassword('');
            navigate('/dash');
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            if (errRef.current) {
                errRef.current.focus(); // Focus on error message element if available
            }
        } finally {
            setIsLoading(false); // Reset loading state after login attempt
        }
    };

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);

    const errClass = errMsg ? 'errmsg' : 'offscreen';

    return (
        <section className="login-container">
            <header>
                <h1>Welcome Back!</h1>
                <p>Sign in to access your account</p>
            </header>
            <main>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            value={username}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePwdInput}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Sign In'}
                    </button>
                    <p ref={errRef} className={errClass} aria-live="assertive">
                        {errMsg}
                    </p>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    );
};

export default Login;
