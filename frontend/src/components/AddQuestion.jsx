import React, { useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { supabase } from "../lib/supabaseClient.js";

import styles from "../styles/AddQuestion.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const topicData = {
  "the basics": ["number system", "HCF and LCM", "simplification", "fractions and decimals"],
  "commercial math": ["percentage", "profit loss", "discount", "simple and compound interest"],
  "ratios and proportions": ["ratio & proportions", "partnership", "averages", "mixtures", "alligations"],
  "time and motion": ["time and work", "pipes and cisterns", "speed and distance", "problems on train", "boats and streams"],
  "advanced math": ["algebra (equations)", "geometry", "trigonometry", "mensurataion (2D / 3D)"],
  "modern math": ["permutation and combination", "probability", "set theory"]
};

const AddQuestion = () => {
  const [formData, setFormData] = useState({
    examId: "",
    yearAsked: "",
    topic: "",    
    subtopic: "",   
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    solution: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]: name === "yearAsked" ? parseInt(value) || "" : value,
      };

      // Reset subtopic if topic changes
      if (name === "topic") {
        newState.subtopic = "";
      }

      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      alert("Not logged in!");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/addQuestion`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Latest Question Added:", res.data);
      alert(`Successfully added question with ID: ${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add question");
    }
  };

  return (
    <div className={styles.container}>
      {/* FORM SECTION */}
      <div className={styles.formSection}>
        <h2 className={styles.title}>Add New Question</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <input
              name="examId"
              placeholder="Exam ID"
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              name="yearAsked"
              type="number"
              placeholder="Year"
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.row}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Topic</label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="">Select Topic</option>
                {Object.keys(topicData).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label className={styles.label}>Subtopic</label>
              <select
                name="subtopic"
                value={formData.subtopic}
                onChange={handleChange}
                className={styles.input}
                disabled={!formData.topic}
                required
              >
                <option value="">Select Subtopic</option>
                {formData.topic &&
                  topicData[formData.topic].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
              </select>
            </div>
          </div>

          <label className={styles.label}>Question Text (LaTeX)</label>
          <textarea
            name="questionText"
            placeholder="LaTeX content..."
            onChange={handleChange}
            className={styles.textarea}
            required
          />

          <div className={styles.optionsGrid}>
            {["A", "B", "C", "D"].map((opt) => (
              <input
                key={opt}
                name={`option${opt}`}
                placeholder={`Option ${opt}`}
                onChange={handleChange}
                className={styles.input}
                required
              />
            ))}
          </div>

          <label className={styles.label}>Correct Answer</label>
          <select
            name="correctAnswer"
            onChange={handleChange}
            className={styles.input}
          >
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>

          <label className={styles.label}>Solution (LaTeX)</label>
          <textarea
            name="solution"
            placeholder="Detailed solution..."
            onChange={handleChange}
            className={styles.textarea}
            style={{ height: "120px" }}
            required
          />

          <button type="submit" className={styles.submitBtn}>
            Add Question
          </button>
        </form>
      </div>

      {/* PREVIEW SECTION */}
      <div className={styles.previewSection}>
        <h2 className={styles.title}>Live Preview</h2>
        <div className={styles.paper}>
          <div className={styles.meta}>
            <div>
              <span>{formData.examId || "EXAM ID"}</span> | <span>{formData.yearAsked || "YEAR"}</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
              {formData.topic} {formData.subtopic && `> ${formData.subtopic}`}
            </div>
          </div>

          <div className={styles.previewContent}>
            <p>
              <strong>Q:</strong>{" "}
              <InlineMath math={formData.questionText || " "} />
            </p>

            <div className={styles.previewOptions}>
              <div>(A) {formData.optionA}</div>
              <div>(B) {formData.optionB}</div>
              <div>(C) {formData.optionC}</div>
              <div>(D) {formData.optionD}</div>
            </div>

            <div className={styles.solutionBox}>
              <strong>Solution:</strong>
              <BlockMath math={formData.solution || " "} />
              <p style={{ color: "#10b981" }}>
                <strong>Correct: {formData.correctAnswer}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;