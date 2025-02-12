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
  faCamera,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan as faTrashCanRegular } from "@fortawesome/free-regular-svg-icons";

import { useNavigate } from "react-router-dom";
import axios from "axios";


import elementary from '../images/elementary.webp';
import primary from '../images/primary.webp'



const Account = () => {
  const { user, fetchUser, axiosRequest, today_date, sessions, fetchSessions } =
    useContext(UserContext);
  const [name, setName] = useState("");
  const [addingClass, setAddingClass] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showSchool, setShowSchool] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [addingSession, setAddingSession] = useState({
    name: null,
    date: null,
    duration: null,
    state: false,
  });

  const [sessionItem, setSessionItem] = useState({
    name: null,
    date: null,
    duration: null,
    editing: false,
    state: false,
  });

  const [classConfig, setClassConfig] = useState({ id: null, state: null, name: null, edit: null });
  const [classConfigLabel, setClassConfigLabel] = useState(false);
  
  const [terms, setTerms] = useState([]);
  const [addingTerm, setAddingTerm] = useState(false);
  const [term, setTerm] = useState("");
  const [exams, setExams] = useState([]);
  const [addingExam, setAddingExam] = useState({
    state: false,
    term_id: null,
  });

  const [examItem, setExamItem] = useState({
    name: null,
    grade: null,
    max_grade: null,
    date: null,
    editing: false,
    state: false,
  });

  const createExam = useRef(null);
  const createTerm = useRef(null);

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
      setName("");
    } catch (error) {
      return 1;
    }
  };

  const update_class = async (e, id, name) => {
    e.preventDefault();
    try{
      await axiosRequest("/api/update_class", "patch", {id, name});
      fetchClasses();
      setClassConfig((prevState)=> ({...prevState, edit:null}))
    }
    catch(error){
      return 1;
    }
  }

  const delete_class = async (e, id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/delete_class", "post", { id });
      fetchClasses();
      fetchTerms();
      fetchExams();
    } catch (error) {
      return 1;
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axiosRequest("/api/get_terms", "get");
      setTerms(response.data.terms);
    } catch (error) {
      return 1;
    }
  };

  const create_term = async (e, class_id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/create_term", "post", { term, class_id });
      fetchTerms();
      setTerm("");
    } catch (error) {
      return 1;
    }
  };

  const delete_term = async (e, term_id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/delete_term", "post", { term_id });
      fetchTerms();
      fetchExams();
    } catch (error) {
      return 1;
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axiosRequest("/api/get_exams", "get");
      setExams(response.data.exams);
    } catch (error) {
      return 1;
    }
  };

  const create_exam = async (e, exam_name, max_grade, class_id, term_id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/create_exam", "post", {
        exam_name,
        max_grade,
        class_id,
        term_id,
        today_date,
      });
      fetchExams();
      setAddingExam(!addingExam);
      setExamItem({
        name: null,
        grade: null,
        max_grade: null,
        date: null,
        editing: false,
        state: false,
      });
    } catch (error) {
      return 1;
    }
  };

  const update_exam = async (id, exam_name, date, grade) => {
    try {
      await axiosRequest("/api/update_exam", "patch", { id, exam_name, date, grade });
      fetchExams();
      setExamItem((prevState) => ({
        ...prevState,
        editing: null,
        state: !examItem.state,
      }));
    } catch (error) {
      return 1;
    }
  };

  const delete_exam = async (e, id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/delete_exam", "post", { id });
      fetchExams();
    } catch (error) {
      return 1;
    }
  };

  const createSession = async (e, sessionName, sessionDuration) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/create_session", "post", {
        sessionName,
        today_date,
        sessionDuration,
      });
      fetchSessions();
    } catch (error) {
      return 1;
    }
  };

  const updateSession = async (
    e,
    id,
    sessionName,
    sessionDate,
    sessionDuration
  ) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/update_session", "patch", {
        id,
        sessionName,
        sessionDate,
        sessionDuration,
      });
      fetchSessions();
      setSessionItem((prevState) => ({
        ...prevState,
        editing: null,
        state: !sessionItem.state,
      }));
    } catch (error) {
      return 1;
    }
  };

  const deleteSession = async (e, id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/delete_session", "post", { id });
      fetchSessions();
    } catch (error) {
      return 1;
    }
  };





  // code suggested by copilot

  useEffect(() => {
    if (addingExam && createExam.current) {
      createExam.current.scrollIntoView({ behavior: "smooth" });
    }
    if (addingTerm && createTerm.current) {
      createTerm.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [addingTerm, addingExam]);

  useEffect(() => {
    fetchUser();
    if (fetchUser() == "session-expired") {
      navigate("/session-expired");
    }
    fetchClasses();
    fetchExams();
    fetchTerms();
    fetchSessions();
  }, []);

  const calculate_average_session = () => {
    let sum = 0;
    let length = 0;
    sessions &&
      sessions.forEach((session) => {
        sum += session.duration;
        length++;
      });
    return length > 0 && (sum / length / 1.5) * 100 <= 100 && (sum / length / 1.5) * 100 >=0 ? (sum / length / 1.5) * 100 : (sum / length / 1.5) * 100 > 100 ? 100 : 0;
  };

  const calculate_average = (class_id) => {
    let sum = 0;
    let length = 0;
    exams &&
      exams
        .filter((exam) => exam.class_id === class_id)
        .forEach((exam) => {
          sum += (exam.grade / exam.max_grade) * 10;
          length++;
        });
    return length > 0 ? (sum / length) * 10 : 0;
  };

  const calculate_shool = () => {
    let sum = 0;
    let length = 0;
    exams &&
      exams.forEach((exam) => {
        sum += (exam.grade / exam.max_grade) * 10;
        length++;
      });
    return length > 0 && (sum / length) * 10  <= 100 && (sum / length) * 10  >=0 ? (sum / length) * 10 : (sum / length) * 10  > 100 ? 100 : 0;
  };

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
                  <FontAwesomeIcon
                    onClick={(e) => delete_term(e, term.id)}
                    className="delete-icon"
                    icon={faTrashCan}
                  />

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
                                    setExamItem((prevState) => ({
                                      ...prevState,
                                      name: e.target.value,
                                    }))
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
                                    setExamItem((prevState) => ({ ...prevState, date: e.target.value }))
                                  }
                                ></input>
                              ) : (
                                <label className="exam-date">{exam.date}</label>
                              )}
                              {examItem.editing === exam.id &&
                              examItem.state ? (
                                <input
                                  type="number"
                                  step={"0.01"}
                                  min="0"
                                  className="editing-exam-grade"
                                  value={examItem.grade}
                                  onChange={(e) =>
                                    setExamItem((prevState) => ({ ...prevState, grade: e.target.value }))
                                  }
                                ></input>
                              ) : (
                                <>
                                  <label
                                    className="exam-grade"
                                    style={{
                                      color:
                                        exam.grade > exam.max_grade * 0.5 &&
                                        exam.grade <=
                                          exam.max_grade -
                                            (exam.max_grade / exam.max_grade) *
                                              2
                                          ? "rgb(223, 175, 111)"
                                          : exam.grade <= exam.max_grade * 0.5
                                          ? "rgb(223, 111, 111)"
                                          : "rgb(111, 223, 135)",
                                    }}
                                  >
                                    {exam.grade}/{exam.max_grade}
                                  </label>
                                </>
                              )}
                              <div className="icons">
                                {examItem.editing === exam.id &&
                                examItem.state ? (
                                  <>
                                    <div className="session-btn-container">
                                      <button
                                        className="submit-btn"
                                        onClick={() => {
                                          update_exam(
                                            
                                            exam.id,
                                            examItem.name,
                                            examItem.date,
                                            examItem.grade
                                          );
                                        }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={()=>setExamItem((prevState) => ({
                                          ...prevState,
                                          editing: null,
                                          state: false,
                                        }))}
                                        className="cancel-add-term cancel-btn "
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
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
                                  </>
                                )}
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
                        onSubmit={(e) =>
                          create_exam(
                            e,
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
                            type="button"
                            className="cancel-add-term cancel-btn "
                            onClick={(e) => {
                              setAddingExam({ state: !addingExam.state });
                              e.preventDefault();
                            }}
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
        <form
          ref={createTerm}
          onSubmit={(e) => create_term(e, classItem.id)}
          className={`add-class-content add-term ${!addingTerm && "shrink"}`}
        >
          <input
            required
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="1st Term"
          ></input>
          <div className="addClass-btn-container">
            <button
              type="button"
              className="cancel-add-term cancel-btn "
              onClick={(e) => {
                e.preventDefault();
                setAddingTerm(!addingTerm);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <>
      <div className="account-stats">
        <div className="profile">
          <div
            className="account-image"
            
          >
            <span className="account-image-circle">
                {(calculate_shool() + calculate_average_session())/2 <= 33 ? 
                <img src={elementary} alt="pfp"/> : (calculate_shool() + calculate_average_session())/2 >= 33 && (calculate_shool() + calculate_average_session())/2 <= 66 ?
                <img src={primary} alt="pfp"/> : (calculate_shool() + calculate_average_session())/2 >= 66 &&( calculate_shool() + calculate_average_session())/2 <= 100 ?
                <img src={primary} alt="pfp"/> : <></>
              }
            </span>
          </div>

          <label>{user.username}</label>
        </div>

        <div className="progress-bars-container">
          <label className="profile-progress">Current Progress: <label style={{width: `${(Math.round(calculate_shool()) + Math.round(calculate_average_session()))/2}%`}} className="profile-progress-value">{(Math.round(calculate_shool()) + Math.round(calculate_average_session()))/2}%</label></label>
          <div className="school-progress">
            <label className="progress-label">School:</label>
            <FontAwesomeIcon
              onClick={() => setShowSchool(!showSchool)}
              className="dropdown-icon"
              icon={!showSchool ? faAngleUp : faAngleDown}
            />
            <div className="progress-display">
              <div className="progress-bar">
                <div
                  style={{ width: `${calculate_shool()}%` }}
                  className="progress-bar-content"
                ></div>
              </div>
              <label className="progress-bar-percentage">{Math.round(calculate_shool())}%</label>
            </div>
            
            <div className={`school-content ${!showSchool && "shrink"}`}>
              {classes &&
                classes.map((class_item) => (
                  <div key={class_item.id}>
                    <div className="class-name">
                      {classConfig.edit === class_item.id ? 
                      <>
                      <div className="edit-class-form">
                        <input required value={classConfig.name} onChange={(e)=>setClassConfig((prevState)=>({...prevState, name: e.target.value}))}></input>
                        <div className="class-edit-btns">
                          <button
                          className="cancel-btn"
                          onClick={()=>setClassConfig((prevState)=>({...prevState, edit: null}))}
                          >
                          Cancel
                          </button>
                          <button onClick={(e)=> update_class(e, class_item.id, classConfig.name)} className="submit-btn">Save</button>
                        </div>
                      </div>
                      </> : 
                      <label>{class_item.name}</label>}
                      
                      <div className="class-config">
                        <FontAwesomeIcon
                          onClick={() =>
                            setClassConfig((prevState) => ({
                              ...prevState,
                              id: class_item.id,
                              state: !classConfig.state,
                            }))
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
                          <button className="config-btn"
                            onClick={()=>setClassConfig((prevState) => ({...prevState, edit:class_item.id, name:class_item.name, state: !classConfig.state}))}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            &nbsp; Edit
                          </button>
                          <button
                            className="config-btn"
                            onClick={() => {
                              setClassConfigLabel(!classConfigLabel);
                              setClassConfig((prevState) => ({
                                ...prevState,
                                state: !classConfig.state,
                              }));
                              fetchTerms();
                            }}
                          >
                            <FontAwesomeIcon icon={faGear} />
                            &nbsp; Configure
                          </button>
                          <button
                            onClick={(e) => delete_class(e, class_item.id)}
                            className="delete-btn"
                          >
                            <FontAwesomeIcon icon={faTrashCanRegular} />
                            &nbsp; Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="progress-bar-children">
                      <div
                        style={{
                          width: `${calculate_average(class_item.id)}%`,
                        }}
                        className="progress-bar-content"
                      ></div>
                    </div>
                    {classConfigLabel && classConfig.id === class_item.id
                      ? configure_class(class_item, terms)
                      : ""}
                  </div>
                ))}

              <button
                className="add-class-btn"
                onClick={() => setAddingClass(!addingClass)}
              >
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;Add Class
              </button>
              <form
                onSubmit={(e) => create_class(e, name)}
                className={`add-class-content ${!addingClass && "shrink"}`}
              >
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Class Name"
                ></input>
                <div className="addClass-btn-container">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setAddingClass(!addingClass)}
                  >
                    Cancel
                  </button>
                  <button className="submit-btn">Create</button>
                </div>
              </form>
            </div>
          </div>

          <div className="training-progress">
            <label className="progress-label">Training:</label>
            <FontAwesomeIcon
              onClick={() => setShowTraining(!showTraining)}
              className="dropdown-icon"
              icon={!showTraining ? faAngleUp : faAngleDown}
            />
            <div className="progress-display">
            <div className="progress-bar">
              <div
                className="progress-bar-content"
                style={{ width: `${calculate_average_session()}%` }}
              ></div>
            </div>
            <label className="progress-bar-percentage">{Math.round(calculate_average_session())}%</label>
            </div>
            

            <div className={`school-content ${!showTraining && "shrink"}`}>
              <div className="session-item-container">
                <ul className="exam-content-headers">
                  <label className="exam-header">Name</label>
                  <label className="exam-header">Date</label>
                  <label className="exam-header">Duration</label>
                </ul>

                {sessions &&
                  sessions.map((session) => (
                    <>
                      <ul key={session.id} className="session-display">
                        {sessionItem.editing === session.id &&
                        sessionItem.state ? (
                          <input
                            value={sessionItem.name}
                            className="editing-exam-name"
                            onChange={(e) =>
                              setSessionItem((prevState) => ({
                                ...prevState,
                                name: e.target.value,
                              }))
                            }
                          ></input>
                        ) : (
                          <div>
                            <label className="session-name">{session.name}</label>
                            <button className="open-session-btn">Open session</button>
                          </div>
                          
                        )}
                        {sessionItem.editing === session.id &&
                        sessionItem.state ? (
                          <input
                            type="date"
                            value={sessionItem.date}
                            className="editing-exam-date"
                            onChange={(e) =>
                              setSessionItem((prevState) => ({
                                ...prevState,
                                date: e.target.value,
                              }))
                            }
                          ></input>
                        ) : (
                          <label className="session-date">{session.date}</label>
                        )}
                        {sessionItem.editing === session.id &&
                        sessionItem.state ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={sessionItem.duration}
                            className="editing-session-duration"
                            onChange={(e) =>
                              setSessionItem((prevState) => ({
                                ...prevState,
                                duration: e.target.value,
                              }))
                            }
                          ></input>
                        ) : (
                          <label style={{
                            color:
                              session.duration > 0.5 && session.duration <=1
                                ? "rgb(223, 175, 111)"
                                : session.duration <=0.5
                                ? "rgb(223, 111, 111)"
                                : "rgb(111, 223, 135)",
                          }} className="session-duration">
                            {session.duration}
                          </label>
                        )}
                        
                        <div className="icons">
                          {sessionItem.editing === session.id &&
                          sessionItem.state ? (
                            <>
                              <div className="session-btn-container">
                                <button
                                  className="submit-btn"
                                  onClick={(e) => {
                                    updateSession(
                                      e,
                                      session.id,
                                      sessionItem.name,
                                      sessionItem.date,
                                      sessionItem.duration
                                    );
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={()=>setSessionItem((prevState) => ({
                                    ...prevState,
                                    editing: null,
                                    state: false,
                                  }))}
                                  className="cancel-add-term cancel-btn "
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="icons">
                                <FontAwesomeIcon
                                  onClick={() =>
                                    setSessionItem((prevState) => ({
                                      ...prevState,
                                      editing: session.id,
                                      state: !sessionItem.state,
                                      name: session.name,
                                      date: session.date,
                                      duration: session.duration,
                                    }))
                                  }
                                  className="edit-icon"
                                  icon={faPenToSquare}
                                />
                                <FontAwesomeIcon
                                  onClick={(e) => deleteSession(e, session.id)}
                                  className="delete-icon"
                                  icon={faTrashCan}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </ul>
                      <hr></hr>
                    </>
                  ))}
              </div>
              <button
                className="add-class-btn"
                onClick={() =>
                  setAddingSession((prevState) => ({
                    ...prevState,
                    state: !addingSession.state,
                  }))
                }
              >
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;Add Session
              </button>
              {addingSession.state && (
                <form
                  onSubmit={(e) =>
                    createSession(e, addingSession.name, addingSession.duration)
                  }
                  className="add-class-content"
                >
                  <input
                    required
                    value={addingSession.name}
                    onChange={(e) =>
                      setAddingSession((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Session Name"
                  ></input>
                  <input
                    required
                    type="number"
                    value={addingSession.duration}
                    onChange={(e) =>
                      setAddingSession((prevState) => ({
                        ...prevState,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="Session Duration"
                  ></input>
                  <div className="addClass-btn-container">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={()=>setAddingSession((prevState) => ({
                        ...prevState,
                        name: null,
                        date: null,
                        duration: null,
                        state: false,
                      }))}
                    >
                      Cancel
                    </button>
                    <button className="submit-btn">Create</button>
                  </div>
                </form>
              )}
            </div>
          </div>

        
        </div>
      </div>
    </>
  );
};

export default Account;
