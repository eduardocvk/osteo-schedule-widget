
import React from 'react';
import BookingWidget from '@/components/BookingWidget';
import { useLocation } from 'react-router-dom';

const Widget = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const theme = params.get('theme') || 'light';
  const lang = params.get('lang') || 'es';
  const apiKey = params.get('apiKey');
  
  return (
    <div className={`h-screen w-full p-2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <BookingWidget allowAdmin={false} />
    </div>
  );
};

export default Widget;
