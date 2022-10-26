const express = require("express");
const router = express();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const Authentication = require("../middleware/Authentication");

// GET ALLPOST
router.get("/allposts", Authentication, (req, res) => {
  Post.find()
    .populate("postedby", "_id name")
    .populate("comment.postedby", "_id name")
    .then((posts) => res.json(posts))
    .catch((err) => res.json(err));
});

// CREATE POST

router.post("/createpost", Authentication, (req, res) => {
  const { title, body, photo } = req.body;
  if (!title || !body || !photo) {
    return res.json({ error: "please add the title and body and photo" });
  }
  const post = new Post({
    title,
    body,
    photo,
    postedby: req.user,
  });
  post
    .save()
    .then(() => {
      res.json({ message: "success to add" });
    })
    .catch(() => {
      res.json({ error: "failed to add" });
    });
});

// MY POST
router.get("/mypost", Authentication, (req, res) => {
  Post.find({ postedby: req.user.id })
    .populate("postedby", "_id name")
    // .populate("comments.postedby", "_id name")
    .then((mypost) => res.json({ mypost }))
    .catch((err) => res.json(err));
});

//COMMENTS

router.put("/comment", Authentication, async (req, res) => {
  const comment = {
    text: req.body.text,
    name: req.body.name,
    postedby: req.user,
  };
  await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comment: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedby", "_id name")
    .populate("comment.postedby", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.json(result);
      }
    });
});

// LIKE
router.put("/like", Authentication, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

// UNLIKE
router.put("/unlike", Authentication, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

//DELETE
router.delete("/deletepost/:postId", Authentication, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedby", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedby._id.toString() === req.user.id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
