import { useState } from "react";

const SubscribeForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Subscribing:", email);

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await response.json();
        if(response.ok){
            alert(data.message)
            setMessage(data.message);
            setEmail('');
            window.location.href = '/send-newsletter';
        }else if (response.status === 409) {
            // Handle conflict (email already registered)
            setMessage('Email already exists');  // Display "Email is already registered" message
        } 
        else{
            // throw new Error('Subscription failed');
            setMessage(data.message || "Subscription failed!")
        }

      } catch (error) {
        console.error('Error', error);
        setMessage('An error occurred. Please try again message.');
      }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                />
                <button type="submit">Subscribe</button>
            </form>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
}

export default SubscribeForm;