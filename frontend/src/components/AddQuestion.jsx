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
  const [formData, setFormData] = useState({
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
  });

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
      alert("Not logged in!");
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
      alert(`Successfully added question!`);
      setFormData({
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
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <header className={styles.header}>
          <h2 className={styles.title}>Question Editor</h2>
          <p className={styles.subtitle}>
            Enter the question details and LaTeX content below.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Exam ID</label>
              <input
                name="examId"
                placeholder="e.g. SSC, CAT"
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Year</label>
              <input
                name="yearAsked"
                type="number"
                placeholder="2024"
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
            <label>Question (LaTeX)</label>
            <textarea
              name="questionText"
              placeholder="Add question text.."
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
                  placeholder={`Value for ${opt}`}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            ))}
          </div>

          <div className={styles.inputGroup}>
            <label>Correct Answer</label>
            <select
              name="correctAnswer"
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
            <label>Solution (LaTeX)</label>
            <textarea
              name="solution"
              placeholder="Step by step solution..."
              onChange={handleChange}
              className={styles.textarea}
              style={{ height: "120px" }}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Adding..." : "Add Question"}
          </button>
        </form>
      </div>

      <div className={styles.previewSection}>
        <h2 className={styles.previewTitle}>Live Preview</h2>
        <div className={styles.paper}>
          <div className={styles.meta}>
            <div className={styles.metaTop}>
              <span className={styles.tag}>{formData.examId || "EXAM"}</span>
              <span className={styles.year}>
                {formData.yearAsked || "YYYY"}
              </span>
            </div>
            <div className={styles.breadcrumb}>
              {formData.topicId || "Topic"} <span>/</span>{" "}
              {formData.subtopicId || "Subtopic"}
            </div>
          </div>

          <div className={styles.previewBody}>
            <div className={styles.questionText}>
              <span className={styles.qLabel}>Q.</span>
              <InlineMath
                math={formData.questionText || "\\text{Waiting for input...}"}
              />
            </div>

            <div className={styles.previewOptions}>
              {["A", "B", "C", "D"].map((opt) => (
                <div key={opt} className={styles.previewOption}>
                  <span className={styles.optLetter}>{opt}</span>{" "}
                  {formData[`option${opt}`] || "---"}
                </div>
              ))}
            </div>

            <div className={styles.solutionBox}>
              <h4 className={styles.solTitle}>Solution</h4>
              <BlockMath math={formData.solution || "\\text{Solution...}"} />
              <div className={styles.finalAnswer}>
                Correct: <strong>{formData.correctAnswer}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
