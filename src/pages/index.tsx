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











// This query is executed at run time by Apollo.
const GET_TODOS = gql`
{
 todos{ 
   task,
   id,
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
mutation delTask($id: ID!) {
  delTodo(id: $id) {
    text
  }
}
`




export default function Home() {

  const classes = useStyles();

  const [todos, setTodos] = useState([{}])
  let inputText;
  const [addTodo] = useMutation(ADD_TODO)
  const [delTask ] =useMutation(DELETE_TASK)




  const addTask = () => {
    addTodo({
      variables: {
        task: inputText.value
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    inputText.value = "";
  }

  const deleteTask = (e) => {
    e.preventDefault()
    delTask({
      variables: {
        id: e.target.id
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
  
  }


  const { loading, error, data } = useQuery(GET_TODOS);

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
      <button onClick={addTask}>Add Task</button>

      <br /><br /><br />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>TASK</StyledTableCell>
              <StyledTableCell>STATUS</StyledTableCell>
              <StyledTableCell>DELETE</StyledTableCell>
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

<button onClick={deleteTask}>
DeleteTask
  </button>

                </StyledTableCell>


              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


    </div>
  );

}