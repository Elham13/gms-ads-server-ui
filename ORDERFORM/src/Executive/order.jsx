import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Executive/order.css';
import ExecutiveDashboard from '../Executive/ExecutiveDashboard';
import ViewOrders from '../Admin/ViewOrders';
import Appointment from '../Executive/Appointment';
import { useNavigate } from "react-router-dom";

function OrderForm() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('executive-dashboard');
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeImage, setChequeImage] = useState(null);

  const handlePrint = () => {
    const printContents = document.getElementById('print-area').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Refresh after printing to restore the app
  };
  
  
  const [requirements, setRequirements] = useState([]);
  const [selectedExecutive] = useState(localStorage.getItem('userName') || '');
  const [business, setBusiness] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
 
  const [orderDate, setOrderDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [advanceDate, setAdvanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [target, setTarget] = useState('');
  const [clientType, setClientType] = useState('');
  const [rows, setRows] = useState([getEmptyRow(orderDate)]);
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [advance, setAdvance] = useState('');
  const [balance, setBalance] = useState('');
  const [total, setTotal] = useState('');
  const [upiOptions, setUpiOptions] = useState([]);
  const [selectedUpi, setSelectedUpi] = useState('');

  function getEmptyRow(baseDate) {
    const delivery = new Date(baseDate);
    delivery.setDate(delivery.getDate() + 3);
    return {
      requirement: '',
      quantity: '',
      rate: '',
      total: '',
      deliveryDate: delivery.toISOString().split('T')[0],
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqRes = await axios.get('http://localhost:5000/api/requirements');
        setRequirements(reqRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchData();
  }, []);

  const checkIfExistingClient = async (number) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/check-client?phone=${number}`);
      if (res.data.exists) setClientType('Renewal');
    } catch (error) {
      console.error('Error checking existing client:', error);
    }
  };

  const handleAddRow = () => {
    setRows(prev => [...prev, getEmptyRow(orderDate)]);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    const qty = parseFloat(updated[index].quantity) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    updated[index].total = qty * rate;
    setRows(updated);

    const totalAmount = updated.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0);
    setTotal(totalAmount);

    const adv = parseFloat(advance) || 0;
    setBalance(totalAmount - adv);
  };

  const handleAdvanceChange = (value) => {
    setAdvance(value);
    const adv = parseFloat(value) || 0;
    const tot = parseFloat(total) || 0;
    setBalance(tot - adv);
  };

  const handlePaymentMethodChange = async (method) => {
    setPaymentMethod(method);
    if (method === 'UPI') {
      try {
        const res = await axios.get('http://localhost:5000/api/upi-numbers');
        setUpiOptions(res.data);
        setSelectedUpi('');
      } catch (err) {
        console.error('Error fetching UPI numbers:', err);
      }
    } else {
      setUpiOptions([]);
      setSelectedUpi('');
    }
  };

  const handleSubmit = async () => {
    const orderData = {
      executive: selectedExecutive,
      business,
      contactPerson,
      contactCode: countryCode,
      phone,
    
      orderDate,
      target,
      clientType,
      rows: rows.map(row => ({
        requirement: row.requirement,
        quantity: row.quantity,
        rate: row.rate,
        total: row.total,
        deliveryDate: row.deliveryDate,
      })),
      advanceDate,
      paymentDate,
      paymentMethod: paymentMethod === 'UPI' ? `UPI - ${selectedUpi}` : paymentMethod,
      advance,
      balance,
      total,
      chequeNumber, 
      chequeImage,

    };

    try {
      await axios.post('http://localhost:5000/api/submit', orderData);
      alert('Order submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit order.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const getProfileInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part[0]?.toUpperCase() || '').join('');
    return initials;
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <h2 className="navbar-title">Executive Dashboard</h2>
        <div className="navbar-right">
          <div className="profile-icon">
            <span className="profile-icon-symbol">{getProfileInitials(selectedExecutive)}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <div className="nav-menu">
            <div className="nav-item" onClick={() => setActiveTab('executive-dashboard')}>
              <span className="nav-icon">🏠</span><span className="nav-text">Dashboard</span>
            </div>
            <div className="nav-item" onClick={() => setActiveTab('order')}>
              <span className="nav-icon">📝</span><span className="nav-text">Create Order ➕</span>
            </div>
            <div className="nav-item" onClick={() => setActiveTab('viewOrders')}>
              <span className="nav-icon">📋</span><span className="nav-text">View Orders</span>
            </div>
            <div className="nav-item" onClick={() => setActiveTab('appointment')}>
              <span className="nav-icon">📅</span><span className="nav-text">Appointment</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <div className="form-container">
          {activeTab === 'executive-dashboard' && <ExecutiveDashboard />}
          {activeTab === 'appointment' && <Appointment />}
          {activeTab === 'viewOrders' && <ViewOrders />}
          {activeTab === 'order' && (
            <div id="print-area">
              <h2 className="subtitle">ORDER FORM</h2>

              <div className="form-top">
                <div className="left">
                  <label>Executive Name:
                    <input type="text" value={selectedExecutive} readOnly />
                  </label>
                  <label>Client Type:
                    <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                      <option value="">Select</option>
                      <option value="New">New</option>
                      <option value="Renewal">Renewal</option>
                      <option value="Agent">Agent</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </label>
                  <label>Business Name:
                    <input type="text" value={business} onChange={(e) => setBusiness(e.target.value)} />
                  </label>
                  <label>Contact Person Name:
                    <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
                  </label>
                 
                </div>

                <div className="right">
                
                  <label>Order Date:
                    <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                  </label>
                  <label>Target:
                    <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} />
                  </label>
                  <label>Contact Number:
                    <div className="contact-inputs">
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                        <option value="+91">IN (+91)</option>
                        <option value="+1">US (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+971">UAE (+971)</option>
                        <option value="other">Other</option>
                      </select>
                      {countryCode === 'other' && (
                        <input type="text" placeholder="Code" maxLength={5} onChange={(e) => setCountryCode(e.target.value)} />
                      )}
                      <input
                        type="text"
                        placeholder="Number"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d{0,10}$/.test(val)) {
                            setPhone(val);
                            if (val.length === 10) checkIfExistingClient(val);
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="rows-section">
                <table>
                  <thead>
                    <tr>
                      <th>Requirement</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Total</th>
                      <th>Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            value={row.requirement}
                            onChange={(e) => handleRowChange(index, 'requirement', e.target.value)}
                          >
                            <option value="">Select Requirement</option>
                            {requirements.map((requirement) => (
                              <option key={requirement._id} value={requirement.name}>
                                {requirement.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.rate}
                            onChange={(e) => handleRowChange(index, 'rate', e.target.value)}
                          />
                        </td>
                        <td>{row.total}</td>
                        <td>
                          <input
                            type="date"
                            value={row.deliveryDate}
                            onChange={(e) => handleRowChange(index, 'deliveryDate', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={handleAddRow}>+ Add Row</button>
              </div>
              <div className="summary-section">
                <div className="left-side">
                <label>Advance Date:
                    <input
                      type="date"
                      value={advanceDate}
                      onChange={(e) => setAdvanceDate(e.target.value)}
                    />
                  </label>
                  <label>Payment Date:
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </label>
                 
                </div>

                <div className="right-side">
                  <label>Advance:
                    <input
                      type="number"
                      value={advance}
                      onChange={(e) => handleAdvanceChange(e.target.value)}
                    />
                  </label>
                  <label>Balance:
                    <input type="number" value={balance} readOnly />
                  </label>

                </div>
              </div>

              <div className="payment-method-section">
  <label>Payment Method:</label>
  <div className="payment-method-checkboxes">
    <label>
      <input
        type="checkbox"
        checked={paymentMethod === 'Cash'}
        onChange={() => handlePaymentMethodChange('Cash')}
      />
      Cash
    </label>
    <label>
      <input
        type="checkbox"
        checked={paymentMethod === 'UPI'}
        onChange={() => handlePaymentMethodChange('UPI')}
      />
      UPI
    </label>
    <label>
      <input
        type="checkbox"
        checked={paymentMethod === 'Cheque'}
        onChange={() => handlePaymentMethodChange('Cheque')}
      />
      Cheque
    </label>
  </div>

  {paymentMethod === 'UPI' && (
    <div>
      <label>UPI ID:
        <select
          value={selectedUpi}
          onChange={(e) => setSelectedUpi(e.target.value)}
        >
          <option value="">Select</option>
          {upiOptions.map((upi) => (
            <option key={upi} value={upi}>
              {upi}
            </option>
          ))}
        </select>
      </label>
    </div>
  )}

  {paymentMethod === 'Cheque' && (
    <div>
      <label>Cheque Number:
        <input
          type="text"
          value={chequeNumber}
          onChange={(e) => setChequeNumber(e.target.value)}
        />
      </label>

      <label>Upload Cheque Image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setChequeImage(e.target.files[0])}
        />
      </label>
    </div>
  )}
</div>


              <button onClick={handleSubmit}>Submit</button>
              <button onClick={handlePrint} style={{ marginLeft: '10px' }}>Print</button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
