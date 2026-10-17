'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string
);

export default function TrackPage(){
  const [input,setInput]=useState('');
  const [data,setData]=useState<any>(null);
  const [msg,setMsg]=useState('');

  const doTrack = async (t:string) => {
    const clean = t.trim();
    if(!clean){ setMsg('Enter tracking number'); return; }
    setMsg('Searching '+clean+'...');
    setData(null);
    const { data, error } = await supabase.from('shipments').select('*').eq('tracking_number', clean).maybeSingle();
    if(error){ setMsg('Supabase error: '+error.message); return; }
    if(!data){ setMsg('Not found: '+clean); return; }
    setData(data);
    setMsg('Found!');
  };

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const url = params.get('tracking');
    if(url){ setInput(url); doTrack(url); }
  },[]);

  return(
    <div className="min-h-screen bg-[#0a2a5e] text-white p-8">
      <h1 className="text-3xl font-bold">Track Shipment</h1>
      <div className="flex gap-2 max-w-lg mt-6 mb-4">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="TSC-JM-..." className="flex-1 p-3 rounded-lg text-black" />
        <button onClick={()=>doTrack(input)} className="bg-orange-400 px-6 py-3 rounded-lg text-black font-bold">TRACK</button>
      </div>
      {msg && <div className="bg-yellow-100 text-black p-3 rounded-lg max-w-lg mb-4">{msg}</div>}
      {data && (
        <div className="bg-white text-black p-6 rounded-xl max-w-lg space-y-2">
          <p className="font-bold text-xl text-green-700">{data.tracking_number}</p>
          <p><b>Status:</b> {data.status}</p>
          <p><b>Route:</b> {data.origin} to {data.destination}</p>
          <p><b>Customer:</b> {data.customer_name}</p>
        </div>
      )}
    </div>
  )
}
