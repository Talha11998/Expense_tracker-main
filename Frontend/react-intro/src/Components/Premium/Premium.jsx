import { useEffect, useState } from "react";
import axios from "axios";
import './Premium.css';
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

function Leaderboard() {

const [users, setUsers] = useState([]);
const [Data, setData] = useState([]);
const [income, setIncome] = useState("");

const token = localStorage.getItem("token");

  // ---------------- LEADERBOARD ----------------
  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/premium/showleaderboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchMonthlydata = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/premium/fetchMonthlydata",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    //   const formattedData = res.data.map((item) => ({
    //   name: item.date,
    //   value: Number(item.totalExpense),
    // }));
  const daysInMonth = new Date(2026, 5, 0).getDate(); // 31

const Data = [];
console.log("res.data",res.data);
for (let day = 1; day <= daysInMonth; day++) {
  const date = `2026-05-${String(day).padStart(2, "0")}`;
  console.log("date",date);
  const expense = res.data.find(e => e.date === date);
  if (expense) {
    console.log("MATCH FOUND:", expense);
  }

console.log("expense =", expense);
console.log("expense.totalExpense =", Number(expense?.totalExpense));
console.log("Number =", Number(expense?.totalExpense));
  Data.push({
    date: day,
    value: expense ? Number(expense.totalExpense) : 0
  });
}

      setData(Data);
      console.log("Data",Data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchMonthlydata();
  }, []);
  

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Net Income:", income);
    const token=localStorage.getItem("token");
    try {
      await axios.post("http://localhost:3000/premium/addIncome", income, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Income added successfully!");

      setIncome("");

    } catch (err) {
      console.log(err);
      alert("Failed to add expense");
    }
  }; 
  // ---------------- REPORT DOWNLOAD ----------------
  const downloadReport = async (type) => {
  try {

    let url = "";

    if (type === "daily") {
      url = "http://localhost:3000/reportdaily";
    } else if (type === "monthly") {
      url = "http://localhost:3000/reportmonthly";
    } else if (type === "yearly") {
      url = "http://localhost:3000/reportyearly";
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const file = new Blob(
      [JSON.stringify(response.data, null, 2)],
      { type: "application/json" }
    );

    const fileURL = URL.createObjectURL(file);

    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `${type}-report.json`;
    a.click();

    URL.revokeObjectURL(fileURL);

  } catch (err) {
    console.log(err);
    alert("Failed to download report");
  }
};

  return (
    <div className="leaderboard-wrapper">

      <h1>🏆 Leader Board</h1>
      

      

      {/* ---------------- TABLE ---------------- */}
      <table className="leaderboard-table">

        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Expense</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.totalExpenses}</td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* ---------------- REPORT BUTTONS ---------------- */}
      <div className="report-buttons">
        <h1>Download Reports</h1>
        <button onClick={() => downloadReport("daily")}>
          Daily Report
        </button>

        <button onClick={() => downloadReport("monthly")}>
          Monthly Report
        </button>

        <button onClick={() => downloadReport("yearly")}>
          Yearly Report
        </button>

      </div>
      <div className="chart-container">
        <h3>Monthly Data</h3>
        <BarChart width={1000} height={500} data={Data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" >
            <LabelList dataKey="value" position="top" formatter={(value) => `Rs ${value}`} />
          </Bar>
        </BarChart>
      </div>
      <form onSubmit={handleSubmit} className="income-form">
          
      <label>Net Monthly Income</label>

      <input
        type="number"
        name="income"
        placeholder="Enter your net income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Leaderboard;
