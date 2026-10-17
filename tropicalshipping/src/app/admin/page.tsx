'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string
);

const ADMIN_PASSWORD = 'tropical123';

type Shipment = {
  id?: number;
  tracking_number: string;
  status: string;
  origin: string;
  destination: string;
  customer_name: string;
  created_at?: string;
};

export default function AdminPage(){
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Shipment>({
    tracking_number: '',
    status: 'In Transit - Kingston to Lagos',
    origin: 'Jamaica',
    destination: 'Nigeria',
    customer_name: ''
  });
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(()=>{
    const saved = localStorage.getItem('admin_authed');
    if(saved === 'yes') setAuthed(true);
  },[]);

  const handleLogin = () => {
    if(passInput === ADMIN_PASSWORD){
      localStorage.setItem('admin_authed','yes');
      setAuthed(true);
      setMsg('');
    } else {
      alert('Wrong password');
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('shipments').select('*').order('created_at', { ascending: false }).limit(100);
    if(error) setMsg('Error: '+error.message);
    else setShipments(data as any);
    setLoading(false);
  };

  useEffect(()=>{ if(authed) fetchAll(); }, [authed]);

  const handleSave = async () => {
    if(!form.tracking_number.trim() || !form.customer_name.trim()){
      setMsg('Tracking number and Customer name required');
      return;
    }
    setMsg('Saving...');
    if(editing){
      const { error } = await supabase.from('shipments').update({
        status: form.status,
        origin: form.origin,
        destination: form.destination,
        customer_name: form.customer_name,
        tracking_number: form.tracking_number
      }).eq('tracking_number', editing);
      if(error){ setMsg('Error: '+error.message); return; }
      setMsg('Updated '+form.tracking_number);
    } else {
      const { error } = await supabase.from('shipments').insert([form]);
      if(error){ setMsg('Error: '+error.message); return; }
      setMsg('Created '+form.tracking_number);
    }
    setForm({ tracking_number: '', status: 'In Transit - Kingston to Lagos', origin: 'Jamaica', destination: 'Nigeria', customer_name: '' });
    setEditing(null);
    fetchAll();
  };

  const handleEdit = (s: Shipment) => {
    setForm(s);
    setEditing(s.tracking_number);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMsg('Editing '+s.tracking_number);
  };

  const handleDelete = async (tracking: string) => {
    if(!confirm('Delete '+tracking+' ?')) return;
    const { error } = await supabase.from('shipments').delete().eq('tracking_number', tracking);
    if(error) setMsg('Delete error: '+error.message);
    else { setMsg('Deleted '+tracking); fetchAll(); }
  };

  const filtered = shipments.filter(s => 
    s.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
    s.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  if(!authed){
    return(
      <div className="min-h-screen bg-[#0a2a5e] text-white flex items-center justify-center p-4">
        <div className="bg-white text-black p-8 rounded-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-600 mb-4 text-sm">Enter password to manage shipments</p>
          <input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="Password" className="w-full border p-3 rounded-lg mb-3" onKeyDown={e=>{if(e.key==='Enter') handleLogin()}} />
          <button onClick={handleLogin} className="w-full bg-orange-400 py-3 rounded-lg font-bold">LOGIN</button>
          <p className="text-xs text-gray-500 mt-3">Default: tropical123 - change in code later</p>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-[#0a2a5e] text-white p-4 md:p-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin - Shipments</h1>
          <p className="text-white/70">Add, edit, delete tracking numbers. Customers see changes instantly on /track</p>
        </div>
        <button onClick={()=>{localStorage.removeItem('admin_authed'); setAuthed(false);}} className="bg-white/10 px-3 py-1 rounded text-sm">Logout</button>
      </div>

      {msg && <div className="bg-yellow-100 text-black p-3 rounded-lg mb-4 max-w-2xl">{msg}</div>}

      <div className="bg-white text-black p-6 rounded-xl max-w-2xl mb-8 space-y-3">
        <h2 className="font-bold text-lg">{editing ? 'Edit: '+editing : 'Add New Shipment'}</h2>
        <input className="w-full border p-3 rounded-lg" placeholder="Tracking Number e.g. TSC-JM-45649" value={form.tracking_number} onChange={e=>setForm({...form, tracking_number: e.target.value.toUpperCase()})} />
        <input className="w-full border p-3 rounded-lg" placeholder="Customer Name" value={form.customer_name} onChange={e=>setForm({...form, customer_name: e.target.value})} />
        <input className="w-full border p-3 rounded-lg" placeholder="Status e.g. In Transit - Kingston to Lagos" value={form.status} onChange={e=>setForm({...form, status: e.target.value})} />
        <div className="flex gap-2">
          <input className="flex-1 border p-3 rounded-lg" placeholder="Origin" value={form.origin} onChange={e=>setForm({...form, origin: e.target.value})} />
          <input className="flex-1 border p-3 rounded-lg" placeholder="Destination" value={form.destination} onChange={e=>setForm({...form, destination: e.target.value})} />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-orange-400 px-6 py-3 rounded-lg font-bold flex-1">{editing ? 'UPDATE' : 'CREATE SHIPMENT'}</button>
          {editing && <button onClick={()=>{setEditing(null); setForm({ tracking_number: '', status: 'In Transit - Kingston to Lagos', origin: 'Jamaica', destination: 'Nigeria', customer_name: '' }); setMsg('');}} className="bg-gray-200 px-6 py-3 rounded-lg">Cancel</button>}
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="flex gap-2 mb-4">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tracking or customer..." className="flex-1 p-3 rounded-lg text-black" />
          <button onClick={fetchAll} className="bg-white/20 px-4 rounded-lg">Refresh</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="bg-white text-black rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Tracking</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s=>(
                    <tr key={s.tracking_number} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-bold text-green-700">{s.tracking_number}</td>
                      <td className="p-3">{s.customer_name}</td>
                      <td className="p-3">{s.status}</td>
                      <td className="p-3 flex gap-2">
                        <button onClick={()=>handleEdit(s)} className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={()=>handleDelete(s.tracking_number)} className="bg-red-600 text-white px-3 py-1 rounded">Del</button>
                        <a href={`/track?tracking=${s.tracking_number}`} target="_blank" className="bg-gray-200 px-3 py-1 rounded">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length===0 && <p className="p-6 text-center text-gray-500">No shipments found</p>}
          </div>
        )}
      </div>
    </div>
  )
}
