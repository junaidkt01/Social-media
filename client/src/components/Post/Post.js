import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";

const Post = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title: title,
          body: description,
          photo: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
            console.log(data.error);
          } else {
            alert(data.message);
            navigate("/");
          }
        })
        .catch((err) => {
          alert("not ready");
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "socialnetwork");
    data.append("cloud_name", "dnhg3qk15");
    fetch("https://api.cloudinary.com/v1_1/dnhg3qk15/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err));
  };

  return (
    <div className="create-post">
      <div className="post-card">
        <label htmlFor="">Title</label> <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
        />
        <br />
        <label htmlFor="">Description</label>
        <br />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        />
        <br />
        <label htmlFor="">Picture</label>
        <br />
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <img className="postPic" src={url} alt="..." />
        <br />
        <button onClick={() => postDetails()} className="post-button">
          Post
        </button>
      </div>
    </div>
  );
};

export default Post;
