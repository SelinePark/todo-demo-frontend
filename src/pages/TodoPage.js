import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";

const TodoPage = ({ setUser }) => {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  const navigate = useNavigate();

  const getTasks = async () => {
    const response = await api.get("/tasks");
    setTodoList(response.data.data);
  };
  useEffect(() => {
    getTasks();
  }, []);
  const addTodo = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        getTasks();
      }
      setTodoValue("");
    } catch (error) {
      console.log("error:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log(id);
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Todo-demo</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-danger" onClick={handleLogout}>
              log out
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row className="add-item-row">
          <Col xs={12} sm={10}>
            <input
              type="text"
              placeholder="할일을 입력하세요"
              onChange={(event) => setTodoValue(event.target.value)}
              className="input-box"
              value={todoValue}
            />
          </Col>
          <Col xs={12} sm={2}>
            <button onClick={addTodo} className="button-add">
              추가
            </button>
          </Col>
        </Row>

        <TodoBoard
          todoList={todoList}
          deleteItem={deleteItem}
          toggleComplete={toggleComplete}
        />
      </Container>
    </>
  );
};

export default TodoPage;
