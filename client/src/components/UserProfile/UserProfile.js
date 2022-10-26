import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import "./userProfile.css";
import { userContext } from "../../App";

const UserProfile = () => {
  const [prof, setProf] = useState();
  const { state, dispatch } = useContext(userContext);
  console.log("state-->", state);
  const [data, setData] = useState([]);
  const [name, setName] = useState([]);
  const { userid } = useParams();
  console.log(userid);
  // const [showFollow, setShowFollow] = useState(
  //   state ? !state.followers.includes(userid) : false
  // );
  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        console.log(data.posts);
        setName(data.user);
        setData(data.posts);
        setProf(data);
      });
  }, [userid]);
  //UNFOLLOW
  const unFollowUser = () => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json(res))
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProf((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            user: {
              ...prevState,
              users: {
                ...prevState.user,
                followers: newFollower,
              },
            },
          };
        });
        window.location.reload();
        // setShowFollow(false);
      });
  };

  // Follow
  const followUser = () => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json(res))
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProf((prevState) => {
          return {
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        // setShowFollow(true);
      });
  };

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
              <p>{name.name}</p>
            </div>
          </div>
          <div className="user-feed">
            <div className="follow-count">
              <h5>{data.length}</h5>
              <p>Posts</p>
            </div>
            <div className="follow-count">
              <h5>
                {prof === undefined
                  ? "Loading"
                  : prof.user.followers === undefined
                  ? "Loading"
                  : prof.user.followers.length}
              </h5>
              <p>Followers</p>
            </div>
            <div className="follow-count">
              <h5>
                {prof === undefined
                  ? "Loading"
                  : prof.user.following === undefined
                  ? "Loading"
                  : prof.user.following.length}
              </h5>
              <p>following</p>
            </div>
          </div>
        </div>
        {/* {!JSON.parse(localStorage.getItem("user").following.includes(userid)) &&
        showFollow ? (
          <button
            style={{ marginLeft: "4rem", padding: "2px" }}
            onClick={() => followUser()}
          >
            follow
          </button>
        ) : (
          <button
            style={{ marginLeft: "4rem", padding: "2px" }}
            onClick={() => unFollowUser()}
          >
            unfollow
          </button>
        )} */}

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

export default UserProfile;
