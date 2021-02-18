import React from "react";
import "components/InterviewerListItem.scss";
import classnames from "classnames";

export default function InterviewerListItem(props) {

   const interviewItemClass = classnames (
       "interviewers__item", {"interviewers__item--selected": props.selected}
   )

   const interviewItemImgClass = classnames (
    "interviewers__item-image", {"interviewers__item--selected-image": props.selected}
)

  return (
    <li className={interviewItemClass} onClick={props.setInterviewer}>
       <img
          className={interviewItemImgClass}
          src={props.avatar}
          alt={props.name}
      />
     {props.selected && props.name}
    </li>
  );
}