import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseISO, isBefore } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar'; // Added Avatar import

const ExecutiveDashboard = () => {
  const [,setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState('');
  const [target, setTarget] = useState(100);
  const [achieved, setAchieved] = useState(0);
  const [paymentData, setPaymentData] = useState([ 
    { name: 'Paid', value: 0, fill: '#00C49F' }, 
    { name: 'Unpaid', value: 0, fill: '#FF8042' },
  ]);
  const [serviceData, setServiceData] = useState([ 
    { name: 'Services', pending: 0, completed: 0, total: 0 } 
  ]);
  const [userName, setUserName] = useState(''); // Added userName state

  const navigate = useNavigate();
  const [appointmentCount, setAppointmentCount] = useState(0);

  // Added function to get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    // Added: Get logged in user from localStorage and set as selected executive
    const loggedInUser = localStorage.getItem('userName');
    if (loggedInUser) {
      setUserName(loggedInUser);
      setSelectedExecutive(loggedInUser); // Automatically set the executive
    }

    const fetchAppointmentCount = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/appointments');
        
        // Filter appointments by selected executive
        const assigned = res.data.filter((appt) => appt.status === 'assigned' && appt.executive === selectedExecutive);
        
        const newCount = assigned.length;
        const storedCount = parseInt(localStorage.getItem('lastSeenAppointmentCount')) || 0;
        
        if (newCount > storedCount) {
          alert(`You have ${newCount - storedCount} new appointment(s)!`);
        }
    
        setAppointmentCount(newCount);
        localStorage.setItem('lastSeenAppointmentCount', newCount);
      } catch (error) {
        console.error('Error fetching appointment count:', error);
      }
    };
    

    fetchAppointmentCount();
  }, [selectedExecutive]); // Added dependency on selectedExecutive

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/executives');
        setExecutives(res.data);
      } catch (err) {
        console.error('Error fetching executives:', err);
      }
    };
    fetchExecutives();
  }, []);

  useEffect(() => {
    if (selectedExecutive) {
      fetchExecutiveData(selectedExecutive);
    }
  }, [selectedExecutive]);

  const fetchExecutiveData = async (executiveName) => {
    try {
      const ordersRes = await axios.get(`http://localhost:5000/api/executive/${executiveName}`);
      const orders = ordersRes.data;

      let totalAchieved = 0;
      let executiveTarget = 100;

      orders.forEach(order => {
        if (order.target) executiveTarget = order.target;
        if (Array.isArray(order.rows)) {
          order.rows.forEach(item => {
            totalAchieved += parseFloat(item.total) || 0;
          });
        }
      });

      setTarget(executiveTarget);
      setAchieved(totalAchieved);

      let completedServices = 0;
      let pendingServices = 0;

      orders.forEach(order => {
        if (Array.isArray(order.rows)) {
          order.rows.forEach(row => {
            const deliveryDate = row.deliveryDate ? parseISO(row.deliveryDate) : null;
            const isExpired = deliveryDate && isBefore(deliveryDate, new Date());

            if (row.isCompleted || isExpired) {
              completedServices++;
            } else {
              pendingServices++;
            }
          });
        }
      });

      setServiceData([{
        name: 'Services',
        pending: pendingServices,
        completed: completedServices,
        total: pendingServices + completedServices
      }]);
    } catch (err) {
      console.error('Error fetching executive data:', err);
    }
  };

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/pending-payments');
        const pendingOrders = res.data;

        let totalAdvance = 0;
        let totalBalance = 0;

        pendingOrders
          .filter(order => order.executive === selectedExecutive)
          .forEach(order => {
            totalAdvance += parseFloat(order.advance) || 0;
            totalBalance += parseFloat(order.balance) || 0;
          });

        setPaymentData([
          { name: 'Paid', value: totalAdvance, fill: 'green' },
          { name: 'Unpaid', value: totalBalance, fill: 'red' },
        ]);
      } catch (error) {
        console.error('Failed to fetch pending payments:', error);
      }
    };

    if (selectedExecutive) {
      fetchPendingPayments();
    }
  }, [selectedExecutive]);

  const pieData = [
    { name: 'Achieved', value: achieved },
    { name: 'Remaining', value: Math.max(0, target - achieved) },
  ];

  const COLORS = ['#4CAF50', '#F44336'];
  const totalPayments = paymentData.reduce((sum, d) => sum + d.value, 0);

  const handlePaymentSliceClick = (data) => {
    if (data.name === 'Unpaid') {
      navigate('/pending-payment', { state: { executive: selectedExecutive } });
    }
  };

  const handleServiceSliceClick = (data) => {
    if (data.name === 'Pending') {
      navigate('/pending-service', { state: { executive: selectedExecutive } });
    }
  };

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '35px'
      }}>
        <div style={{ flex: '1 1 250px', minWidth: '200px' }}>
          <h3>{selectedExecutive}</h3>
        </div>

        <div style={{
          flex: '1 1 200px',
          minWidth: '160px',
          textAlign: 'right',
          position: 'relative',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '15px'
        }}>
 <button
  onClick={() => navigate('/new-appointment')}
  style={{
    width: '100%',
    maxWidth: '220px',
    background: 'linear-gradient(135deg, #1976d2, #125ea3)',
    color: '#fff',
    padding: '12px 24px 12px 20px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'visible'
  }}
