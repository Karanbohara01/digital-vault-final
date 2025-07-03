


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const RegisterPage = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('customer');
//     const [showPassword, setShowPassword] = useState(false);
//     const [isEmailValid, setIsEmailValid] = useState(false);
//     const [passwordValidity, setPasswordValidity] = useState({
//         minLength: false,
//         hasUpper: false,
//         hasLower: false,
//         hasNumber: false,
//         hasSpecial: false,
//     });
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         setPasswordValidity({
//             minLength: password.length >= 8,
//             hasUpper: /[A-Z]/.test(password),
//             hasLower: /[a-z]/.test(password),
//             hasNumber: /[0-9]/.test(password),
//             hasSpecial: /[^A-Za-z0-9]/.test(password),
//         });
//     }, [password]);

//     useEffect(() => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         setIsEmailValid(emailRegex.test(email));
//     }, [email]);


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);
//         setIsSubmitting(true);

//         try {
//             const response = await fetch('/api/users/register', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ name, email, password, role }),
//             });

//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to register');
//             }

//             // --- THIS IS THE CHANGE ---
//             // We now just set the success message and do not redirect.
//             setSuccess(data.message);

//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//     const isPasswordValid = Object.values(passwordValidity).every(Boolean);
//     const isFormValid = isPasswordValid && isEmailValid && name.length > 0;

//     const PasswordRequirement = ({ isValid, text }) => (
//         <li style={{
//             color: isValid ? '#10B981' : '#6B7280',
//             fontSize: '0.8rem',
//             display: 'flex',
//             alignItems: 'center',
//             marginBottom: '4px',
//             transition: 'color 0.2s ease',
//         }}>
//             <span style={{ marginRight: '6px' }}>
//                 {isValid ? '✓' : '•'}
//             </span>
//             {text}
//         </li>
//     );

//     return (
//         <div style={{
//             minHeight: '100vh',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#F9FAFB',
//             fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//             padding: '1rem',
//         }}>
//             <div style={{
//                 width: '100%',
//                 maxWidth: '440px',
//                 backgroundColor: '#FFFFFF',
//                 padding: '2.5rem',
//                 borderRadius: '0.5rem',
//                 boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
//                 border: '1px solid #E5E7EB',
//             }}>
//                 <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//                     <h2 style={{
//                         fontSize: '1.5rem',
//                         fontWeight: '600',
//                         color: '#111827',
//                         marginBottom: '0.5rem',
//                     }}>
//                         Create your account
//                     </h2>
//                     <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
//                         Join our platform to get started
//                     </p>
//                 </div>

//                 {error && (
//                     <div style={{
//                         backgroundColor: '#FEE2E2',
//                         color: '#B91C1C',
//                         padding: '0.75rem',
//                         borderRadius: '0.375rem',
//                         marginBottom: '1.5rem',
//                         fontSize: '0.875rem',
//                         display: 'flex',
//                         alignItems: 'center',
//                     }}>
//                         <span style={{ marginRight: '0.5rem' }}>⚠️</span>
//                         {error}
//                     </div>
//                 )}

//                 {success && (
//                     <div style={{
//                         backgroundColor: '#D1FAE5',
//                         color: '#065F46',
//                         padding: '0.75rem',
//                         borderRadius: '0.375rem',
//                         marginBottom: '1.5rem',
//                         fontSize: '0.875rem',
//                         display: 'flex',
//                         alignItems: 'center',
//                     }}>
//                         <span style={{ marginRight: '0.5rem' }}>✓</span>
//                         {success}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                     <div style={{ marginBottom: '1.25rem' }}>
//                         <label htmlFor="name" style={{
//                             display: 'block',
//                             fontSize: '0.875rem',
//                             fontWeight: '500',
//                             color: '#374151',
//                             marginBottom: '0.5rem',
//                             placeholder: 'Enter your full name',
//                         }}>

//                         </label>
//                         <input
//                             id="name"
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                             style={{
//                                 width: '100%',
//                                 padding: '0.625rem',
//                                 border: '1px solid #D1D5DB',
//                                 borderRadius: '0.375rem',
//                                 fontSize: '0.875rem',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                             }}
//                             placeholder="Full Name"
//                         />
//                     </div>

//                     <div style={{ marginBottom: '1.25rem' }}>
//                         <label htmlFor="email" style={{
//                             display: 'block',
//                             fontSize: '0.875rem',
//                             fontWeight: '500',
//                             color: '#374151',
//                             marginBottom: '0.5rem',
//                         }}>

//                         </label>
//                         <input
//                             id="email"
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             style={{
//                                 width: '100%',
//                                 padding: '0.625rem',
//                                 border: `1px solid ${email.length > 0 ? (isEmailValid ? '#A7F3D0' : '#FECACA') : '#D1D5DB'}`,
//                                 borderRadius: '0.375rem',
//                                 fontSize: '0.875rem',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                             }}
//                             placeholder="Enter your email address"
//                         />
//                         {email.length > 0 && (
//                             <p style={{
//                                 color: isEmailValid ? '#10B981' : '#EF4444',
//                                 fontSize: '0.75rem',
//                                 marginTop: '0.25rem',
//                             }}>
//                                 {isEmailValid ? 'Valid email address' : 'Please enter a valid email'}
//                             </p>
//                         )}
//                     </div>

//                     <div style={{ marginBottom: '1.25rem' }}>
//                         <label htmlFor="password" style={{
//                             display: 'block',
//                             fontSize: '0.875rem',
//                             fontWeight: '500',
//                             color: '#374151',
//                             marginBottom: '0.5rem',
//                         }}>

//                         </label>
//                         <div style={{ position: 'relative' }}>
//                             <input
//                                 id="password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 style={{
//                                     width: '93%',
//                                     padding: '0.625rem',
//                                     border: `1px solid ${password.length > 0 ? (isPasswordValid ? '#A7F3D0' : '#FECACA') : '#D1D5DB'}`,
//                                     borderRadius: '0.375rem',
//                                     fontSize: '0.875rem',
//                                     outline: 'none',
//                                     transition: 'border-color 0.2s',
//                                     paddingRight: '2.5rem',
//                                 }}
//                                 placeholder="Password"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 style={{
//                                     position: 'absolute',
//                                     right: '0.625rem',
//                                     top: '50%',
//                                     transform: 'translateY(-50%)',
//                                     background: 'none',
//                                     border: 'none',
//                                     cursor: 'pointer',
//                                     color: '#6B7280',
//                                     fontSize: '0.875rem',
//                                 }}
//                                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//                             >
//                                 {showPassword ? 'Hide' : 'Show'}
//                             </button>
//                         </div>
//                         {password && (
//                             <ul style={{
//                                 marginTop: '0.5rem',
//                                 paddingLeft: '1.25rem',
//                             }}>
//                                 <PasswordRequirement
//                                     isValid={passwordValidity.minLength}
//                                     text="At least 8 characters"
//                                 />
//                                 <PasswordRequirement
//                                     isValid={passwordValidity.hasLower}
//                                     text="Lowercase letter (a-z)"
//                                 />
//                                 <PasswordRequirement
//                                     isValid={passwordValidity.hasUpper}
//                                     text="Uppercase letter (A-Z)"
//                                 />
//                                 <PasswordRequirement
//                                     isValid={passwordValidity.hasNumber}
//                                     text="Number (0-9)"
//                                 />
//                                 <PasswordRequirement
//                                     isValid={passwordValidity.hasSpecial}
//                                     text="Special character (!@#$%^&*)"
//                                 />
//                             </ul>
//                         )}
//                     </div>

//                     <div style={{ marginBottom: '1.5rem' }}>
//                         <label htmlFor="role" style={{
//                             display: 'block',
//                             fontSize: '0.875rem',
//                             fontWeight: '500',
//                             color: '#374151',
//                             marginBottom: '0.5rem',

//                         }}>

//                         </label>
//                         <label htmlFor="name">Select your role</label><br />

//                         <select

//                             id="role"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             style={{

//                                 width: '105%',
//                                 padding: '0.625rem',
//                                 border: '1px solid #D1D5DB',
//                                 borderRadius: '0.375rem',
//                                 fontSize: '0.875rem',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 backgroundColor: '#FFFFFF',
//                                 cursor: 'pointer',
//                                 marginTop: '0.25rem',

//                             }}

//                         >
//                             <option value="customer">Customer</option>
//                             <option value="creator">Creator</option>
//                         </select>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={!isFormValid || isSubmitting}
//                         style={{
//                             width: '100%',
//                             padding: '0.75rem',
//                             backgroundColor: isFormValid ? '#3B82F6' : '#E5E7EB',
//                             color: isFormValid ? '#FFFFFF' : '#9CA3AF',
//                             border: 'none',
//                             borderRadius: '0.375rem',
//                             fontSize: '0.875rem',
//                             fontWeight: '500',
//                             cursor: isFormValid ? 'pointer' : 'not-allowed',
//                             transition: 'background-color 0.2s',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}
//                     >
//                         {isSubmitting ? (
//                             <>
//                                 <svg style={{
//                                     width: '1rem',
//                                     height: '1rem',
//                                     marginRight: '0.5rem',
//                                     animation: 'spin 1s linear infinite',
//                                 }} viewBox="0 0 24 24">
//                                     <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeDasharray="31.415, 31.415" opacity="0.25" />
//                                     <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeDasharray="15.7, 31.415" />
//                                 </svg>
//                                 Processing...
//                             </>
//                         ) : 'Create Account'}
//                     </button>

//                     <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         margin: '1.5rem 0',
//                         color: '#D1D5DB',
//                     }}>
//                         <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
//                         <span style={{ padding: '0 1rem', fontSize: '0.75rem' }}>OR</span>
//                         <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
//                     </div>

//                     <button
//                         type="button"
//                         onClick={() => alert("Google login coming soon!")}
//                         style={{
//                             width: '100%',
//                             padding: '0.75rem',
//                             backgroundColor: '#FFFFFF',
//                             color: '#374151',
//                             border: '1px solid #D1D5DB',
//                             borderRadius: '0.375rem',
//                             fontSize: '0.875rem',
//                             fontWeight: '500',
//                             cursor: 'pointer',
//                             transition: 'background-color 0.2s',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             marginBottom: '1.5rem',
//                         }}
//                     >
//                         <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} viewBox="0 0 24 24">
//                             <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                             <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                             <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                             <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                         </svg>
//                         Continue with Google
//                     </button>

//                     <p style={{
//                         textAlign: 'center',
//                         fontSize: '0.875rem',
//                         color: '#6B7280',
//                     }}>
//                         Already have an account?{' '}
//                         <Link to="/login" style={{
//                             color: '#3B82F6',
//                             fontWeight: '500',
//                             textDecoration: 'none',
//                         }}>
//                             Sign in
//                         </Link>
//                     </p>
//                 </form>
//             </div>

//             <style>{`
//                 @keyframes spin {
//                     from { transform: rotate(0deg); }
//                     to { transform: rotate(360deg); }
//                 }
//                 input:focus, select:focus {
//                     border-color: #3B82F6 !important;
//                     box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default RegisterPage;


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const getPlaceholderImage = (index, width = 600, height = 800) => {
//     return `https://picsum.photos/${width}/${height}?random=${index}`;
// };

// const RegisterPage = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('customer');
//     const [showPassword, setShowPassword] = useState(false);
//     const [isEmailValid, setIsEmailValid] = useState(false);
//     const [passwordValidity, setPasswordValidity] = useState({
//         minLength: false,
//         hasUpper: false,
//         hasLower: false,
//         hasNumber: false,
//         hasSpecial: false,
//     });
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         setPasswordValidity({
//             minLength: password.length >= 8,
//             hasUpper: /[A-Z]/.test(password),
//             hasLower: /[a-z]/.test(password),
//             hasNumber: /[0-9]/.test(password),
//             hasSpecial: /[^A-Za-z0-9]/.test(password),
//         });
//     }, [password]);

//     useEffect(() => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         setIsEmailValid(emailRegex.test(email));
//     }, [email]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);
//         setIsSubmitting(true);

//         try {
//             const response = await fetch('/api/users/register', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ name, email, password, role }),
//             });

//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to register');
//             }

//             setSuccess(data.message);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const isPasswordValid = Object.values(passwordValidity).every(Boolean);
//     const isFormValid = isPasswordValid && isEmailValid && name.length > 0;

//     const PasswordRequirement = ({ isValid, text }) => (
//         <li style={{
//             color: isValid ? '#10B981' : '#6B7280',
//             fontSize: '0.8rem',
//             display: 'flex',
//             alignItems: 'center',
//             marginBottom: '4px',
//         }}>
//             <span style={{ marginRight: '6px' }}>{isValid ? '✓' : '•'}</span>
//             {text}
//         </li>
//     );

//     return (
//         <div style={{
//             minHeight: '100vh',
//             display: 'flex',
//             fontFamily: "'Inter', sans-serif",
//         }}>
//             {/* Left image panel */}
//             <div style={{
//                 flex: 1,
//                 backgroundImage: `url(${getPlaceholderImage(12)})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 borderTopRightRadius: '1rem',
//                 borderBottomRightRadius: '1rem',
//             }} />

//             {/* Right form panel */}
//             <div style={{
//                 flex: 1,
//                 maxWidth: '500px',
//                 margin: 'auto',
//                 padding: '3rem 2rem',
//                 backgroundColor: '#fff',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                 borderRadius: '1rem',
//             }}>
//                 <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//                     <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827' }}>
//                         Create your account
//                     </h2>
//                     <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
//                         Join our platform to get started
//                     </p>
//                 </div>

//                 {error && (
//                     <div style={{
//                         backgroundColor: '#FEE2E2',
//                         color: '#B91C1C',
//                         padding: '0.75rem',
//                         borderRadius: '6px',
//                         marginBottom: '1.5rem',
//                         fontSize: '0.875rem',
//                         display: 'flex',
//                         alignItems: 'center',
//                     }}>
//                         ⚠️ {error}
//                     </div>
//                 )}

//                 {success && (
//                     <div style={{
//                         backgroundColor: '#D1FAE5',
//                         color: '#065F46',
//                         padding: '0.75rem',
//                         borderRadius: '6px',
//                         marginBottom: '1.5rem',
//                         fontSize: '0.875rem',
//                         display: 'flex',
//                         alignItems: 'center',
//                     }}>
//                         ✅ {success}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                         placeholder="Full Name"
//                         style={inputStyle}
//                     />

//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         placeholder="Email address"
//                         style={{
//                             ...inputStyle,
//                             borderColor: email.length > 0
//                                 ? isEmailValid ? '#A7F3D0' : '#FECACA'
//                                 : '#D1D5DB'
//                         }}
//                     />
//                     {email.length > 0 && (
//                         <p style={{
//                             fontSize: '0.75rem',
//                             color: isEmailValid ? '#10B981' : '#EF4444',
//                             marginBottom: '1rem',
//                         }}>
//                             {isEmailValid ? 'Valid email address' : 'Invalid email format'}
//                         </p>
//                     )}

//                     <div style={{ position: 'relative' }}>
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                             placeholder="Password"
//                             style={{
//                                 ...inputStyle,
//                                 paddingRight: '3.5rem',
//                                 borderColor: password.length > 0
//                                     ? isPasswordValid ? '#A7F3D0' : '#FECACA'
//                                     : '#D1D5DB',
//                             }}
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             style={{
//                                 position: 'absolute',
//                                 top: '50%',
//                                 right: '1rem',
//                                 transform: 'translateY(-50%)',
//                                 background: 'none',
//                                 border: 'none',
//                                 color: '#6B7280',
//                                 cursor: 'pointer',
//                                 fontSize: '0.875rem',
//                             }}
//                         >
//                             {showPassword ? 'Hide' : 'Show'}
//                         </button>
//                     </div>

//                     <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
//                         <PasswordRequirement isValid={passwordValidity.minLength} text="At least 8 characters" />
//                         <PasswordRequirement isValid={passwordValidity.hasLower} text="Lowercase letter" />
//                         <PasswordRequirement isValid={passwordValidity.hasUpper} text="Uppercase letter" />
//                         <PasswordRequirement isValid={passwordValidity.hasNumber} text="Number (0-9)" />
//                         <PasswordRequirement isValid={passwordValidity.hasSpecial} text="Special character (!@#$%)" />
//                     </ul>

//                     <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>
//                         Select your role
//                     </label>
//                     <select
//                         value={role}
//                         onChange={(e) => setRole(e.target.value)}
//                         style={{
//                             ...inputStyle,
//                             cursor: 'pointer',
//                             backgroundColor: '#fff',
//                         }}
//                     >
//                         <option value="customer">Customer</option>
//                         <option value="creator">Creator</option>
//                     </select>

//                     <button
//                         type="submit"
//                         disabled={!isFormValid || isSubmitting}
//                         style={{
//                             width: '100%',
//                             padding: '0.75rem',
//                             backgroundColor: isFormValid ? '#3B82F6' : '#E5E7EB',
//                             color: isFormValid ? '#fff' : '#9CA3AF',
//                             border: 'none',
//                             borderRadius: '6px',
//                             fontWeight: '600',
//                             fontSize: '0.9rem',
//                             cursor: isFormValid ? 'pointer' : 'not-allowed',
//                             marginTop: '1.25rem',
//                             transition: 'background-color 0.2s ease',
//                         }}
//                     >
//                         {isSubmitting ? 'Creating...' : 'Create Account'}
//                     </button>

//                     <p style={{
//                         textAlign: 'center',
//                         fontSize: '0.85rem',
//                         marginTop: '1.5rem',
//                         color: '#6B7280'
//                     }}>
//                         Already have an account?{' '}
//                         <Link to="/login" style={{
//                             color: '#3B82F6',
//                             textDecoration: 'none',
//                             fontWeight: '500',
//                         }}>
//                             Sign in
//                         </Link>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// const inputStyle = {
//     width: '100%',
//     padding: '0.75rem',
//     border: '1px solid #D1D5DB',
//     borderRadius: '6px',
//     fontSize: '0.875rem',
//     marginBottom: '1rem',
//     outline: 'none',
//     transition: 'border-color 0.3s ease',
// };

// export default RegisterPage;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState({
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const getPlaceholderImage = (index, width = 600, height = 400) => {
        return `https://picsum.photos/${width}/${height}?random=${index}`;
    };

    useEffect(() => {
        setPasswordValidity({
            minLength: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[^A-Za-z0-9]/.test(password),
        });
    }, [password]);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email));
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            setSuccess(data.message);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPasswordValid = Object.values(passwordValidity).every(Boolean);
    const isFormValid = isPasswordValid && isEmailValid && name.length > 0;

    const PasswordRequirement = ({ isValid, text }) => (
        <li style={{
            color: isValid ? '#10B981' : '#6B7280',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '4px',
            transition: 'color 0.2s ease',
        }}>
            <span style={{ marginRight: '6px' }}>
                {isValid ? '✓' : '•'}
            </span>
            {text}
        </li>
    );

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#FFFFFF',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            {/* Image Section */}
            <div style={{
                flex: 1,
                backgroundImage: `url(${getPlaceholderImage(1, 1200, 800)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'none', md: 'block' },
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '40px',
                    color: 'white',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>Photo by</div>
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>Random User</div>
                </div>
            </div>

            {/* Form Section */}
            <div style={{
                width: '440px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '8px',
                    }}>
                        Join our community
                    </h2>
                    <p style={{
                        color: '#6B7280',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }}>
                        Create your account to get started
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        color: '#B91C1C',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        backgroundColor: '#D1FAE5',
                        color: '#065F46',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            placeholder="Full Name"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: `1px solid ${email.length > 0 ? (isEmailValid ? '#A7F3D0' : '#FECACA') : '#E5E7EB'}`,
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            placeholder="Email address"
                        />
                        {email.length > 0 && (
                            <p style={{
                                color: isEmailValid ? '#10B981' : '#EF4444',
                                fontSize: '12px',
                                marginTop: '4px',
                            }}>
                                {isEmailValid ? 'Valid email address' : 'Please enter a valid email'}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: `1px solid ${password.length > 0 ? (isPasswordValid ? '#A7F3D0' : '#FECACA') : '#E5E7EB'}`,
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6B7280',
                                    fontSize: '14px',
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {password && (
                            <ul style={{
                                marginTop: '8px',
                                paddingLeft: '20px',
                            }}>
                                <PasswordRequirement
                                    isValid={passwordValidity.minLength}
                                    text="At least 8 characters"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasLower}
                                    text="Lowercase letter (a-z)"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasUpper}
                                    text="Uppercase letter (A-Z)"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasNumber}
                                    text="Number (0-9)"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasSpecial}
                                    text="Special character (!@#$%^&*)"
                                />
                            </ul>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="role" style={{
                            display: 'block',
                            fontSize: '14px',
                            color: '#374151',
                            marginBottom: '8px',
                        }}>
                            Select your role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: '#FFFFFF',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="customer">Customer</option>
                            <option value="creator">Creator</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: isFormValid ? '#111827' : '#E5E7EB',
                            color: isFormValid ? '#FFFFFF' : '#9CA3AF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.2s',
                            marginBottom: '24px',
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <span style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    marginRight: '8px',
                                    border: '2px solid transparent',
                                    borderTopColor: '#FFFFFF',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    verticalAlign: 'middle',
                                }} />
                                Processing...
                            </>
                        ) : 'Create Account'}
                    </button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '24px 0',
                        color: '#E5E7EB',
                    }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                        <span style={{ padding: '0 12px', fontSize: '12px', color: '#6B7280' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                    </div>

                    <button
                        type="button"
                        onClick={() => alert("Google login coming soon!")}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#FFFFFF',
                            color: '#374151',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px',
                        }}
                    >
                        <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#6B7280',
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: '#111827',
                        fontWeight: '500',
                        textDecoration: 'none',
                        borderBottom: '1px solid #9CA3AF',
                    }}>
                        Sign in
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                input:focus, select:focus {
                    border-color: #111827 !important;
                    box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.5);
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;