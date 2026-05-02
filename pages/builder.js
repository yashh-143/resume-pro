import { useState, useEffect } from "react";

export default function Builder() {
  const [data, setData] = useState({});
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fix: load Razorpay script properly via useEffect, not a bare <script> tag in JSX
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const pay = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/order", { method: "POST" });
      const order = await res.json();

      const rzp = new window.Razorpay({
        // Fix: use NEXT_PUBLIC_ env var instead of hardcoded "YOUR_KEY"
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.id,
        name: "ResumePro",
        description: "Resume Download",
        handler: () => {
          setPaid(true);
          alert("Payment successful! You can now download your resume.");
        },
        prefill: {
          name: data.name || "",
          email: data.email || "",
        },
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!paid) return alert("Please complete payment first.");

    try {
      setLoading(true);
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h2>Build Your Resume</h2>
      <input
        placeholder="Name"
        style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <input
        placeholder="Email"
        style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <button onClick={pay} disabled={loading} style={{ marginRight: 10 }}>
        {loading ? "Processing..." : "Pay ₹49"}
      </button>
      <button onClick={download} disabled={loading || !paid}>
        {loading ? "Generating..." : "Download PDF"}
      </button>
    </div>
  );
}
