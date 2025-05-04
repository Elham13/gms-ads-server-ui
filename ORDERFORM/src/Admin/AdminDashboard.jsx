  import React, { useState } from 'react';
  import { NavLink, Outlet, useLocation } from 'react-router-dom';
  import { Pie, Doughnut, Bar, PolarArea } from 'react-chartjs-2';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale, RadialLinearScale } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale, RadialLinearScale);

  function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [hoveredItem, setHoveredItem] = useState('');
    const location = useLocation();

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

    const showDashboardCards = location.pathname === '/admin-dashboard';

    const styles = {
      container: {
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
      },
      sidebar: {
        width: sidebarOpen ? '250px' : '0',
        backgroundColor: '#003366',
        color: '#fff',
        overflowX: 'hidden',
        transition: '0.3s',
        paddingTop: '60px',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        height: '100vh',
      },
      sidebarItem: {
        padding: '15px 25px',
        cursor: 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        transition: 'background 0.3s',
      },
      hoverEffect: {
        backgroundColor: '#002244',
      },
      activeSidebarItem: {
        backgroundColor: '#001933',
      },
      content: {
        marginLeft: sidebarOpen ? '250px' : '0',
        marginTop: '60px',
        padding: '20px',
        transition: 'margin-left 0.3s',
        width: '100%',
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        backgroundColor: '#f4f4f4',
      },
      navbar: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#003366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        zIndex: 2,
      },
      burger: {
        fontSize: '24px',
        marginRight: '20px',
        cursor: 'pointer',
      },
      brand: {
        fontSize: '22px',
        fontWeight: 'bold',
      },
      dashboardCards: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      },
      card: {
        width: '280px',
        height: '350px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#003366',
        padding: '10px',
      },
      number: {
        fontSize: '40px',
        color: '#002244',
        marginTop: '10px',
      },
      pieChart: {
        width: '100%',
        height: '180px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };

    const linkStyle = (name) => ({ isActive }) => ({
      ...styles.sidebarItem,
      ...(isActive ? styles.activeSidebarItem : {}),
      ...(hoveredItem === name ? styles.hoverEffect : {}),
    });

    const chartData = {
      totalOrders: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [120, 100, 90, 110, 130, 140, 150, 160, 180, 200, 220, 250],
      },
      pendingPayments: [80, 15],
      pendingServices: [60, 25],
      appointments: [80, 5],
      newRenewalAgent: {
        labels: ['New', 'Renewal', 'Agent'],
        data: [50, 30, 20],
      },
    };

    
    return (
      <div>
        {/* Navbar */}
        <div style={styles.navbar}>
          <span style={styles.burger} onClick={toggleSidebar}>
            &#9776;
          </span>
          <span style={styles.brand}>GLOBAL MARKETING SOLUTION</span>
        </div>

        <div style={styles.container}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <NavLink to="/admin-dashboard" style={linkStyle('dashboard')} onMouseEnter={() => setHoveredItem('dashboard')} onMouseLeave={() => setHoveredItem('')}>
              Dashboard
            </NavLink>
            <NavLink to="view-orders" style={linkStyle('view-orders')} onMouseEnter={() => setHoveredItem('view-orders')} onMouseLeave={() => setHoveredItem('')}>
              View All Orders
            </NavLink>
            <NavLink to="add-executive" style={linkStyle('add-executive')} onMouseEnter={() => setHoveredItem('add-executive')} onMouseLeave={() => setHoveredItem('')}>
              Add Employee
            </NavLink>
            <NavLink to="pending-payment" style={linkStyle('pending-payment')} onMouseEnter={() => setHoveredItem('pending-payment')} onMouseLeave={() => setHoveredItem('')}>
              Pending Payment
            </NavLink>
            <NavLink to="pending-service" style={linkStyle('pending-service')} onMouseEnter={() => setHoveredItem('pending-service')} onMouseLeave={() => setHoveredItem('')}>
              Pending Service
            </NavLink>
            <NavLink to="select-appointment" style={linkStyle('appointments')} onMouseEnter={() => setHoveredItem('appointments')} onMouseLeave={() => setHoveredItem('')}>
              Appointments
            </NavLink>
            <NavLink to="activity" style={linkStyle('activity')} onMouseEnter={() => setHoveredItem('activity')} onMouseLeave={() => setHoveredItem('')}>
              Target
            </NavLink>
          </div>

          {/* Main Content Area */}
          <div style={styles.content}>
            <Outlet />

            {showDashboardCards && (
              <div style={styles.dashboardCards}>
                {/* Total Orders (wider card) */}
                <div style={{ ...styles.card, width: '340px', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', cursor: 'pointer' }} title="Select Month">
      📅
    </div>
    <div>Total Orders (Monthly)</div>
    <div style={styles.pieChart}>
      <Bar
        data={{
          labels: chartData.totalOrders.months,
          datasets: [
            {
              label: 'Total Orders',
              data: chartData.totalOrders.data,
              backgroundColor: '#36A2EB',
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
        }}
      />
    </div>
    <div style={styles.number}>{chartData.totalOrders.data.reduce((a, b) => a + b, 0)}</div>
  </div>


                {/* Doughnut Chart for Pending Payments */}
                <div style={styles.card}>
                  <div>Pending Payments</div>
                  <div style={styles.pieChart}>
                    <Doughnut
                      data={{
                        labels: ['Paid', 'Pending'],
                        datasets: [
                          {
                            data: chartData.pendingPayments,
                            backgroundColor: ['green', 'red'],
                          },
                        ],
                      }}
                    />
                  </div>
                  <div style={styles.number}>{chartData.pendingPayments[1]}</div>
                </div>

                {/* Pending Services */}
                <div style={styles.card}>
                  <div>Pending Services</div>
                  <div style={styles.pieChart}>
                    <Bar
                      data={{
                        labels: ['Completed', 'Pending'],
                        datasets: [
                          {
                            label: 'Services',
                            data: chartData.pendingServices,
                            backgroundColor: ['green', 'red'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                  <div style={styles.number}>{chartData.pendingServices[1]}</div>
                </div>

                {/* Appointments */}
                <div style={styles.card}>
                  <div>Appointments</div>
                  <div style={styles.pieChart}>
                    <PolarArea
                      data={{
                        labels: ['Done', 'upon'],
                        datasets: [
                          {
                            data: chartData.appointments,
                            backgroundColor: ['green', 'red'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'right' } },
                      }}
                    />
                  </div>
                  <div style={styles.number}>{chartData.appointments[1]}</div>
                </div>

                {/* New, Renewal, Agent */}
                <div style={styles.card}>
                  <div>New, Renewal, Agent</div>
                  <div style={styles.pieChart}>
                    <Doughnut
                      data={{
                        labels: chartData.newRenewalAgent.labels,
                        datasets: [
                          {
                            data: chartData.newRenewalAgent.data,
                            backgroundColor: ['#FF6384', '#36A2EB', '#FF9F40'],
                          },
                        ],
                      }}
                    />
                  </div>
                  <div style={styles.number}>{chartData.newRenewalAgent.data.reduce((a, b) => a + b, 0)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  export default AdminDashboard;
