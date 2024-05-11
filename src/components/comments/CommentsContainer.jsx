import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  createNewComment,
  deleteComment,
  updateComment,
} from "../../services/index/comments";

const CommentsContainer = ({
  className,
  logginedUserId,
  comments,
  postSlug,
}) => {
  const [affectedComment, setAffectedComment] = useState(null);
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const { mutate: mutateNewComment, isLoading: isLoadingNewComment } =
    useMutation({
      mutationFn: ({ desc, slug, parent, replyOnUser, token }) => {
        return createNewComment({
          token,
          desc,
          slug,
          parent,
          replyOnUser,
        });
      },

      onSuccess: () => {
        toast.success(
          "Your Comment is send successfull,it will be visible after the confirmation of the Admin"
        );
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateUpdateComment, isLoading: isLoadingUpdateComment } =
    useMutation({
      mutationFn: ({ desc, commentId, token }) => {
        return updateComment({
          token,
          desc,
          commentId,
        });
      },

      onSuccess: () => {
        toast.success("Your Comment is updated successfully");
        queryClient.invalidateQueries(["blog", postSlug]);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateDeleteComment, isLoading: isLoadingDeleteComment } =
    useMutation({
      mutationFn: ({ commentId, token }) => {
        return deleteComment({
          token,
          commentId,
        });
      },

      onSuccess: () => {
        toast.success("Your Comment is deleted successfully");
        queryClient.invalidateQueries(["blog", postSlug]);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      token: userState.userInfo.token,
      slug: postSlug,
    });
    setAffectedComment(null);
  };

  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({
      token: userState.userInfo.token,
      desc: value,
      commentId,
    });
    setAffectedComment(null);
  };

  const deleteCommentHandler = (commentId) => {
    mutateDeleteComment({
      token: userState.userInfo.token,
      commentId,
    });
  };

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Send"
        formSubmitHandler={(value) => addCommentHandler(value)}
        loading={isLoadingNewComment}
      />
      <div className="space-y-4 mt-8">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            logginedUserId={logginedUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addComment={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsContainer;
