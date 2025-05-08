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
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('patron');
  const [patronCount, setPatronCount] = useState(42);
  const [reservations, setReservations] = useState({ room1: {}, room2: {} });
  const [selectedRoom, setSelectedRoom] = useState('room1');
  const [selectedSlot, setSelectedSlot] = useState({ day: '', hour: null });
  const [name, setName] = useState('');

  const handleSelectSlot = (day, hour) => setSelectedSlot({ day, hour });

  const handleReserve = () => {
    if (!name || !selectedSlot.day || selectedSlot.hour === null) return;
    setReservations(prev => {
      const updated = { ...prev };
      const room = updated[selectedRoom];
      if (!room[selectedSlot.day]) room[selectedSlot.day] = {};
      if (!room[selectedSlot.day][selectedSlot.hour]) {
        room[selectedSlot.day][selectedSlot.hour] = name;
      }
      return updated;
    });
    setName('');
    setSelectedSlot({ day: '', hour: null });
  };

  const handleDeleteReservation = (room, day, hour) => {
    setReservations(prev => {
      const updated = { ...prev };
      if (updated[room][day]) {
        delete updated[room][day][hour];
        if (Object.keys(updated[room][day]).length === 0) {
          delete updated[room][day];
        }
      }
      return updated;
    });
  };

  const isReserved = (room, day, hour) => {
    return reservations[room]?.[day]?.[hour];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-8 py-6 flex items-center justify-center shadow">
        <h1 className="text-4xl font-bold"> LTU LIBRARY</h1>
      </nav>

      {/* Tabs */}
      <div className="bg-white shadow-md flex justify-center space-x-4 p-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'patron' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
          onClick={() => setActiveTab('patron')}
        >
          👥 Patron Count
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'rooms' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
          onClick={() => setActiveTab('rooms')}
        >
          🏫 Study Rooms
        </button>
        <button
          className={`px-4 py-2 rounded`}
          onClick={() => setIsAdmin(!isAdmin)}
        >
          {isAdmin ? 'User View' : 'Admin Panel'}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* Patron Count Tab */}
        {activeTab === 'patron' && (
          <Card>
            <CardContent className="p-6 text-center space-y-2">
              <h2 className="text-2xl font-semibold text-gray-700">Current Patron Count</h2>
              {isAdmin ? (
                <Input
                  type="number"
                  value={patronCount}
                  onChange={e => setPatronCount(parseInt(e.target.value) || 0)}
                />
              ) : (
                <p className="text-6xl font-bold text-green-600">{patronCount}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Study Rooms Tab */}
        {activeTab === 'rooms' && (
          <>
            {['room1', 'room2'].map(room => (
              <Card key={room}>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    {room === 'room1' ? '📖 Study Room 1' : '📘 Study Room 2'} Weekly Schedule
                  </h2>
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-8 min-w-[800px] border rounded">
                      <div className="bg-gray-200 font-semibold text-sm p-2 text-center">Time</div>
                      {DAYS.map(day => (
                        <div key={day.key} className="bg-gray-200 font-semibold text-sm p-2 text-center">
                          {day.label}
                        </div>
                      ))}
                      {HOURS.map(hour => (
                        <React.Fragment key={hour}>
                          <div className="bg-gray-100 p-2 text-sm text-center font-medium">
                            {hour}:00
                          </div>
                          {DAYS.map(day => {
                            const reserved = isReserved(room, day.key, hour);
                            const isSelected =
                              selectedRoom === room &&
                              selectedSlot.day === day.key &&
                              selectedSlot.hour === hour;
                            const displayName = reserved ? reservations[room][day.key][hour] : 'Available';

                            return (
                              <button
                                key={day.key + hour}
                                className={`p-2 text-sm border text-center break-words ${
                                  reserved
                                    ? isAdmin
                                      ? 'bg-yellow-100 text-black hover:bg-yellow-200'
                                      : 'bg-red-100 text-gray-500 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white hover:bg-blue-100'
                                }`}
                                onClick={() => {
                                  if (reserved && isAdmin) {
                                    handleDeleteReservation(room, day.key, hour);
                                  } else if (!reserved) {
                                    setSelectedRoom(room);
                                    handleSelectSlot(day.key, hour);
                                  }
                                }}
                                disabled={!isAdmin && reserved}
                              >
                                {displayName}
                                {reserved && isAdmin && <div className="text-xs mt-1">(Click to delete)</div>}
                              </button>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Reservation Form */}
            {!isAdmin && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700">📌 Reserve a Time Slot</h2>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                  <div className="text-sm text-gray-600">
                    Selected: <strong>{selectedSlot.day}</strong> at{' '}
                    <strong>{selectedSlot.hour !== null ? `${selectedSlot.hour}:00` : '--'}</strong> in{' '}
                    <strong>{selectedRoom}</strong>
                  </div>
                  <Button onClick={handleReserve}>Confirm Reservation</Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
