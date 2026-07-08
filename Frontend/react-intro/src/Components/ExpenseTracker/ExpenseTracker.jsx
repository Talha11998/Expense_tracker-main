import { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseTracker.css";
import { useNavigate, Link } from "react-router-dom";

function ExpenseTracker() {
  const [expense, setExpense] = useState({
    expenseamount: "",
    description: "",
    category: "food",
    note: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const token = localStorage.getItem("token");

  // ----------------------------
  // ADD EXPENSE
  // ----------------------------
  const addNewExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://expense-tracker-main-o8jt.onrender.com/expense/addexpense",
        expense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Expense added successfully!");

      setExpense({
        expenseamount: "",
        description: "",
        category: "food",
        note: "",
      });

      fetchExpenses(); // refresh list after adding
    } catch (err) {
      console.log(err);
      alert("Failed to add expense");
    }
  };

  //FETCH IS PREMIUMUSER STATUS
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://expense-tracker-main-o8jt.onrender.com/ispremium",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsPremiumUser(response.data.a);
        console.log("isPremiumUser", isPremiumUser);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPremiumStatus();
  }, []);
  // ----------------------------
  // FETCH PAGINATED EXPENSES
  // ----------------------------
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `https://expense-tracker-main-o8jt.onrender.com/expense/getexpenses?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setExpenses(response.data.expenses);
      setTotalPages(response.data.lastPage);
    } catch (err) {
      console.log(err);
    }
  };

  // ----------------------------
  // USE EFFECT (AUTO LOAD DATA)
  // ----------------------------
  useEffect(() => {
    fetchExpenses();
  }, [page, limit]);
  // PREMIUM BUYING HANDLER
  const navigate = useNavigate();
  const buyPremiumHandler = () => {
    navigate("/CashfreePayment");
  };
  // ----------------------------
  // INPUT CHANGE
  // ----------------------------
  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
  };
  return (
    <div className="expense-wrapper">
      <div className="expense-card">
        <h1>Expense Tracker</h1>
        <p className="subtitle">Track your daily expenses easily</p>
        <Link to="/premium" className="payment-link">
          Go To Premium Page
        </Link>
        <div className="navbar">
          <button onClick={handleLogout} className="logout">
            Logout
          </button>
        </div>
        {/* ---------------- FORM ---------------- */}
        <form onSubmit={addNewExpense} className="expense-form">
          <input
            type="number"
            name="expenseamount"
            placeholder="Expense Amount"
            value={expense.expenseamount}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={expense.description}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={expense.category}
            onChange={handleChange}
          >
            <option value="fuel">Fuel</option>
            <option value="food">Food</option>
            <option value="electricity">Electricity</option>
            <option value="movie">Movie</option>
          </select>

          <input
            type="text"
            name="note"
            placeholder="Note (optional)"
            value={expense.note}
            onChange={handleChange}
          />

          <button type="submit">Add Expense</button>
        </form>
        {/* ---------------- LIMIT SELECT ---------------- */}
        <div className="info-box">
          <p>Premium Status: {isPremiumUser ? "Active ✅" : "Not Active ❌"}</p>

          <label>Items per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
        {/* ---------------- EXPENSE LIST ---------------- */}
        <div className="sections">
          <div>
            <h3>Expenses</h3>

            <ul>
              {expenses.map((exp, index) => (
                <li key={index}>
                  💰 {exp.expenseamount} - {exp.description} ({exp.category})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active-page" : "page-button"}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {!isPremiumUser && (
          <button onClick={buyPremiumHandler}>Buy Premium</button>
        )}{" "}
      </div>
    </div>
  );
}

export default ExpenseTracker;
