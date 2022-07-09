import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { useEffect, useRef, useState } from "react";
import { firebaseApp, auth } from "../firebase";
import {
  getDatabase,
  ref,
  get,
  push,
  update,
  onValue,
  remove,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import TaskTwoToneIcon from "@mui/icons-material/TaskTwoTone";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format, set } from "date-fns";
import Swal from "sweetalert2";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ToDo = function () {
  const [newChore, setNewChore] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [fetchDb, setFetchDb] = useState(true);
  const [fullData, setFullData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentEdit, setCurrentEdit] = useState("");
  const [updatedChore, setUpdatedChore] = useState("");
  const ulRef = useRef();
  const handleNewChore = function (e) {
    setNewChore(e.target.value);
  };
  const handleAddChore = function () {
    const database = getDatabase(firebaseApp);
    setFetchDb(!fetchDb);

    if (newChore !== "") {
      push(ref(database, `${currentUser.uid}/to-do/list`), {
        description: `${newChore}`,
        createdAt: format(new Date(), "MMM do yyyy h:mmaaaa"),
        completed: false,
      }).then(function () {
        setNewChore("");
        if (ulRef.current) {
          ulRef.current.lastElementChild.scrollIntoView({
            behaviour: "smooth",
          });
        }
      });
    }
  };
  const handleCompleteTask = function (e) {
    let target = e.target.id;
    let text = [];
    let check = false;
    fullData.forEach(function (ev) {
      if (ev.key === target) {
        text.push(ev.name);
      }
      if (ev.key === target && ev.completed === true) {
        check = true;
      }
    });
    if (check === true) {
      Swal.fire({
        title: "Task already completed",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
      });
    } else {
      const database = getDatabase(firebaseApp);
      Swal.fire({
        title: "Mark task as completed?",
        text: `Task: ${text[0]}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, it's complete",
        cancelButtonText: "No, go back",
      }).then((result) => {
        if (result.isConfirmed) {
          update(
            ref(database, `${currentUser.uid}/to-do/list/${e.target.id}`),
            {
              completed: true,
              completedAt: format(new Date(), "MMM do yyyy h:mm aaaa"),
            }
          );
        } else {
          return;
        }
      });
    }
  };
  const handleRemoveTask = function (e) {
    const database = getDatabase(firebaseApp);
    const removeRef = ref(
      database,
      `${currentUser.uid}/to-do/list/${e.target.id}`
    );
    let target = e.target.id;
    let text = [];
    fullData.forEach(function (ev) {
      if (ev.key === target) {
        text.push(ev.name);
      }
    });
    Swal.fire({
      title: "Remove task from list?",
      text: `Task: ${text[0]}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "No, don't remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        remove(removeRef);
      } else {
        return;
      }
    });
  };
  const handleEditChore = function (e) {
    setOpenEdit(true);
    setCurrentEdit(e.target.classList[2]);
  };
  const handleClose = function () {
    setOpenEdit(false);
  };
  const handleUpdatedChore = function (e) {
    setUpdatedChore(e.target.value);
  };
  const handleCloseConfirm = function () {
    setOpenEdit(false);
    const database = getDatabase(firebaseApp);
    update(ref(database, `${currentUser.uid}/to-do/list/${currentEdit}`), {
      description: updatedChore,
    });
    setFetchDb(!fetchDb);
  };
  useEffect(
    function () {
      const database = getDatabase(firebaseApp);
      const dbRef = ref(database, `${currentUser.uid}/to-do/list`);
      onValue(dbRef, function (res) {
        const newState = [];
        const data = res.val();
        for (let item in data) {
          newState.push({
            key: item,
            name: data[item].description,
            time: data[item].createdAt,
            completed: data[item].completed,
            completeTime: data[item].completedAt,
          });
        }
        setFullData(newState);
      });
    },
    [fetchDb]
  );
  useEffect(
    function () {
      setFetchDb(!fetchDb);
      onAuthStateChanged(auth, (current) => {
        setCurrentUser(current);
      });
    },
    [currentUser]
  );

  return (
    <div className="to-do-container wrapper">
      <Dialog open={openEdit} onClose={handleClose}>
        <DialogContent sx={{ width: "100%" }}>
          <DialogContentText>
            Edit your task in the field below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            variant="standard"
            onChange={handleUpdatedChore}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCloseConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <div className="to-do-content">
        <h2>TO DO LIST</h2>
        <ul ref={ulRef}>
          {fullData[0] !== undefined &&
            fullData.map(function (item) {
              return (
                <li key={item.key}>
                  <EditTwoToneIcon
                    fontSize="small"
                    id="edit-chore"
                    onClick={handleEditChore}
                    className={item.key}
                  />
                  <Accordion disableGutters id="list-item-accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                      className={
                        item.completeTime !== undefined
                          ? "completed-task"
                          : null
                      }
                    >
                      <Typography className="list-item-details">
                        {item.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Created: {item.time} <br />
                        {item.completeTime !== undefined
                          ? `Completed: ${item.completeTime}`
                          : `Not Complete`}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <div className="add-delete">
                    <TaskTwoToneIcon
                      id={item.key}
                      onClick={handleCompleteTask}
                    />
                    <span>/</span>
                    <DeleteTwoToneIcon
                      id={item.key}
                      onClick={handleRemoveTask}
                    />
                  </div>
                </li>
              );
            })}
        </ul>
        <div className="add-chore-container">
          <TextField
            id="standard-basic"
            label="Item Description"
            variant="standard"
            onChange={handleNewChore}
            value={newChore}
            onKeyDown={function (e) {
              if (e.code === "Enter") {
                handleAddChore();
              }
            }}
          />
          <Fab
            onClick={handleAddChore}
            size="small"
            color="primary"
            aria-label="add"
            sx={{ marginLeft: "20px" }}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>
    </div>
  );
};

export default ToDo;
