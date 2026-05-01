import Razorpay from "razorpay";

export default async function handler(req,res){
  const razorpay = new Razorpay({
    key_id: process.env.KEY,
    key_secret: process.env.SECRET,
  });

  const order = await razorpay.orders.create({
    amount:4900,
    currency:"INR"
  });

  res.json(order);
}