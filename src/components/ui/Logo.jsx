import React from 'react';

export const Logo = ({ onClick }) => (
    <div onClick={onClick} className="font-logo text-3xl font-bold tracking-tight uppercase flex items-center cursor-pointer">
        <span className="text-brand-blue">HAVEN</span>
        <span className="text-brand-black">GURT</span>
    </div>
);