>
  New Appointments
  {appointmentCount > 0 && (
    <span style={{
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#e74c3c',
      color: '#fff',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
      zIndex: 1
    }}>
      {appointmentCount}
    </span>
  )}
</button>


          <Avatar
            sx={{
              bgcolor: '#1976d2',
              width: 48,
              height: 48,
              fontSize: '1.2rem',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            {getInitials(userName)}
          </Avatar>

        </div>
      </div>

      {/* Rest of your existing code remains the same... */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
        {/* Target Chart */}
        <div style={{
          width: '90%',
          maxWidth: '600px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 0 15px rgba(0,0,0,0.08)',
          height: '470px',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          <h3 style={{ textAlign: 'left', marginBottom: '10px' }}>🎯 Target</h3>
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '30px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '10px 15px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            textAlign: 'right',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333',
            fontWeight: 500,
            minWidth: '220px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#777' }}>Total Target:</span>
              <span>₹{target.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#777' }}>Achieved:</span>
              <span>₹{achieved.toLocaleString()}</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {achieved > target && (
                <Pie
                  data={[
                    { name: 'Extra', value: achieved - target },
                    { name: 'Remainder', value: achieved }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={120}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  <Cell fill="blue" />
                  <Cell fill="transparent" />
                </Pie>
              )}
              <Tooltip formatter={(value, name) => [`₹${value}`, name === 'Extra' ? 'Extra Achieved' : 'Target Portion']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Services & Payments */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px',
          width: '100%'
        }}>
          {/* Services */}
          <div style={{
            flex: '1 1 300px',
            maxWidth: '500px',
            minWidth: '300px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 15px rgba(0,0,0,0.08)',
            height: '450px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ textAlign: 'center' }}>🛠 Services Status</h3>
            <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={[
              { name: 'Pending', value: serviceData[0]?.pending || 0 },
              { name: 'Completed', value: serviceData[0]?.completed || 0 }
            ]}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
            dataKey="value"
            labelLine={false}
            onClick={handleServiceSliceClick} // Added onClick handler
          >
            <Cell fill="red" />
            <Cell fill="green" />
          </Pie>
          <Tooltip formatter={(val, name) => [`${val} services`, name]} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
          </div>

          {/* Payments */}
          <div style={{
            flex: '1 1 300px',
            maxWidth: '500px',
            minWidth: '300px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 0 15px rgba(0,0,0,0.08)',
            height: '450px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ textAlign: 'center' }}>💰 Payments Status</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                  labelLine={false}
                  onClick={handlePaymentSliceClick}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  ₹{totalPayments.toLocaleString()}
                </text>
                <Tooltip formatter={(value) => [`₹${value}`]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;