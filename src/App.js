import "./App.css";
import axios from "axios";
import React, { useState } from "react";
import { MusicNote } from "@mui/icons-material";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Box, Card, Grid, Link, Button, TextField } from "@mui/material";

function App() {
  const [URL, setURL] = useState("");
  const [info, setInfo] = useState(null);
  const [loader, setLoader] = useState(false);

  // This constant is required for ReCaptcha, which is used by KOR Connect
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleCreateLink = async () => {
    setLoader(true);
    setInfo(null);

    let code;

    if (URL.includes("youtube.com")) {
      code = URL.replace("https://www.youtube.com/watch?v=", "");
    }

    if (URL.includes("youtu.be")) {
      code = URL.replace("https://youtu.be/", "");
    }

    /* We'll need this constant to make request */
    const token = await executeRecaptcha("submit");
    const timestamp = new Date().toUTCString();
    // You need to append the path of the endpoint you are calling to the KOR Connect base URI
    axios
      .get(`${process.env.REACT_APP_API_URL}/youtube-download/dl?id=${code}`, {
        headers: {
          /* Place your headers here: */
          token,
          timestamp,
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        setInfo(response.data);
        setLoader(false);
        setURL("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box>
      <Card variant="outlined" color="secondary">
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              autoFocus
              value={URL}
              color="success"
              variant="standard"
              label="Paste your YouTube link here"
              onChange={(e) => setURL(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleCreateLink}
            >
              <MusicNote />
            </Button>
          </Grid>
        </Grid>
      </Card>
      <div className="container">
        <div className="middle">
          {loader && (
            <div>
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
              <div className="bar bar4"></div>
              <div className="bar bar5"></div>
              <div className="bar bar6"></div>
              <div className="bar bar7"></div>
              <div className="bar bar8"></div>
            </div>
          )}
          {info && (
            <div>
              <Link href={info.link} color="inherit" p={2}>
                Download
              </Link>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}

export default App;
