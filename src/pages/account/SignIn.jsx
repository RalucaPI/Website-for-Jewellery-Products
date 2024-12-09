import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../context/Context';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../firebase/firebase';
import { Timestamp, addDoc, collection } from 'firebase/firestore';

export function SignIn() {
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [telefon, setTelefon] = useState("");
    const [adresa, setAdresa] = useState("");
    const [localitate, setLocalitate] = useState("");
    const context = useContext(Context);
    const { loading, setLoading } = context;

    const signup = async () => {
        setLoading(true);
        if (firstname === "" || email === "" || password === "" || telefon === "" || adresa === "" || localitate === "") {
            setLoading(false);
            return toast.error("All fields are required");
        }
        try {
            const users = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created:', users);
            const user = {
                nume: firstname,
                uid: users.user.uid,
                email: users.user.email,
                telefon: telefon,
                adresa: adresa,
                localitate: localitate,
                time: Timestamp.now()
            };
            const userRef = collection(database, "Conturi");
            await addDoc(userRef, user);
            console.log('User data added to Firestore');
            toast.success('Conectare cu succes', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            setFirstname("");
            setEmail("");
            setPassword("");
            setTelefon("");
            setAdresa("");
            setLocalitate("");
        } catch (error) {
            console.log('Error during signup:', error);
            toast.error('Eroare la inregistrare: ' + error.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } finally {
            setLoading(false);
            console.log('Signup process ended');
        }
    };
    return (
        <div className='fundal'>
            <div className='flex justify-center items-center h-screen'>
                <div className='backdrop-filter backdrop-blur-lg backdrop-filter-dark px-10 py-10 rounded-xl'>
                    <div>
                        <h1 className='text-center text-[#000000] text-xl mb-4 font-bold'>Inregistrare</h1>
                    </div>
                    <div>
                        <input
                            type="name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            className='bg-[#f9ffff] mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Nume si prenume'
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-[#f9ffff] mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Email'
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='bg-[#f9ffff] mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Parola'
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            value={telefon}
                            onChange={(e) => setTelefon(e.target.value)}
                            className='bg-[#f9ffff] mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Telefon'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={adresa}
                            onChange={(e) => setAdresa(e.target.value)}
                            className='bg-[#f9ffff] mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Adresa'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={localitate}
                            onChange={(e) => setLocalitate(e.target.value)}
                            className='bg-[#f9ffff] mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Localitate si judet'
                        />
                    </div>
                    <div className='flex justify-center mb-3'>
                        <button
                            onClick={signup}
                            className='bg-[#b7fbff] w-full text-black font-bold px-2 py-2 rounded-lg'
                        >
                            Sign in
                        </button>
                    </div>
                    <div>
                        <h2 className='text-black'>
                            Have an account? <Link className='text-[#061d1d] font-bold' to={'/conectare'}>Log in</Link>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
