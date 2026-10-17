'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string);

export default function BookPage(){
  const [form,setForm]=useState({name:'',phone:'',origin:'Miami, FL',destination:'Kingston, JM',pkg:''});
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState('');
  const handleBook=async()=>{
    if(!form.name||!form.phone) return alert('Enter name and phone');
    setLoading(true);
    const num=`TSC-JM-${Math.floor(10000+Math.random()*90000)}`;
    const {error}=await supabase.from('shipments').insert({tracking_number:num,status:`Booking Received - ${form.name}`,origin:form.origin,destination:form.destination,customer_name:form.name,customer_phone:form.phone,package_desc:form.pkg});
    if(error) alert(error.message); else setResult(num);
    setLoading(false);
  };
  if(result){
    return(
      <div className="min-h-screen bg-[#0a2a5e] flex items-center justify-center p-8">
        <div className="bg-white text-black p-8 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-green-600">✅ Booking Confirmed!</h2>
          <p className="text-2xl font-bold bg-gray-100 p-3 rounded-lg my-4">{result}</p>
          <button onClick={()=>{ window.location.href=`/track?tracking=${result}` }} className="bg-orange-400 px-8 py-3 rounded-full font-bold w-full">TRACK NOW</button>
        </div>
      </div>
    )
  }
  return(
    <div className="min-h-screen bg-[#0a2a5e] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Book a Shipment</h1>
      <div className="bg-white text-black p-6 rounded-xl max-w-md space-y-4">
        <input placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border p-3 rounded-lg" />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full border p-3 rounded-lg" />
        <input placeholder="Package e.g. 2 barrels" value={form.pkg} onChange={e=>setForm({...form,pkg:e.target.value})} className="w-full border p-3 rounded-lg" />
        <button onClick={handleBook} className="w-full bg-orange-400 py-3 rounded-full font-bold text-black">{loading?'Booking...':'BOOK & GET TRACKING NUMBER'}</button>
      </div>
    </div>
  )
}