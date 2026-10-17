'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackBox(){
  const [val, setVal] = useState('');
  const router = useRouter();
  const go = () => {
    const clean = val.trim();
    if(!clean) return;
    router.push('/track?tracking='+encodeURIComponent(clean));
  };
  return(
    <div className="flex gap-2 max-w-lg">
      <input value={val} onChange={e=>setVal(e.target.value.toUpperCase())} onKeyDown={e=>{if(e.key==='Enter') go()}} placeholder="Enter Tracking e.g. TSC-JM-45649" className="flex-1 p-3 rounded-lg text-black border" />
      <button onClick={go} className="bg-orange-400 px-6 py-3 rounded-lg font-bold text-black">TRACK</button>
    </div>
  )
}
