import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faEllipsis,
  faPlus,
  faXmark,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { debounce } from "./utils";

const Account = () => {
  const { user, fetchUser, axiosRequest, today_date } = useContext(UserContext);
  const [name, setName] = useState("");
  const [addingClass, setAddingClass] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showSchool, setShowSchool] = useState(false);
  const [classConfig, setClassConfig] = useState({ id: null, state: null });
  const [classConfigLabel, setClassConfigLabel] = useState(false);
  const [terms, setTerms] = useState([]);
  const [addingTerm, setAddingTerm] = useState(false);
  const [term, setTerm] = useState("");
  const [exams, setExams] = useState([]);
  const [exam, setExam] = useState("")
  const [addingExam, setAddingExam] = useState({
    state:false,
    term_id:null,
  });
  const [examItem, setExamItem] = useState({
    name:null,
    grade:null,
    max_grade:null,
    date:null,
    editing:false,
    state:false,
  })

  const navigate = useNavigate();

  const fetchClasses = async () => {
    if (!sessionStorage.getItem("token")) {
      return "session-expired";
    }
    try {
      const response = await axios.get("/api/get_classes", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setClasses(response.data.classes);
    } catch (error) {
      setClasses([]);
    }
  };

  const create_class = async (e) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/create_class", "post", { name });
      setAddingClass(!addingClass);
      fetchClasses();
    } catch (error) {
      return 1;
    }
  };

  const delete_class = async (e, id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/delete_class", "post", { id });
      fetchClasses();
    } catch (error) {
      return 1;
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axiosRequest("/api/get_terms", "get");
      setTerms(response.data.terms);
    } catch (error) {
      alert(error);
    }
  };

  const create_term = async (class_id) => {
    try {
      await axiosRequest("/api/create_term", "post", { term, class_id });
      fetchTerms();
    } catch (error) {
      return 1;
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axiosRequest("/api/get_exams", "get");
      setExams(response.data.exams);
    } catch (error) {
      alert(error);
    }
  };

  const create_exam = async (exam_name, max_grade, class_id, term_id) => {
      try{
        await axiosRequest("/api/create_exam", "post", {exam_name, max_grade, class_id, term_id, today_date});
        fetchExams();
        setAddingExam(!addingExam);
      }catch (error){
        alert(error);
      }
  }

  const update_exam = async (id, exam_name, date, grade) =>{
    try{
      axiosRequest("/api/update_exam", "patch", {id, exam_name, date, grade})
      fetchExams()
    }catch(error){
      return 1
    }
  }

  const delete_exam = async (e, id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/delete_exam", "post", { id });
      fetchExams();
    } catch (error) {
      return 1;
    }
  };

  // code suggested by copilot
  const debouncedUpdateExam = useCallback(
    debounce((id, exam_name, date, grade) => {
      update_exam(id, exam_name, date, grade);
    }, 500),
    []
  );

  const handleInput = (name, date, grade, id) =>{
    setExamItem(prevState => ({...prevState, name:name}))
    setExamItem(prevState => ({...prevState, date:date}))
    setExamItem(prevState => ({...prevState, grade:grade}))
    // code suggested by copilot
    debouncedUpdateExam(id, name, date, grade);

  }

  const createExam = useRef(null);
  const createTerm = useRef(null);

  useEffect(()=>{
    if (addingExam && createExam.current) {
      createExam.current.scrollIntoView({ behavior: "smooth" });
    }
    if (addingTerm && createTerm.current) {
      createTerm.current.scrollIntoView({ behavior: "smooth" });
    }
  },[addingTerm, addingExam])

  useEffect(()=>{
    fetchUser();
    if (fetchUser() == "session-expired") {
      navigate("/session-expired");
    }
    fetchClasses();
    fetchExams();
    fetchTerms();
  },[]);

  const configure_class = (classItem, terms) => {
    return (
      <div className="class-config-container">
        <div className="header">
          <h2>{classItem.name}</h2>
          <FontAwesomeIcon
            className="close-icon"
            onClick={() => setClassConfigLabel(!classConfigLabel)}
            icon={faXmark}
          />
        </div>

        {terms &&
          terms
            .filter((term) => term.class_id === classItem.id)
            .map((term) => (
              <div key={term.id}>
                <div className="term-container">
                  <label className="term-label">{term.name}</label>
                  <div className="exam-container">
                    {exams && (
                      <ul className="exam-content-headers">
                        <header className="exam-header">Name</header>
                        <header className="exam-header">Date</header>
                        <header className="exam-header">Grade</header>
                      </ul>
                    )}
                    {exams &&
                      exams
                        .filter(
                          (exam) =>
                            exam.class_id === classItem.id &&
                            exam.term_id === term.id
                        )
                        .map((exam) => (
                          <>
                            <ul className="exam-display" key={exam.id}>
                              {examItem.editing === exam.id &&
                              examItem.state ? (
                                <input
                                  className="editing-exam-name"
                                  value={examItem.name}
                                  onChange={(e) =>
                                    handleInput(
                                      e.target.value,
                                      examItem.date,
                                      examItem.grade,
                                      exam.id
                                    )
                                  }
                                ></input>
                              ) : (
                                <label className="exam-name">{exam.name}</label>
                              )}
                              {examItem.editing === exam.id &&
                              examItem.state ? (
                                <input
                                  type="date"
                                  className="editing-exam-date"
                                  value={examItem.date}
                                  onChange={(e) =>
                                    handleInput(
                                      examItem.name,
                                      e.target.value,
                                      examItem.grade,
                                      exam.id
                                    )
                                  }
                                ></input>
                              ) : (
                                <label className="exam-date">{exam.date}</label>
                              )}
                              {examItem.editing === exam.id &&
                              examItem.state ? (
                                <input
                                  type="number"
                                  className="editing-exam-grade"
                                  value={examItem.grade}
                                  onChange={(e) =>
                                    handleInput(
                                      examItem.name,
                                      examItem.date,
                                      e.target.value,
                                      exam.id
                                    )
                                  }
                                ></input>
                              ) : (
                                <label className="exam-grade">
                                  {exam.grade}
                                </label>
                              )}
                              <div className="icons">
                                <FontAwesomeIcon
                                  onClick={() =>
                                    setExamItem((prevState) => ({
                                      ...prevState,
                                      editing: exam.id,
                                      state: !examItem.state,
                                      name: exam.name,
                                      date: exam.date,
                                      grade: exam.grade,
                                    }))
                                  }
                                  className="edit-icon"
                                  icon={faPenToSquare}
                                />
                                <FontAwesomeIcon
                                  onClick={(e) => delete_exam(e, exam.id)}
                                  className="delete-icon"
                                  icon={faTrashCan}
                                />
                              </div>
                            </ul>
                            <hr className="exam-separator"></hr>
                          </>
                        ))}
                    <button
                      className="add-term-btn"
                      onClick={() =>
                        setAddingExam({
                          state: !addingExam.state,
                          term_id: term.id,
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      &nbsp;Add Exam
                    </button>
                    {addingExam.term_id === term.id && (
                      <form
                        onSubmit={() =>
                          create_exam(
                            examItem.name,
                            examItem.max_grade,
                            classItem.id,
                            term.id
                          )
                        }
                        ref={createExam}
                        className={`add-class-content add-term ${
                          !addingExam.state && "shrink"
                        }`}
                      >
                        <input
                          required
                          value={examItem.name}
                          onChange={(e) =>
                            setExamItem((prevState) => ({
                              ...prevState,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Exam name"
                        ></input>
                        <input
                          required
                          type="number"
                          value={examItem.max_grade}
                          onChange={(e) =>
                            setExamItem((prevState) => ({
                              ...prevState,
                              max_grade: e.target.value,
                            }))
                          }
                          placeholder="Maximum obtainable grade"
                        ></input>
                        <div className="addClass-btn-container">
                          <button
                            className="cancel-add-term cancel-btn "
                            onClick={() =>
                              setAddingExam({ state: !addingExam.state })
                            }
                          >
                            Cancel
                          </button>
                          <button type="submit" className="submit-btn">
                            Create
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
        <button
          className="add-term-btn"
          onClick={() => setAddingTerm(!addingTerm)}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp;Add Term
        </button>
        <label
          ref={createTerm}
          className={`add-class-content add-term ${!addingTerm && "shrink"}`}
        >
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="1st Term"
          ></input>
          <div className="addClass-btn-container">
            <button
              className="cancel-add-term cancel-btn "
              onClick={() => setAddingTerm(!addingTerm)}
            >
              Cancel
            </button>
            <button
              className="submit-btn"
              onClick={() => create_term(classItem.id)}
            >
              Create
            </button>
          </div>
        </label>
      </div>
    );
  };


  return (
    <>
      <div className="account-stats">
        <div className="profile">
          <div className="account-image">
            <span className="account-image-circle"></span>
          </div>
          <label>{user.username}</label>
        </div>

        <div className="progress-bars-container">
          <div className="school-progress">
            <label className="progress-label">School:</label>
            <FontAwesomeIcon
              onClick={() => setShowSchool(!showSchool)}
              className="dropdown-icon"
              icon={!showSchool ? faAngleUp : faAngleDown}
            />
            <div className="progress-bar">
              <div className="progress-bar-content"></div>
            </div>
            <label className={`school-content ${!showSchool && "shrink"}`}>
              {classes &&
                classes.map((class_item) => (
                  <div key={class_item.id}>
                    <div className="class-name">
                      <label>{class_item.name}</label>
                      <div className="class-config">
                        <FontAwesomeIcon
                          onClick={() =>
                            setClassConfig({
                              id: class_item.id,
                              state: !classConfig.state,
                            })
                          }
                          className="class-config-icon"
                          icon={faEllipsis}
                        />
                        <div
                          style={
                            classConfig.id === class_item.id &&
                            classConfig.state
                              ? { display: "grid" }
                              : {}
                          }
                          className={`class-config-btns`}
                        >
                          <button className="config-btn">Edit</button>
                          <button
                            className="config-btn"
                            onClick={() => {
                              setClassConfigLabel(!classConfigLabel);
                              setClassConfig((prevState)=>({...prevState, state:!classConfig.state}));
                              fetchTerms();
                            }}
                          >
                            Configure
                          </button>
                          <button
                            onClick={(e) => delete_class(e, class_item.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="progress-bar-children">
                      <div className="progress-bar-content"></div>
                    </div>
                    {classConfigLabel && classConfig.id === class_item.id ? configure_class(class_item, terms) : ""}
                  </div>
                ))}

              <button
                className="add-class-btn"
                onClick={() => setAddingClass(!addingClass)}
              >
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;Add Class
              </button>
              <label
                className={`add-class-content ${!addingClass && "shrink"}`}
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Class Name"
                ></input>
                <div className="addClass-btn-container">
                  <button
                    className="cancel-btn"
                    onClick={() => setAddingClass(!addingClass)}
                  >
                    Cancel
                  </button>
                  <button
                    className="submit-btn"
                    onClick={(e) => create_class(e, name)}
                  >
                    Create
                  </button>
                </div>
              </label>
            </label>
          </div>

          <label className="progress-label">Training:</label>
          <div className="progress-bar">
            <div className="progress-bar-content"></div>
          </div>

          <label className="progress-label">Sleep:</label>
          <div className="progress-bar">
            <div className="progress-bar-content"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
