'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home(){
 const [num,setNum]=useState('');
 const router = useRouter();
 const go = () => {
   const clean = num.trim();
   if(!clean) return;
   router.push(`/track?tracking=${encodeURIComponent(clean)}`);
 };
 return (
  <div className="min-h-screen bg-white">
   <header className="bg-[#0A4DA1] text-white p-4 flex justify-between items-center">
    <div className="font-black leading-tight">TROPICAL<br/>SHIPPING</div>
    <div className="flex gap-3"><a href="/book" className="bg-white text-[#0A4DA1] px-4 py-2 rounded font-bold">Book</a><a href="/track" className="bg-[#FFC400] text-black px-4 py-2 rounded font-bold">Track</a></div>
   </header>
   <section className="bg-[#0A4DA1] text-white py-20 text-center px-4">
    <h1 className="text-5xl font-black">USA -&gt; CARIBBEAN</h1>
    <p className="mt-4 text-xl">Barrels, Boxes & Containers - Jamaica to Nigeria</p>
    <div className="mt-10 max-w-xl mx-auto bg-white p-2 rounded-xl flex gap-2">
     <input value={num} onChange={e=>setNum(e.target.value.toUpperCase())} onKeyDown={e=>{if(e.key==='Enter') go()}} placeholder="Enter Tracking e.g. TSC-JM-45649" className="flex-1 p-3 rounded-lg text-black outline-none" />
     <button onClick={go} className="bg-[#FFC400] text-black px-8 py-3 rounded-lg font-black">TRACK</button>
    </div>
    <a href="/book" className="inline-block mt-8 bg-[#FFC400] text-black px-8 py-3 rounded-lg font-bold">Book a Shipment</a>
   </section>
  </div>
 )
}
