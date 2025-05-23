import React, { useEffect, useState } from "react";
import styles from "./StudentScore.module.css";
import { useLocation, useNavigate } from "react-router-dom";

export const StudentScore = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [scores, setScores] = useState([]);

  const teacherCode = location.state?.teacherCode || '';
  const grade = location.state?.grade || 3;
  console.log(teacherCode);

  useEffect(() => {
    if (!teacherCode) {
      console.warn("No teacher code provided");
      return;
    }

    const fetchScores = async () => {
      try {
        const response = await fetch(`https://ila1.pythonanywhere.com/api/scores/${teacherCode}/?grade=${grade}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Failed to fetch scores");

        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, [teacherCode]);

  const handleDelete = async (username) => {
    const confirm = window.confirm(`Are you sure you want to delete ${username} and all their scores?`);
    if (!confirm) return;
  
    try {
      const response = await fetch(`https://ila1.pythonanywhere.com/api/delete-student/${username}/`, {
        method: 'DELETE',
      });
  
      if (response.status === 204) {
        setScores(prev => prev.filter(s => s.student_username !== username));
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  };
  

  const toDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className={styles.pageWrapper}>
      <button className={styles.button} onClick={toDashboard}>
        Back to Dashboard
      </button>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Overall Grade</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan="3" className={styles.noScores}>No scores available</td>
              </tr>
            ) : (
              scores.map((student, index) => (
                <tr key={index}>
                  <td>{student.student_username || 'Unnamed'}</td>
                  <td>{student.score ?? 'N/A'}</td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(student.student_username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
