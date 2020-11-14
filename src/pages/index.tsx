import React, { useState } from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// materil ui tasks//////////////////////////////////////////////////////////////
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
)(TableCell);
const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}











// This query is executed at run time by Apollo.
const GET_TODOS = gql`
{
 todos{ 
  id,
   task,
   status
  
 }
}
`;

const ADD_TODO = gql`

mutation addTodo($task:String!)
{
addTodo(task :$task)
{
  task
}
}

`
const DELETE_TASK = gql`
mutation delTodo($id: ID!) {
  delTodo(id: $id) {
    task
 
  }
}
`
const UPDATE_TODO = gql`
  mutation updateTodo($id: String!, $task: String!) {
    updateTodo(id: $id, task: $task) {
      id
      task
    }
  }
`



export default function Home() {

  const classes = useStyles();

  const [todos, setTodos] = useState([{}])
  let inputText;
  const [addTodo] = useMutation(ADD_TODO)
  const [delTodo] = useMutation(DELETE_TASK)
  const [updateTodo] = useMutation(UPDATE_TODO);
  const { loading, error, data } = useQuery(GET_TODOS);

// Materil ui model
const [modalStyle] = React.useState(getModalStyle);
const [open, setOpen] = React.useState(false);

const handleOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const body = (
  <div style={modalStyle} className={classes.paper}>
    <h2 id="simple-modal-title">Text in a modal</h2>
    <p id="simple-modal-description">
      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    </p>
  
  </div>
);
// Materil ui model end

  const addTask = () => {
    addTodo({
      variables: {
        task: inputText.value,

      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    inputText.value = "";
  }

  const deleteTask = (e) => {
    e.preventDefault()
    console.log(JSON.stringify(e.currentTarget.value))
    delTodo({


      variables: {
        id: e.currentTarget.value,
      },
      refetchQueries: [{ query: GET_TODOS }]
    })

  }




  if (loading)
    return <h2>Loading.....</h2>
  if (loading)
    return <h2>Error</h2>

  return (
    <div>

      <label>
        <h1> Add Task </h1>
        <input type="text" ref={node => {
          inputText = node;
        }} />
      </label>
      <Button variant="contained" color="primary" onClick={addTask}>Add Task</Button>

      <br /><br /><br />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>TASK</StyledTableCell>
              <StyledTableCell>STATUS</StyledTableCell>
              <StyledTableCell>DELETE</StyledTableCell>
              <StyledTableCell>UPDATE</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.todos.map((da) => (
              <StyledTableRow key={da.id}>
                <StyledTableCell>
                  {da.id}
                </StyledTableCell>



                <StyledTableCell >{da.task}</StyledTableCell>
                <StyledTableCell>{da.status.toString()}</StyledTableCell>

                <StyledTableCell>

                  <Button variant="contained" color="secondary" onClick={deleteTask} value={da.id}>
                    DeleteTask
  </Button>

                </StyledTableCell>
                <StyledTableCell>
                <Button variant="contained" color="primary" onClick={()=>{
                  handleOpen()
                }}>
                    Update Task
  </Button>
              
                </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );

}