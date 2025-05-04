import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const [executiveName, setExecutiveName] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    setUserRole(role);
    setExecutiveName(name);
    fetchOrders(role, name);
  }, []);

  const fetchOrders = async (role, name) => {
    try {
      let url = 'http://localhost:5000/api/orders';
      if (role === 'Executive') {
        url += `?executive=${name}`;
      }
      const res = await axios.get(url);
      const sortedOrders = res.data.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/mark-paid`);
      fetchOrders(userRole, executiveName);
    } catch (err) {
      console.error('Mark as paid failed:', err);
    }
  };

  const handleExportToExcel = () => {
    const exportData = [];
    orders.forEach((order, orderIndex) => {
      order.rows.forEach((row) => {
        exportData.push({
          'S.No': orderIndex + 1,
          'Executive': order.executive,
          'Business': order.business,
          'Customer': order.contactPerson,
          'Contact': `${order.contactCode} ${order.phone}`,
          'Order No': order.orderNo,
          'Order Date': order.orderDate,
          'Target': order.target,
          'Client Type': order.clientType,
          'Requirement': row.requirement,
          'Qty': row.quantity,
          'Rate': row.rate,
          'Total': row.total,
          'Delivery Date': row.deliveryDate,
          'Advance': order.advance,
          'Balance': order.balance,
          'Advance Date': order.advanceDate,
          'Payment Date': order.paymentDate,
          'Payment Method': order.paymentMethod,
          'Cheque Number': order.chequeNumber,
        });
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'orders.xlsx');
  };

  const filterOrders = (order) => (row) => {
    const valuesToSearch = [
      order.executive, order.business, order.contactPerson,
      `${order.contactCode} ${order.phone}`, order.orderNo, order.orderDate,
      order.clientType, row.requirement, row.quantity, row.rate, row.total,
      row.deliveryDate, order.advance, order.balance, order.advanceDate,
      order.paymentDate, order.paymentMethod, order.chequeNumber,
    ];
    return valuesToSearch.some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1a5d1a' }}>View Orders</h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', border: '1px solid #ccc' }}>
          <thead style={{ backgroundColor: '#218c74', color: '#fff' }}>
            <tr>
              {[
                'S.No', 'Executive', 'Business', 'Customer', 'Contact',
                'Order No', 'Order Date', 'Target', 'Client Type', 'Requirement',
                'Qty', 'Rate', 'Total', 'Delivery Date',
                'Advance', 'Balance', 'Advance Date',
                'Payment Date', 'Payment Method', 'Cheque Number', 'Action'
              ].map((header) => (
                <th key={header} style={{ padding: '8px', fontSize: '13px', textAlign: 'center' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, orderIndex) =>
              order.rows.filter(filterOrders(order)).map((row, rowIndex) => (
                <tr key={`${order._id}-${rowIndex}`} style={{ backgroundColor: (orderIndex + rowIndex) % 2 === 0 ? '#fdfdfd' : '#f1f8f9' }}>
                  <td>{orderIndex + 1}</td>
                  <td>{order.executive}</td>
                  <td>{order.business}</td>
                  <td>{order.contactPerson}</td>
                  <td>{order.contactCode} {order.phone}</td>
                  <td>{order.orderNo}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.target}</td>
                  <td>{order.clientType}</td>
                  <td>{row.requirement}</td>
                  <td>{row.quantity}</td>
                  <td>{row.rate}</td>
                  <td>{row.total}</td>
                  <td>{row.deliveryDate}</td>
                  <td>{order.advance}</td>
                  <td>{order.balance}</td>
                  <td>{order.advanceDate}</td>
                  <td>{order.paymentDate}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.chequeNumber}</td>
                  <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleMarkPaid(order._id)}
                      style={{
                        backgroundColor: order.balance === 0 ? '#2ecc71' : '#f39c12',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {order.balance === 0 ? 'Paid' : 'Pending'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleExportToExcel} style={{ backgroundColor: '#16a085', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>
          Save to Excel
        </button>
      </div>
    </div>
  );
}

export default ViewOrders;
