import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { userContext } from "../../App";

const Profile = () => {
  const { state, dispatch } = useContext(userContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/mypost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.mypost);
        setData(data.mypost);
      });
  }, []);

  return (
    <div className="profile">
      <div className="main-profile">
        <div className="prof">
          <div>
            <div className="profile-pic">
              <img
                src="https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt="..."
              />
              <p>{state ? state.name : "Loading"}</p>
            </div>
          </div>
          <div className="user-feed">
            <div className="follow-count">
              <h5>30 </h5>
              <p>Posts</p>
            </div>
            <div className="follow-count">
              <h5>30 </h5>
              <p>Followers</p>
            </div>
            <div className="follow-count">
              <h5>30 </h5>
              <p>Following</p>
            </div>
          </div>
        </div>
        <div className="post-head">
          <h5 className="posts-section">Posts</h5>
          <span>|</span>
          <h5 className="tags-section">Tags</h5>
        </div>
        <div className="gallery">
          {data.map((img) => {
            return (
              <img key={img._id} className="item" src={img.photo} alt="..." />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
