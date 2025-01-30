import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import yazakiLogo from '../../images/yazaki.png'; // Ensure the path to the logo is correct

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
        <div className="flex flex-col h-screen bg-blue-200 items-center justify-center font-playfair">
            <div className="bg-gray-100 rounded-lg shadow-lg p-8 md:p-32 flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12 w-full max-w-5xl">
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <img src={yazakiLogo} alt="Yazaki Logo" className="h-auto w-auto pr-12" />
                </div>
                <div className="w-full md:w-1/2">
                    <header className="text-center md:text-left mb-6">
                        <h1 className="text-3xl font-bold">Se connecter</h1>
                    </header>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-bold text-gray-700">Identifiant/ Matricule:</label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                required
                                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-hoverpurple"
                                placeholder="0000000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700">Mot de passe:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-hoverpurple"
                                placeholder="********"
                            />
                        </div>
                        <div className="text-right">
                            <Link to="#" className="text-sm font-bold text-gray-600 hover:underline">MOT DE PASSE OUBLIÉ?</Link>
                        </div>
                        <button type="submit" className="w-full py-2 bg-blue-700 text-white font-bold rounded-full hover:bg-hoverpurple disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Se connecter'}
                        </button>
                        {errMsg && (
                            <p ref={errRef} className="text-hoverpurple text-sm mt-2" aria-live="assertive">
                                {errMsg}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
