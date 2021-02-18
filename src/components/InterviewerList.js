import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";


export default function InterviewerList(props) {

    const interviewerList = props.interviewers.map((interviewer) => {
        return <InterviewerListItem 
           key={interviewer.id} 
           name={interviewer.name} 
           avatar={interviewer.avatar} 
           selected={interviewer.id === props.value} 
           setInterviewer={event => props.onChange(interviewer.id)}>
        </InterviewerListItem>
    })
    return (
        <article>
            <p className="interviewers__header">Interviewer</p>
            <ul className="interviewers__list">
               {interviewerList}
            </ul>
        </article>
    )
};