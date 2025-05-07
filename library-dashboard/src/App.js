import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 8 AM to 8 PM
const DAYS = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    key: date.toISOString().split('T')[0],
  };
});

export default function LibraryApp() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-8 py-6 flex items-center justify-center shadow">
        <h1 className="text-4xl font-bold"> LTU LIBRARY</h1>
      </nav>
    </div>
  );
}


