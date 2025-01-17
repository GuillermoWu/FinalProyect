import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faEllipsis,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const { user, fetchUser, axiosRequest } = useContext(UserContext);
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
      console.log(terms)
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
            .map((term) => 
              <div key={term.id}>
                <div className="term-container">
                <label className="term-label">{term.name}</label>
                <div className="exam-container">
                  <ul className="exam-content-headers">
                    <header>Name</header>
                    <header>Date</header>
                    <header>Grade</header>
                  </ul>
                  {exams &&
                    exams
                      .filter(
                        (exam) =>
                          exam.class_id === classItem.id &&
                          exam.term_id === term.id
                      )
                      .map((exam) => {
                        <>
                          <ul key={exam.id}>
                            <label>{exam.name}</label>
                            <label>{exam.date}</label>
                            <label>{exam.grade}</label>
                          </ul>
                        </>;
                      })}
                  <hr className="exam-separator"></hr>
                  <button className="add-term-btn">
                    <FontAwesomeIcon icon={faPlus} />
                    &nbsp;Add Exam
                  </button>
                </div>
                </div>
              </div>
            )}
        <button
          className="add-term-btn"
          onClick={() => setAddingTerm(!addingTerm)}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp;Add Term
        </button>
        <label
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

  useEffect(() => {
    fetchUser();
    if (fetchUser() == "session-expired") {
      navigate("/session-expired");
    }
    fetchClasses();
  }, []);

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
