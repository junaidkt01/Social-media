import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import { userContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState(false);
  // const [makeComent, setMakeComment] = useState([]);
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    fetch("/allposts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log("err"));
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log("like err"));
  };

  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log("unLike err", err));
  };

  const makeComment = async (text, postId) => {
    await fetch("/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        name: localStorage.getItem("user"),
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result", result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log("comment error"));
  };

  const deletePost = (postid) => {
    fetch(`deletepost/${postid}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result.id;
        });
        setData(newData);
      });
  };

  return (
    <div className="posts">
      {data.map((items, index) => {
        // console.log("items", items);
        return (
          <div key={index} className="card">
            <Link to={`/profile/${items.postedby._id}`}>
              <h1>
                {items.postedby.name}
                <i
                  style={{ marginLeft: "17.5rem" }}
                  onClick={() => deletePost(items._id)}
                  class="fa-solid fa-remove"
                ></i>
              </h1>
            </Link>
            <div>
              <img src={items.photo} alt="..." />
              <div className="post-icons">
                {items.likes.includes(state._id) ? (
                  <i
                    onClick={() => unLikePost(items._id)}
                    class="fa-solid fa-heart"
                  ></i>
                ) : (
                  <i
                    onClick={() => likePost(items._id)}
                    class="fa-regular fa-heart"
                  ></i>
                )}
                <i
                  onClick={() => setComment(!comment)}
                  class="fa-regular fa-comment"
                ></i>
                <i class="fa-solid fa-share"></i>
              </div>
              <h4>{items.likes.length} Likes</h4>
              <h4>{items.title}</h4>
              <p>{items.body}</p>
              {comment && (
                <>
                  {items.comment.map((record) => {
                    console.log("record", record);
                    return (
                      <h6>
                        <span>{record.postedby.name}: </span>
                        {record.text}
                      </h6>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, items._id);
                    }}
                  >
                    <input
                      className="comment"
                      type="text"
                      placeholder="Comment here"
                    />
                  </form>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
