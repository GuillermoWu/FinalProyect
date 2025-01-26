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
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { debounce } from "./utils";

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

  const [classConfig, setClassConfig] = useState({ id: null, state: null });
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

  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const uploadImage = async () => {
    if (!image) {
      return;
    }
    const imageUrl = URL.createObjectURL(image);
    try {
      await axiosRequest("/api/upload_profile_img", "post", { imageUrl });

      fetchUser();
    } catch (error) {
      return 1;
    }
    setUploading(!uploading);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

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
      return 1;
    }
  };

  const create_term = async (e, class_id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/create_term", "post", { term, class_id });
      fetchTerms();
    } catch (error) {
      return 1;
    }
  };

  const delete_term = async (e, term_id) => {
    e.preventDefault();
    try {
      await axiosRequest("/api/delete_term", "post", { term_id });
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
    } catch (error) {
      return 1;
    }
  };

  const update_exam = async (id, exam_name, date, grade) => {
    try {
      axiosRequest("/api/update_exam", "patch", { id, exam_name, date, grade });
      fetchExams();
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
      setSessionItem((prevState) => ({...prevState, editing: null, state: !sessionItem.state}));
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
  const debouncedUpdateExam = useCallback(
    debounce((id, exam_name, date, grade) => {
      update_exam(id, exam_name, date, grade);
      fetchExams();
    }, 500),
    []
  );

  const handleInput = (name, date, grade, id) => {
    setExamItem((prevState) => ({ ...prevState, name: name }));
    setExamItem((prevState) => ({ ...prevState, date: date }));
    setExamItem((prevState) => ({ ...prevState, grade: grade }));
    // code suggested by copilot
    debouncedUpdateExam(id, name, date, grade);
  };

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
    return length > 0 ? (sum / length) * 10 : 0;
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
                                <>
                                  <label className="exam-grade">
                                    {exam.grade}/{exam.max_grade}
                                  </label>
                                </>
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
            onClick={() => setUploading(!uploading)}
          >
            <span className="account-image-circle">
              {user.profile_img ? (
                <>
                  <img
                    className="profile-picture"
                    src={user.profile_img}
                    alt="profile-picture"
                  ></img>
                </>
              ) : (
                <FontAwesomeIcon
                  className="edit-profile-picture"
                  icon={faCamera}
                />
              )}
            </span>
          </div>
          {uploading && (
            <div className="upload-menu">
              <span onClick={handleImageClick}>
                {image ? (
                  <>
                    <img
                      className="profile-picture"
                      src={URL.createObjectURL(image)}
                      alt="profile-picture"
                    ></img>
                  </>
                ) : (
                  <FontAwesomeIcon
                    className="edit-profile-picture"
                    icon={faCamera}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </span>
              <div className="upload-picture-btns">
                <button
                  type="button"
                  onClick={() => uploadImage()}
                  className="upload-picture-btn"
                >
                  Upload
                </button>
                <button
                  onClick={() => setUploading(!uploading)}
                  className="cancel-upload-picture-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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
              <div
                style={{ width: `${calculate_shool()}%` }}
                className="progress-bar-content"
              ></div>
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
                              setClassConfig((prevState) => ({
                                ...prevState,
                                state: !classConfig.state,
                              }));
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
            </label>
          </div>

          <div className="training-progress">
            <label className="progress-label">Training:</label>
            <FontAwesomeIcon
              onClick={() => setShowTraining(!showTraining)}
              className="dropdown-icon"
              icon={!showTraining ? faAngleUp : faAngleDown}
            />
            <div className="progress-bar">
              <div className="progress-bar-content"></div>
            </div>

            <label className={`school-content ${!showTraining && "shrink"}`}>
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
                        <label className="session-name">{session.name}</label>
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
                        <label className="session-duration">
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
                                onClick={() =>
                                  setSessionItem((prevState) => ({
                                    ...prevState,
                                    editing: null,
                                    state: !sessionItem.state,
                                  }))
                                }
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
                      onClick={() =>
                        setAddingSession((prevState) => ({
                          ...prevState,
                          state: !addingSession.state,
                        }))
                      }
                    >
                      Cancel
                    </button>
                    <button className="submit-btn">Create</button>
                  </div>
                </form>
              )}
            </label>
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
