// import { useEffect, useState } from "react";
// import axios from "axios";

// function Leaderboard() {

//   const [users, setUsers] = useState([]);
//   const token = localStorage.getItem("token");

//   const fetchLeaderboard = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/premium/showleaderboard",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setUsers(res.data);

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   return (
//     <div className="leaderboard-wrapper">

//       <h1>🏆 Leaderboard</h1>

//       <table className="leaderboard-table">

//         {/* LABEL HEADER */}
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>User Name</th>
//             <th>Email Address</th>
//             <th>Total Expenses (₹)</th>
//           </tr>
//         </thead>

//         {/* DATA BODY */}
//         <tbody>
//           {users.map((user, index) => (
//             <tr key={user.id}>
//               <td data-label="Rank">#{index + 1}</td>
//               <td data-label="User Name">{user.name}</td>
//               <td data-label="Email Address">{user.email}</td>
//               <td data-label="Total Expenses">
//                 💰 {user.totalExpenses}
//               </td>
//             </tr>
//           ))}
//         </tbody>

//       </table>

//     </div>
//   );
// }

// export default Leaderboard;

import { useEffect, useState } from "react";
import axios from "axios";
import './Premium.css';

function Leaderboard() {

  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    fetchLeaderboard();
  }, []);

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

      <h1>🏆 Leaderboard</h1>

      {/* ---------------- REPORT BUTTONS ---------------- */}
      <div className="report-buttons">

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

      {/* ---------------- TABLE ---------------- */}
      <table className="leaderboard-table">

        <thead>
          <tr>
            <th>Rank</th>
            <th>User Name</th>
            <th>Email Address</th>
            <th>Total Expenses (₹)</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>#{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>💰 {user.totalExpenses}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Leaderboard;