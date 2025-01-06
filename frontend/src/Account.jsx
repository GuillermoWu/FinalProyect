import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faP,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const { user, fetchUser, axiosRequest } = useContext(UserContext);
  const [name, setName] = useState("");
  const [addingClass, setAddingClass] = useState(false)
  const [classes, setClasses] = useState([])
  const [showSchool, setShowSchool] = useState(false)

  const navigate = useNavigate()

  const fetchClasses = async () => {
    if (!sessionStorage.getItem("token")) {
      return "session-expired"
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
    
  }

  const create_class = async(e) => {
    e.preventDefault()
    try{
      axiosRequest("/api/create_class", "post", {name});
      setAddingClass(!addingClass)
    }
    catch(error){
      return
    }
   
    
  }

  useEffect(() => {
    fetchUser();
    if (fetchUser() == "session-expired"){
      navigate("/session-expired")
    }
    fetchClasses()
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
            <label className="progress-label" >School:</label>
            <FontAwesomeIcon onClick={() => setShowSchool(!showSchool)} className="dropdown-icon" icon={ !showSchool ? faAngleUp : faAngleDown}/>
            <div className="progress-bar">
              <div className="progress-bar-content"></div>
            </div>
            <label  className={`school-content ${!showSchool && "shrink"}`}>
              
              {classes && classes.map(class_item => (
                <div key={class_item.id}>
                <label>{class_item.name}</label>
                <div className="progress-bar-children">
                  <div className="progress-bar-content"></div>
                </div>
                </div>
              ))}
              
              <button className="add-class-btn" onClick={() => setAddingClass(!addingClass)}><FontAwesomeIcon icon={faPlus}/>&nbsp;Add Class</button>
              <label className={`add-class-content ${!addingClass && "shrink"}`}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Class Name"></input>
                <div className="addClass-btn-container">
                  <button className="cancel-btn" onClick={() => setAddingClass(!addingClass)}>Cancel</button>
                  <button className="submit-btn" onClick={(e) => create_class(e, name)}>Create</button>
                </div>
              </label>
            </label>
          </div>

          <label className="progress-label" >Training:</label>
          <div className="progress-bar">
            <div className="progress-bar-content"></div>
          </div>

          <label className="progress-label" >Sleep:</label>
          <div className="progress-bar">
            <div className="progress-bar-content"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
