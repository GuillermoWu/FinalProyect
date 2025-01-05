import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faP,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Account = () => {
  const { user, fetchUser, axiosRequest } = useContext(UserContext);
  const [name, setName] = useState("");
  const [addingClass, setAddingClass] = useState(false)
  const [classes, setClasses] = useState([])

  const get_classes = async()=>{
    const response = await axiosRequest("/api/get_classes", "get")
    setClasses(response.data.classes)
  }

  const create_class = async(e) => {
    e.preventDefault()
    axiosRequest("/api/create_class", "post", {name})
  }

  useEffect(() => {
    fetchUser();
    get_classes()
  }, []);

  const [showSchool, setShowSchool] = useState(false)

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
              <div className="progress-bar-children">
                <div className="progress-bar-content"></div>
              </div>
              <button className="add-class-btn"><FontAwesomeIcon icon={faPlus}/>Add Class</button>
              <label>
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
