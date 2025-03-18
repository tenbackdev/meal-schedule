import React, { useState } from 'react';
import './style.css';
import NotesSection from './NotesSection'; // Import the standalone component

const ScheduleApp = () => {
  // State to track which days are enabled
  const [enabledDays, setEnabledDays] = useState({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true
  });
  
  // Full day names mapping
  const fullDayNames = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday"
  };

  // Student tabs - updated to include 3 students
  const students = ["Abby", "Caleb"];
  const [activeStudent, setActiveStudent] = useState(students[0]);

  // Initialize state dynamically based on students array
  const initializeMealLocations = () => {
    const locations = {};
    students.forEach(student => {
      locations[student] = {
        breakfast: { Mon: 'home', Tue: 'home', Wed: 'home', Thu: 'home', Fri: 'home' },
        lunch: { Mon: 'school', Tue: 'school', Wed: 'school', Thu: 'school', Fri: 'school' },
        notes: { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '' } // Initialize notes for each day
      };
    });
    return locations;
  };

  // Function to update notes - modified to work with the standalone component
  const handleNoteChange = (day, text) => {
    setMealLocations(prevState => ({
      ...prevState,
      [activeStudent]: {
        ...prevState[activeStudent],
        notes: {
          ...prevState[activeStudent].notes,
          [day]: text.slice(0, 100) // Limit to 100 characters
        }
      }
    }));
  };

  // State for meal locations (home or school) for each student
  const [mealLocations, setMealLocations] = useState(initializeMealLocations());

  // Function to toggle a day's enabled status
  const toggleDay = (day) => {
    setEnabledDays(prevState => ({
      ...prevState,
      [day]: !prevState[day]
    }));
  };

  // Function to set meal location (home/school)
  const setMealLocation = (student, mealType, day, location) => {
    setMealLocations(prevState => ({
      ...prevState,
      [student]: {
        ...prevState[student],
        [mealType]: {
          ...prevState[student][mealType],
          [day]: location
        }
      }
    }));
  };

  // Function to update notes
  const updateNote = (student, day, text) => {
    setMealLocations(prevState => ({
      ...prevState,
      [student]: {
        ...prevState[student],
        notes: {
          ...prevState[student].notes,
          [day]: text.slice(0, 100) // Limit to 100 characters
        }
      }
    }));
  };

  // Function to set active student
  const selectStudent = (student) => {
    setActiveStudent(student);
  };

  // Function to get next Monday's date in MM/DD format
  const getNextMonday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const daysUntilNextMonday = day === 0 ? 1 : 8 - day; // If today is Sunday, next Monday is tomorrow
    
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    
    // Format as MM/DD
    const month = nextMonday.getMonth() + 1; // getMonth() returns 0-11
    const date = nextMonday.getDate();
    
    return `${month.toString().padStart(2, '0')}/${date.toString().padStart(2, '0')}`;
  };

  // Component for button toggle switch
  const ButtonToggle = ({ currentValue, onChange }) => (
    <div className="flex w-full">
      <button
        onClick={() => onChange('home')}
        className={`flex-1 px-2 py-1 text-xs font-medium rounded-l-md transition-colors duration-200 ${
          currentValue === 'home'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Home
      </button>
      <button
        onClick={() => onChange('school')}
        className={`flex-1 px-2 py-1 text-xs font-medium rounded-r-md transition-colors duration-200 ${
          currentValue === 'school'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        School
      </button>
    </div>
  );

  // Component for meal section (breakfast or lunch)
  const MealSection = ({ title, mealType, icon }) => {
    return (
      <div className="mb-6 bg-white p-4 rounded-md shadow">
        <div className="flex items-center mb-3">
          <span className="text-gray-700 mr-2">{icon}</span>
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <div className="space-y-3">
          {Object.keys(enabledDays).map(day => 
            enabledDays[day] && (
              <div key={`${mealType}-${day}`} className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded">
                <span className="font-medium text-gray-700 self-center">{fullDayNames[day]}</span>
                <div className="w-full">
                  <ButtonToggle 
                    currentValue={mealLocations[activeStudent][mealType][day]} 
                    onChange={(location) => setMealLocation(activeStudent, mealType, day, location)} 
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };



  // Printable Schedule Component - only visible when printing
  const PrintableSchedule = () => {
    // Function to get display for meal location
    const getMealDisplay = (location) => {
      return location === 'home' ? 'Home' : 'School';
    };

    // Updated transportation logic - checks if ANY student has breakfast at home
    const getTransportation = (day) => {
      // Check if ANY student has breakfast at home for this day
      for (const student of students) {
        if (mealLocations[student]['breakfast'][day] === 'home') {
          return 'Car';
        }
      }
      // If no student has breakfast at home, everyone takes the bus
      return 'Bus';
    };

    // Get color classes for student names
    const getStudentGradient = (index) => {
      if (index === 0) {
        return 'from-red-500 via-yellow-500 to-green-500';
      } else if (index === 1) {
        return 'from-blue-500 via-purple-500 to-pink-500';
      } else {
        return 'from-pink-500 via-orange-500 to-yellow-500';
      }
    };

    // Get all days (enabled and disabled)
    const allDays = Object.keys(enabledDays);

    return (
      <div className="hidden print:block print:p-4">
        {/* Printable content */}
        <div className="mx-auto" style={{ maxWidth: "90%" }}>
          {/* Header - only shows week of date */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Week of {getNextMonday()}</h1>
          </div>
          
          {/* Content optimized for 3 students on a page */}
          <div className="flex flex-col justify-between h-full">
            {students.map((student, index) => (
              <div key={student} className="mb-6">
                {/* Student name row with rainbow gradient - no border */}
                <h2 className="text-xl font-bold text-center mb-4">
                  {/* Using inline styles for print-friendly gradient names */}
                  <span 
                    className={`bg-gradient-to-r ${getStudentGradient(index)}`} 
                    style={{ 
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                      display: "inline-block"
                    }}
                  >
                    {student}
                  </span>
                </h2>
                
                {/* Table/Spreadsheet Layout with equal width columns and bolder text */}
                <table className="w-full table-fixed border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="w-1/6 border border-gray-700 p-2 font-black text-lg bg-white"></th>
                      {allDays.map(day => (
                        <th key={day} className="w-1/6 border border-gray-700 p-2 text-center font-black text-lg bg-white">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Breakfast row */}
                    <tr>
                      <td className="border border-gray-700 p-2 font-bold text-lg bg-white">
                        Breakfast
                      </td>
                      {allDays.map(day => (
                        <td key={`breakfast-${day}`} className="border border-gray-700 p-2 text-center font-bold text-lg bg-white">
                          {enabledDays[day] ? getMealDisplay(mealLocations[student]['breakfast'][day]) : ''}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Lunch row */}
                    <tr>
                      <td className="border border-gray-700 p-2 font-bold text-lg bg-white">
                        Lunch
                      </td>
                      {allDays.map(day => (
                        <td key={`lunch-${day}`} className="border border-gray-700 p-2 text-center font-bold text-lg bg-white">
                          {enabledDays[day] ? getMealDisplay(mealLocations[student]['lunch'][day]) : ''}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Bus row - now same value for all students on a given day */}
                    <tr>
                      <td className="border border-gray-700 p-2 font-bold text-lg bg-white">
                        Bus
                      </td>
                      {allDays.map(day => (
                        <td key={`bus-${day}`} className="border border-gray-700 p-2 text-center font-bold text-lg bg-white">
                          {enabledDays[day] ? getTransportation(day) : ''}
                        </td>
                      ))}
                    </tr>

                    {/* Notes row */}
                    <tr>
                      <td className="border border-gray-700 p-2 font-bold text-lg bg-white">
                        Notes
                      </td>
                      {allDays.map(day => (
                        <td key={`notes-${day}`} className="border border-gray-700 p-2 text-center font-bold text-base bg-white" style={{ wordBreak: 'break-word' }}>
                          {enabledDays[day] ? mealLocations[student]['notes'][day] : ''}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Fixed position header container */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gray-100 p-4 print:hidden">
        <header className="max-w-4xl mx-auto bg-indigo-600 rounded-lg shadow">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Week of {getNextMonday()}</h2>
            <p className="text-indigo-100 mt-1">School Schedule Planner</p>
          </div>
        </header>
      </div>
      
      {/* Regular UI - hidden when printing - added top padding to account for fixed header */}
      <div className="print:hidden" style={{ paddingTop: "140px" }}>        
        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* Day selection buttons with uniform width */}
            <div className="flex justify-center mb-6">
              {Object.keys(enabledDays).map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-20 py-2 mx-1 rounded-md font-medium text-center transition-colors duration-200 ${
                    enabledDays[day] 
                      ? 'bg-teal-500 text-white hover:bg-teal-400' 
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            
            {/* Student tab buttons - centered and full width */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex w-full">
                {students.map(student => (
                  <button
                    key={student}
                    onClick={() => selectStudent(student)}
                    className={`flex-1 py-3 text-center font-medium transition-colors duration-200 border-b-2 ${
                      activeStudent === student
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {student}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Content area with breakfast and lunch sections */}
            <div className="p-4 bg-gray-50 rounded-lg">            
              <MealSection 
                title="Breakfast" 
                mealType="breakfast" 
                icon="🍳" 
              />
              
              <MealSection 
                title="Lunch" 
                mealType="lunch" 
                icon="🍎" 
              />

               {/* Use the standalone NotesSection component */}
                <NotesSection 
                  enabledDays={enabledDays}
                  fullDayNames={fullDayNames}
                  activeStudent={activeStudent}
                  initialNotes={mealLocations[activeStudent]?.notes || {}}
                  onNoteChange={handleNoteChange}
                />
            </div>
          </div>
        </main>
        
        <footer className="max-w-4xl mx-auto mt-8 text-center text-gray-500 text-sm">
          <p>School Schedule App - {new Date().getFullYear()}</p>
        </footer>
      </div>
      
      {/* Printable Schedule - only visible when printing */}
      <PrintableSchedule />
      
      {/* Print-specific styles */}
      <style type="text/css" dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 8.5in 11in;
            margin: 0.5in;
          }
          
          /* Ensure entire page has white background */
          html, body {
            background-color: white !important;
          }
          
          /* All print elements get white background */
          .print\\:block {
            display: block;
            height: 100%;
            background-color: white !important;
          }
          
          /* Keep tables and all contents white */
          .print\\:block table,
          .print\\:block tr, 
          .print\\:block th, 
          .print\\:block td {
            background-color: white !important;
          }
          
          /* Force colors to be shown for gradient text */
          .print\\:block h2 span {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          /* Additional spacing for 3 students to fill page height */
          .print\\:block {
            display: block;
            height: 100%;
          }
        }
      `}} />
    </div>
  );
};

export default ScheduleApp;