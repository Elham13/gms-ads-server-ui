import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { EXECUTIVES, ORDERS } from "../utils/endpoints";

const ActivityChart = () => {
  const today = new Date();
  const [executiveNames, setExecutiveNames] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [completedTasks, setCompletedTasks] = useState(0);
  const [target, setTarget] = useState(100);

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 0-based to 1-based
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const res = await axios.get(EXECUTIVES);
        setExecutiveNames(res.data);
      } catch (err) {
        console.error("Error fetching executives:", err);
      }
    };
    fetchExecutives();
  }, []);

  const handleExecutiveChange = async (e) => {
    const name = e.target.value;
    setSelectedExecutive(name);
    await fetchExecutiveOrders(name, selectedYear, selectedMonth);
  };

  const handleDateChange = async (day, month, year) => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
    if (selectedExecutive) {
      await fetchExecutiveOrders(selectedExecutive, year, month);
    }
  };

  const fetchExecutiveOrders = async (name, year, month) => {
    try {
      const res = await axios.get(ORDERS);
      const orders = res.data;

      const selectedMonthStr = `${year}-${String(month).padStart(2, "0")}`;

      const filtered = orders.filter((order) => {
        const orderDate = format(new Date(order.orderDate), "yyyy-MM");
        return order.executive === name && orderDate === selectedMonthStr;
      });

      let sum = 0;
      filtered.forEach((order) => {
        if (Array.isArray(order.rows)) {
          order.rows.forEach((item) => {
            sum += parseFloat(item.total);
          });
        }
      });

      const executiveTarget = filtered.length > 0 ? filtered[0].target : 100;
      setTarget(executiveTarget);
      setCompletedTasks(sum);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const completionPercentage = (completedTasks / target) * 100;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  return (
    <div className="activity-chart-container">
      <div className="top-bar">
        <select
          onChange={(e) => handleExecutiveChange(e)}
          value={selectedExecutive}
          className="executive-select"
        >
          <option value="">--Select Executive--</option>
          {executiveNames.map((exec, index) => (
            <option key={index} value={exec.name}>
              {exec.name}
            </option>
          ))}
        </select>

        <div className="date-picker-group">
          <select
            value={selectedDay}
            onChange={(e) =>
              handleDateChange(
                Number(e.target.value),
                selectedMonth,
                selectedYear
              )
            }
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) =>
              handleDateChange(
                selectedDay,
                Number(e.target.value),
                selectedYear
              )
            }
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) =>
              handleDateChange(
                selectedDay,
                selectedMonth,
                Number(e.target.value)
              )
            }
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-heading">Executive Target Report</h3>
        <div
          className="chart"
          style={{
            background: `conic-gradient(
              #4caf50 ${completionPercentage}%,
              #f44336 ${completionPercentage}% 100%
            )`,
          }}
        >
          <div className="chart-inner">
            <div className="completed-text">₹{completedTasks}</div>
            <div className="target-text">of ₹{target}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .activity-chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }

        .top-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .executive-select {
          padding: 8px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ddd;
          min-width: 250px;
        }

        .date-picker-group {
          display: flex;
          gap: 10px;
        }

        .date-picker-group select {
          padding: 6px;
          font-size: 14px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .chart-container {
          width: 100%;
          max-width: 350px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .chart {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          position: relative;
          margin: auto;
        }

        .chart-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .completed-text {
          font-size: 20px;
          font-weight: bold;
        }

        .target-text {
          font-size: 14px;
          color: #555;
        }

        @media (max-width: 480px) {
          .chart {
            width: 200px;
            height: 200px;
          }

          .date-picker-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityChart;
