import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import { useDispatch, useSelector } from 'react-redux';
import {loginSuccess} from "../redux/store.js";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const [loading, setLoading] = useState(false);

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  const login = async (formData) => {
    if (!validateInput(formData)) return;
    try {
      setLoading(true);
      let url = `${config.endpoint}/auth/login`;
      let response = await axios.post(url, formData);
      let data = response.data;
      let { username, success, token, balance } = data;
      // console.log(username,success,token,balance)
      setFormData({
        username: "",
        password: "",
      });
      setLoading(false);
      enqueueSnackbar("logged in successfully", { variant: "success" });
      if (success) {
        dispatch(loginSuccess())
        persistLogin(token, username, balance);
      }
      history.push("/");
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" },
        );
      }
    }
  };

  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("username is a required field", { variant: "warning" });
      return false;
    }
    if (data.password === "") {
      enqueueSnackbar("password is a  required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleChange}
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => login(formData)}
          >
            LOGIN TO QKART
          </Button>
          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
