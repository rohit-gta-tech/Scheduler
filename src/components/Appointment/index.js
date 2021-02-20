import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode"


export default function Appointment(props) {
    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";
    const DELETING = "DELETING";
    const CONFIRMDEL = "CONFIRMDEL";
    const EDIT = "EDIT";
    const ERROR_SAVE = "ERROR_SAVE";
    const ERROR_DELETE = "ERROR_DELETE";

    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );

    function save(name, interviewer) {
        const interview = {
          student: name,
          interviewer
        };
        transition(SAVING);
        props.bookInterview(props.id, interview).then(() => transition(SHOW)).catch(() => transition(ERROR_SAVE, true))
    }

    function remove() {
      transition(DELETING, true);
      props.removeInterview(props.id).then(() => transition(EMPTY)).catch(() => transition(ERROR_DELETE, true))
    }
 
    return (<article className="appointment">
        <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
           <Show
              student={props.interview.student}
              interviewer={props.interview.interviewer}
              onDelete={() => transition(CONFIRMDEL)}
              onEdit={() => transition(EDIT)}
           />
        )}
        {mode === CREATE && (
            <Form 
              interviewers={props.interviewers}
              onCancel={back}
              onSave={save}
            />
        )}
        {mode === EDIT && (
            <Form 
              name={props.interview.student}
              interviewer={props.interview.interviewer.id}
              interviewers={props.interviewers}
              onCancel={back}
              onSave={save}
            />
        )}
        {mode === SAVING && (
            <Status 
              message="Please hold on while we save your appointment"
            />
        )}
        {mode === DELETING && (
            <Status 
              message="Please hold on while we delete your appointment"
            />
        )}
        {mode === CONFIRMDEL && (
            <Confirm 
              message="Do you want to delete your appointment?"
              onCancel={back}
              onConfirm={remove}
            />
        )}
        {mode === ERROR_SAVE && (
            <Error 
              message="Could not save appointment"
              onClose={back}
            />
        )}
        {mode === ERROR_DELETE && (
            <Error 
              message="Could not delete appointment"
              onClose={back}
            />
        )}
           </article>)
    };