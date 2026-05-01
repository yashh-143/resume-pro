import { useState } from "react";

export default function Builder() {
  const [data, setData] = useState({});
  const [paid, setPaid] = useState(false);

  const pay = async () => {
    const res = await fetch("/api/order",{method:"POST"});
    const order = await res.json();

    const rzp = new window.Razorpay({
      key:"YOUR_KEY",
      order_id:order.id,
      handler:()=>setPaid(true)
    });

    rzp.open();
  };

  const download = async () => {
    if(!paid) return alert("Pay first");

    const res = await fetch("/api/pdf",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div style={{padding:20}}>
      <input placeholder="Name" onChange={e=>setData({...data,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setData({...data,email:e.target.value})}/>
      <button onClick={pay}>Pay ₹49</button>
      <button onClick={download}>Download</button>

      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}