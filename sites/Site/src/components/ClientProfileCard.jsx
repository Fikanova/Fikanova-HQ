import React from 'react';
import { Linkedin, Twitter, Instagram, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

/**
 * CLIENT PROFILE CARD (A2UI)
 * Used in the Impact/Case Study dashboard to show the 
 * "Digital Footprint" the agents are currently managing.
 */

const ClientProfileCard = ({ client }) => {
    return (
        <div className="bg-[#171924] border border-slate-800 rounded-2xl p-6 shadow-xl group">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 font-bold text-xl border border-blue-500/20">
                        {client.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-white font-bold">{client.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            Agent Managed
                        </div>
                    </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <ExternalLink size={16} />
                </button>
            </div>

            <div className="space-y-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Footprint</div>
                <div className="flex gap-2">
                    {client.linkedin && (
                        <a href={client.linkedin} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                            <Linkedin size={16} />
                        </a>
                    )}
                    {client.x && (
                        <a href={client.x} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                            <Twitter size={16} />
                        </a>
                    )}
                    {client.instagram && (
                        <a href={client.instagram} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-400/10 transition-all">
                            <Instagram size={16} />
                        </a>
                    )}
                    <a href={client.website} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-green-400 hover:bg-green-400/10 transition-all">
                        <Globe size={16} />
                    </a>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">CMO Audit Status</span>
                <span className="text-[9px] font-mono text-green-500 flex items-center gap-1">
                    <ShieldCheck size={10} /> VERIFIED
                </span>
            </div>
        </div>
    );
};

export default ClientProfileCard;
