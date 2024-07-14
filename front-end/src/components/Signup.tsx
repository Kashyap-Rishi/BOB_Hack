import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Paper, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";

interface CustomJwtPayload {
  email?: string;
  name?: string;
}

const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Signup = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#F6F5F2",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: theme.spacing(4),
          textAlign: "center",
          animation: `${bounceAnimation} 2s infinite`,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ marginBottom: theme.spacing(2) }}
        >
          CRM Software
        </Typography>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Box>
            <GoogleLogin
              onSuccess={(credentialResponse: any) => {
                if (credentialResponse.credential) {
                  try {
                    const decoded = jwtDecode<CustomJwtPayload>(
                      credentialResponse.credential
                    );

                    if (decoded.name) {
                      const username = decoded.name;

                      navigate(`/dashboard/file-upload`);
                    }
                  } catch (error) {
                    console.error("Failed to decode JWT", error);
                  }
                } else {
                  console.error("Credential is undefined");
                }
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </Box>
        </Slide>
      </Paper>
    </Container>
  );
};

export default Signup;
