import React, { useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { supabase } from "../lib/supabaseClient.js";
import styles from "../styles/AddQuestion.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const topicData = {
  "the basics": [
    "number system",
    "HCF and LCM",
    "simplification",
    "fractions and decimals",
    "coding and decoding",
  ],
  "commercial math": [
    "percentage",
    "profit & loss",
    "discount",
    "simple and compound interest",
  ],
  "ratios and proportions": [
    "ratio & proportions",
    "partnership",
    "averages",
    "mixtures",
    "alligations",
  ],
  "time and motion": [
    "time and work",
    "pipes and cisterns",
    "speed and distance",
    "problems on trains, boats and streams",
  ],
  "advanced math": [
    "algebra (equations)",
    "geometry",
    "trigonometry",
    "mensuration (2D / 3D)",
  ],
  "modern math": ["permutations and combinations", "probability", "set theory"],
};

const AddQuestion = () => {
  const initialState = {
    examId: "",
    yearAsked: "",
    topicId: "",
    subtopicId: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    solution: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]: name === "yearAsked" ? parseInt(value) || "" : value,
      };
      if (name === "topicId") newState.subtopicId = "";
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      alert("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/admin/addQuestion`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Question published successfully!");
      setFormData(initialState); // Resets form and preview
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Exam ID</label>
              <input
                name="examId"
                value={formData.examId}
                placeholder="e.g. CAT"
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Year</label>
              <input
                name="yearAsked"
                value={formData.yearAsked}
                type="number"
                placeholder="????"
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Topic</label>
              <select
                name="topicId"
                value={formData.topicId}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="">Choose Topic</option>
                {Object.keys(topicData).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Subtopic</label>
              <select
                name="subtopicId"
                value={formData.subtopicId}
                onChange={handleChange}
                className={styles.input}
                disabled={!formData.topicId}
                required
              >
                <option value="">Choose Subtopic</option>
                {formData.topicId &&
                  topicData[formData.topicId].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Question Body</label>
            <textarea
              name="questionText"
              value={formData.questionText}
              placeholder="Add the question..."
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.optionsGrid}>
            {["A", "B", "C", "D"].map((opt) => (
              <div key={opt} className={styles.inputGroup}>
                <label>Option {opt}</label>
                <input
                  name={`option${opt}`}
                  value={formData[`option${opt}`]}
                  placeholder={`Value for ${opt}`}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            ))}
          </div>

          <div className={styles.inputGroup}>
            <label>Correct Choice</label>
            <select
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              className={styles.input}
            >
              {["A", "B", "C", "D"].map((opt) => (
                <option key={opt} value={opt}>
                  Option {opt}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Solution Steps</label>
            <textarea
              name="solution"
              value={formData.solution}
              placeholder="Explain the solution..."
              onChange={handleChange}
              className={styles.textarea}
              style={{ height: "140px" }}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Adding to Database..." : "Add Question"}
          </button>
        </form>
      </div>

      {/* PREVIEW */}
      <div className={styles.previewSection}>
        <h2 className={styles.previewTitle}>Live Preview</h2>

        <div className={styles.quizTestContainer}>
          <div className={styles.quizHeader}>
            <div className={styles.examSelector}>
              <div className={styles.examDropdownPlaceholder}>
                EXAM NAME / {formData.examId || ""}
              </div>
            </div>
            <div className={styles.timer}>
              <span className={styles.timerIcon}>⏱</span>
              <span className={styles.timerText}>Time: 00:00</span>
            </div>
          </div>

          <div className={styles.topicBreadcrumb}>
              {formData.topicId || "Topic"} <span>{">"}</span>{" "}
              {formData.subtopicId || "Subtopic"}
            </div>

          <div className={styles.questionSection}>
            <div className={styles.questionHeader}>
              <div className={styles.questionLeft}>
                <span className={styles.questionNumber}>Q.1</span>
                <span className={styles.questionMainText}>
                  <InlineMath
                    math={formData.questionText || "\\ Add \\ question \\ text..."}
                  />
                </span>
              </div>
              <span className={styles.questionYear}>
                <em>[Year {formData.yearAsked || "????"}]</em>
              </span>
            </div>

            <div className={styles.optionsContainer}>
              <p className={styles.optionsLabel}>Options:</p>
              {["A", "B", "C", "D"].map((opt) => (
                <label key={opt} className={styles.optionItem}>
                  <input type="radio" name="preview-answer" disabled />
                  <span className={styles.optionText}>
                    {formData[`option${opt}`] || "--"}
                  </span>
                </label>
              ))}
            </div>

            <div className={styles.solutionContainer}>
              <p className={styles.solutionLabel}>Solution:</p>
              <div className={styles.solutionText}>
                <BlockMath
                  math={formData.solution || "\\ Add \\ solution..."}
                />
                <p className={styles.correctIndicator}>
                  <strong>Correct Answer: {formData.correctAnswer}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
