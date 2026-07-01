import { useState } from 'react';
import axios from 'axios';
import { capitalizeWords } from '../utils/formatters';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    const [credenciales, setCredenciales] = useState({
        nombre: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [errorBackend, setErrorBackend] = useState('');

    const resetMode = () => {
        setIsLogin(!isLogin);
        setErrorBackend('');
        setCredenciales({ nombre: '', email: '', password: '' });
    };

    const handleChange = (e) => {
        let valor = e.target.value;
        if (e.target.name === 'nombre') {
            valor = capitalizeWords(valor);
        }
        setCredenciales({
            ...credenciales,
            [e.target.name]: valor
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorBackend('');

        const apiUrl = import.meta.env.VITE_API_URL;

        const url = isLogin
            ? `${apiUrl}/auth/login`
            : `${apiUrl}/auth/register`;

        const datosEnviar = isLogin
            ? { email: credenciales.email, password: credenciales.password }
            : credenciales;

        try {
            const respuesta = await axios.post(url, datosEnviar);

            if (respuesta.data.token) {
                localStorage.setItem('token', respuesta.data.token);
            }

            alert(isLogin ? '¡Ingreso correcto!' : '¡Registro exitoso!');
        } catch (error) {
            const mensajeError = error.response?.data?.error || 'Ocurrió un error inesperado.';
            setErrorBackend(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
            <h2 className="text-3xl font-bold text-center text-emerald-400 mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </h2>
            <p className="text-slate-400 text-center mb-6 text-sm">
                {isLogin
                    ? 'Ingresá tus datos para gestionar tus gastos.'
                    : 'Completa tus datos para acceder.'}
            </p>

            {errorBackend && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-center font-medium">
                    {errorBackend}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={credenciales.nombre}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-600 bg-slate-700 p-2.5 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Tu nombre completo"
                            disabled={loading}
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={credenciales.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 p-2.5 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="correo@ejemplo.com"
                        disabled={loading}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={credenciales.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 p-2.5 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="••••••••"
                        disabled={loading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-emerald-500 p-2.5 font-semibold text-slate-900 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50"
                >
                    {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Registrarse'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
                {isLogin ? '¿No tenés una cuenta?' : '¿Ya tenés cuenta?'}
                <button
                    type="button"
                    onClick={resetMode}
                    className="ml-1 font-medium text-emerald-400 hover:text-emerald-300 hover:underline focus:outline-none"
                >
                    {isLogin ? 'Registrate acá' : 'Iniciá sesión'}
                </button>
            </p>
        </div>
    );
}

export default Auth;
