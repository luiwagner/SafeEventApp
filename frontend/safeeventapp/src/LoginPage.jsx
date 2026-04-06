import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Code, Globe } from 'lucide-react';
import { authService } from './services/authService';

/** * 1. Sub-Komponente: InputField
 * Nutzt zentrale Variablen für Rahmen, Fokus-Ringe und Icons.
 */
const InputField = ({ label, type, name, value, onChange, placeholder, icon: Icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const currentType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-sm font-semibold text-main ml-1">
        {label}
      </label>
      <div className="relative group">
        {/* Optionales Icon am Anfang */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        
        <input
          type={currentType}
          name={name}
          required
          value={value}
          onChange={onChange}
          className={`block w-full ${Icon ? 'pl-11' : 'px-4'} pr-11 py-3 border border-border bg-card text-main rounded-xl 
                     focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none 
                     placeholder-muted/50 text-sm`}
          placeholder={placeholder}
        />

        {/* Passwort-Auge am Ende */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

/** * 2. Sub-Komponente: SocialButton
 */
const SocialButton = ({ icon: Icon, label }) => (
  <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-border rounded-xl bg-card text-sm font-medium text-main hover:bg-bg transition-colors shadow-sm">
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

/** * 3. Haupt-Komponente: LoginPage
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isError, setIsError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Login Event" : "Register Event", formData);
    if(isLogin) {
      authService.login(formData.email, formData.password)
        .then(data => {
          if(data.loginSuccessful) {
            setRegistrationSuccess(true);
            setIsError("");
            navigate("/dashboard");
          } else {
            setRegistrationSuccess(false);
            setIsError("Login fehlgeschlagen. Bitte überprüfe deine Eingaben.");
          }
        })
        .catch(() => setIsError("Ein Fehler ist aufgetreten. Bitte versuche es später erneut."));
    } else {
      authService.register(formData.email, formData.firstname, formData.lastname, formData.password)
        .then(() => {
          setRegistrationSuccess(true);
          setIsError("");
          setIsLogin(true);
        })
        .catch(() => setIsError("Registrierung fehlgeschlagen. Bitte versuche es später erneut."));

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-card p-8 sm:p-10 rounded-3xl shadow-2xl shadow-primary/5 border border-border/50">
        
        {/* Toggle Switch */}
        <div className="flex bg-border/30 p-1.5 rounded-2xl">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              isLogin ? 'bg-card shadow-md text-primary' : 'text-muted hover:text-main'
            }`}
          >
            Anmelden
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              !isLogin ? 'bg-card shadow-md text-primary' : 'text-muted hover:text-main'
            }`}
          >
            Registrieren
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-main">
            {isLogin ? 'Willkommen' : 'Account erstellen'}
          </h1>
          <p className="text-muted text-sm">
            {isLogin ? 'Logge dich ein, um fortzufahren.' : 'Tritt unserer Community bei!'}
          </p>
        </div>

        {/* Formular */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <InputField 
                label="Vorname"
                type="text"
                name="firstname"
                icon={User}
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Max"
                />
              <InputField 
                label="Nachname"
                type="text"
                name="lastname"
                icon={User}
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Mustermann"
                />
            </>
          )}

          <InputField 
            label="E-Mail"
            type="email"
            name="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            placeholder="name@firma.de"
          />
          
          <InputField 
            label="Passwort"
            type="password"
            name="password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-primary hover:underline underline-offset-4">
                Passwort vergessen?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
          >
            {isLogin ? 'Jetzt anmelden' : 'Konto erstellen'}
          </button>
        </form>
        <>
          {(isError != "") && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mt-4">
              {isError}
            </div>
          )}
          {registrationSuccess && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm mt-4">
              Registrierung erfolgreich! Du kannst dich jetzt anmelden.
            </div>
          )}
        </>

        {/* Social Login Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-4 bg-card text-muted font-semibold tracking-widest">Oder</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <SocialButton icon={Globe} label="Google" />
          <SocialButton icon={Code} label="GitHub" />
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-muted mt-8">
          Mit der Anmeldung akzeptierst du unsere <br />
          <a href="#" className="underline hover:text-main">AGB</a> und <a href="#" className="underline hover:text-main">Datenschutzregeln</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;