"use client";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import KeyIcon from "@mui/icons-material/Key";

import VerifiedIcon from "@mui/icons-material/Verified";

import { useState } from "react";
import {
  Alert,
  Badge,
  Checkbox,
  LinearProgress,
  StyledEngineProvider,
} from "@mui/material";
import UploadOne from "./upload/uploadOne";
import Feedback from "./feedback";
import Result from "./result";

export default function TabOne() {
  // Form States
  const [senderName, setSenderName] = useState("");
  const [emailService, setEmailService] = useState("gmail");
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordService, setPasswordService] = useState("");
  const [greeting, setGreeting] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [bestRegards, setBestRegards] = useState("");
  const [contactsList, setContactsList] = useState([]);

  // Error states
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // counter state
  const [counter, setCounter] = useState(0);

  // succesful & unsuccessful states
  const [queriedEmail, setQueriedEmail] = useState({
    successfulEmails: [],
    unsuccessfulEmails: [],
  });

  // MUI states
  const [checked, setChecked] = useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(false);
    setSuccess(false);

    if (!emailAddress || !passwordService || !body) {
      setError(
        "Please fill your email address, app password, and body of the message and try again"
      );
      return;
    }

    if (contactsList.length == 0) {
      setError("No email contacts were uploaded, please upload some");
      return;
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    setLoading(true);

    async function delayedLoop() {
      var delay = 2000; //  2 seconds

      let successfulEmail = [];
      let unsuccessfulEmail = [];
      for (var i = 0; i < contactsList.length; i++) {
        setCounter(i + 1);

        const response = await fetch("/api/bulkemail/templateOne", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            subject: checked ? senderName : subject,
            body,
            title,
            greeting,
            bestRegards,
            recipient_email: contactsList[i],
            emailService,
            sender_email: emailAddress,
            password: passwordService,
            name: senderName,
          }),
        });

        if (!response.ok) {
          unsuccessfulEmail.push(contactsList[i]);
        } else {
          successfulEmail.push(contactsList[i]);
        }

        await sleep(delay);
      }

      setLoading(false);
      setQueriedEmail({
        successfulEmails: successfulEmail,
        unsuccessfulEmails: unsuccessfulEmail,
      });
      setSuccess(true);
    }

    delayedLoop();
  };

  return (
    <span className="space-y-5">
      {/* Email Service */}
      <span>
        <select
          className="py-2 px-3 border rounded-lg"
          onChange={(event) => setEmailService(event.target.value)}
        >
          <option defaultValue value="gmail">
            Gmail
          </option>
          <option value="mail.ru">Mail.ru</option>
          <option value="yahoo">Yahoo</option>
        </select>
        <span className="ml-3">
          <AttachEmailIcon className="text-green-600 mr-3" />
          Email Service
        </span>
      </span>

      {/* Email Address to be used */}
      <span className="flex">
        <input
          type="text"
          placeholder="Email Address e.g example@mail.ru / example@gmail.com"
          className="login_input"
          onChange={(event) => setEmailAddress(event.target.value)}
        />

        <AlternateEmailIcon className="my-auto ml-3 text-blue-400" />
      </span>

      {/* Email Password */}
      <span className="flex">
        <input
          type="text"
          placeholder="Email App Password"
          className="login_input"
          onChange={(event) => setPasswordService(event.target.value)}
        />
        <KeyIcon className="my-auto ml-3 text-red-400" />
      </span>

      {/* Sender Name */}
      <div>
        <Badge
          badgeContent="optional"
          color="info"
          className="w-full"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <input
            type="text"
            className="login_subject"
            placeholder="Sender Name"
            onChange={(e) => setSenderName(e.target.value)}
          ></input>
        </Badge>
      </div>

      {/* Subject */}
      <div>
        <input
          type="text"
          className="login_subject"
          placeholder="Type in your Subject"
          onChange={(e) => setSubject(e.target.value)}
        ></input>

        <span>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
          <span className="ml-1 my-2">Use the Sender Name as Subject</span>
        </span>
      </div>

      {/* Greeting */}
      <input
        type="text"
        className="login_subject"
        placeholder="Greeting"
        onChange={(e) => setGreeting(e.target.value)}
      ></input>

      {/* Title */}
      <input
        type="text"
        className="login_subject"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      ></input>

      {/* Message */}
      <textarea
        id="Body"
        rows="6"
        onChange={(e) => setBody(e.target.value)}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="Message Body"
      ></textarea>

      {/* Closing */}
      <input
        type="text"
        className="login_subject"
        placeholder="Closing e.g Best Regards"
        onChange={(e) => setBestRegards(e.target.value)}
      ></input>

      <UploadOne setContactsList={setContactsList} />
      {contactsList.length > 0 && (
        <div className="mt-5 text-lg">
          <VerifiedIcon className="text-green-500" /> {contactsList.length}{" "}
          Email contacts Retrieved
        </div>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {loading && <Feedback contactsList={contactsList} counter={counter} />}

      {success && <Result emails={queriedEmail.unsuccessfulEmails} />}

      <div>
        <button
          onClick={handleSubmit}
          className="py-3 px-5 m-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
        >
          Send message
        </button>
      </div>
    </span>
  );
}
