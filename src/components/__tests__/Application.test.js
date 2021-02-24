import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, getByTestId, getAllByTestId, prettyDOM, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Please hold on while we save your appointment")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const bookedAppointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"))
    fireEvent.click(getByAltText(bookedAppointment, "Delete"));
    expect(getByText(bookedAppointment, "Do you want to delete your appointment?")).toBeInTheDocument();
    fireEvent.click(queryByText(bookedAppointment, "Confirm"));
    expect(getByText(bookedAppointment, "Please hold on while we delete your appointment")).toBeInTheDocument();
    await waitForElement(() => getByAltText(bookedAppointment, "Add"));
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const bookedAppointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"))
    fireEvent.click(getByAltText(bookedAppointment, "Edit"));
    fireEvent.change(getByTestId(bookedAppointment, "student-name-input"), {
      target: { value: "Karim Benzema" }
    });
    fireEvent.click(getByAltText(bookedAppointment, "Sylvia Palmer"));
    fireEvent.click(getByText(bookedAppointment, "Save"));
    expect(getByText(bookedAppointment, "Please hold on while we save your appointment")).toBeInTheDocument();

    await waitForElement(() => queryByText(bookedAppointment, "Karim Benzema"));
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Please hold on while we save your appointment")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Close"));
    expect(getByText(appointment, "Could not save appointment"));
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByTestId(appointment, "student-name-input")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const bookedAppointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"))
    fireEvent.click(getByAltText(bookedAppointment, "Delete"));
    expect(getByText(bookedAppointment, "Do you want to delete your appointment?")).toBeInTheDocument();
    fireEvent.click(queryByText(bookedAppointment, "Confirm"));
    expect(getByText(bookedAppointment, "Please hold on while we delete your appointment")).toBeInTheDocument();
    await waitForElement(() => getByAltText(bookedAppointment, "Close"));
    expect(getByText(bookedAppointment, "Could not delete appointment"));
    fireEvent.click(getByAltText(bookedAppointment, "Close"));
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();

  });

})

 


