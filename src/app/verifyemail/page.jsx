import { useEffect, useState } from 'react'
import axios from 'axios';
import { set } from 'mongoose';
export default function page() {
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');

    const verifyEmail = async () => {
        try {
            const response = await fetch("/api/users/verifyemail",{token});
           setVerified(true);
        } catch (err) {
            setError('An error occurred while verifying your email');
        }
    }
    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || '');
    }, []);
    useEffect(() => {
        if(token.length > 0) {
            verifyEmail();
        }
    }, [token]);

  return (
    <div>
      <h1 className='text-center text-4xl'>verify Email</h1>
      <h2 className='m-5'>{token? <p>{token}</p>:<p>no token</p>}</h2>
      
    </div>
  )
}
