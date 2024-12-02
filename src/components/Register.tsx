import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa"; // Icon import for Lock (Bootstrap has no built-in lock icon)
import mqtt from "mqtt";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
  Card,
} from "react-bootstrap";

type Role =
  | "Instructor"
  | "Trainee"
  | "Maintenance"
  | "Admin"
  | "Instructor_Admin";

const Register = () => {
  const [name, setName] = useState("");
  const [rNumber, setRNumber] = useState("");
  const [rank, setRank] = useState("");
  const [ship, setShip] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [dateOfRegistration] = useState(new Date().toLocaleDateString());
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const client = mqtt.connect("ws://192.168.0.102:6000"); // WebSocket URL

    client.on("connect", () => {
      console.log("Connected to MQTT broker!");
      client.subscribe("admin/response");
    });

    client.on("error", (err) => {
      console.log("MQTT connection error:", err);
    });

    client.on("message", (topic, message) => {
      if (topic === "admin/response") {
        const payload = JSON.parse(message.toString());
        setNotification(
          `Admin has ${payload.status} your registration for User ID: ${payload.user_id}`
        );
      }
    });

    return () => client.end();
  }, []);

  const handleRegister = async () => {
    console.log("Register button clicked!"); // Debugging line
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Generate roleid based on selected role
    const roleid = getRoleId(role);

    const requestData = {
      name,
      rank,
      role,
      roleid, // roleid is now passed in the request
      r_number: rNumber,
      new_password: password,
      confirm_new_password: confirmPassword,
      ship,
      date_of_registration: dateOfRegistration,
    };

    console.log("Request Payload:", requestData); // Debug payload
    // return;

    try {
      const response = await fetch(
        "http://192.168.0.104:5000/auth/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("Response Status:", response.status); // Debug status

      if (response.ok) {
        const data = await response.json();
        console.log("Success Response:", data);
        alert("Registration successful!");
      } else {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        alert("Registration failed: " + errorData.message);
      }
    } catch (error) {
      console.error("Request Error:", error);
      alert("An error occurred.");
    }
  };

  // Helper function to get the roleid
  const getRoleId = (role: Role) => {
    switch (role) {
      case "Instructor":
        return 1;
      case "Trainee":
        return 2;
      case "Maintenance":
        return 3;
      case "Admin":
        return 4;
      case "Instructor_Admin":
        return 5;
      default:
        return 0;
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Col xs={12} md={6} lg={6}>
        <Card className="shadow-lg p-4">
          <Card.Body>
            <div
              className="avatar"
              style={{
                backgroundColor: "#1976d2",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
              }}
            >
              <FaLock color="#fff" size={30} />
            </div>
            <h4 className="text-center mb-4">Register</h4>
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="rNumber">
                <Form.Label>Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your number"
                  value={rNumber}
                  onChange={(e) => setRNumber(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="rank">
                <Form.Label>Rank</Form.Label>
                <Form.Control
                  as="select"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a Rank
                  </option>
                  <option value="Captain">Captain</option>
                  <option value="Lieutenant">Lieutenant</option>
                  <option value="Commander">Commander</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="ship">
                <Form.Label>Ship</Form.Label>
                <Form.Control
                  as="select"
                  value={ship}
                  onChange={(e) => setShip(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a ship
                  </option>
                  <option value="INSKalvari">INS Kalvari</option>
                  <option value="INSVikramaditya">INS Vikramaditya</option>
                  <option value="INSKochi">INS Kochi</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="Instructor">Instructor</option>
                  <option value="Trainee">Trainee</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Admin">Admin</option>
                  <option value="Instructor_Admin">Instructor_Admin</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="dateOfRegistration">
                <Form.Label>Date of Registration</Form.Label>
                <InputGroup>
                  <FormControl
                    type="text"
                    value={dateOfRegistration}
                    disabled
                    readOnly
                  />
                </InputGroup>
              </Form.Group>

              <Button
                variant="primary"
                onClick={handleRegister}
                className="mt-3"
              >
                Register
              </Button>
              {notification && (
                <div className="alert alert-info mt-3">{notification}</div>
              )}

              <Row className="mt-3">
                <Col className="text-center">
                  <Link to="/login">Already have an account? Login</Link>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default Register;

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import mqtt from "mqtt";
// import {
//   Container,
//   Col,
//   Form,
//   Button,
//   Card,
//   InputGroup,
//   FormControl,
// } from "react-bootstrap";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [rNumber, setRNumber] = useState("");
//   const [rank, setRank] = useState("");
//   const [ship, setShip] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [dateOfRegistration] = useState(new Date().toLocaleDateString());
//   const [notification, setNotification] = useState("");

//   useEffect(() => {
//     // Connect to the MQTT broker
//     const client = mqtt.connect("ws://localhost:6000"); // Update with your broker's WebSocket URL

//     client.on("connect", () => {
//       console.log("Connected to MQTT broker!");
//       client.subscribe("admin/response"); // Subscribe to admin responses
//     });

//     client.on("message", (topic, message) => {
//       if (topic === "admin/response") {
//         const payload = JSON.parse(message.toString());
//         setNotification(
//           `Admin has ${payload.status} your registration for User ID: ${payload.user_id}`
//         );
//       }
//     });

//     return () => client.end(); // Cleanup the connection on component unmount
//   }, []);

//   const handleRegister = async () => {
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     const requestData = {
//       name,
//       r_number: rNumber,
//       rank,
//       ship,
//       new_password: password,
//       confirm_new_password: confirmPassword,
//       role,
//       date_of_registration: dateOfRegistration,
//     };

//     try {
//       const response = await fetch(
//         "http://192.168.0.104:5000/auth/user/register",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(requestData),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         alert(data.message);
//       } else {
//         alert("Registration failed.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred.");
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center mt-5">
//       <Col xs={12} md={6} lg={6}>
//         <Card className="shadow-lg p-4">
//           <Card.Body>
//             <h4 className="text-center mb-4">Register</h4>
//             <Form>
//               {/* Registration Form Fields */}
//               <Form.Group controlId="name">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="rNumber">
//                 <Form.Label>Number</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your number"
//                   value={rNumber}
//                   onChange={(e) => setRNumber(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="rank">
//                 <Form.Label>Rank</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={rank}
//                   onChange={(e) => setRank(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select a Rank
//                   </option>
//                   <option value="Captain">Captain</option>
//                   <option value="Lieutenant">Lieutenant</option>
//                   <option value="Commander">Commander</option>
//                 </Form.Control>
//               </Form.Group>

//               <Form.Group controlId="ship">
//                 <Form.Label>Ship</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={ship}
//                   onChange={(e) => setShip(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select a ship
//                   </option>
//                   <option value="INSKalvari">INS Kalvari</option>
//                   <option value="INSVikramaditya">INS Vikramaditya</option>
//                   <option value="INSKochi">INS Kochi</option>
//                 </Form.Control>
//               </Form.Group>

//               <Form.Group controlId="password">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="confirmPassword">
//                 <Form.Label>Confirm Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   placeholder="Confirm your password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="role">
//                 <Form.Label>Role</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select a role
//                   </option>
//                   <option value="Instructor">Instructor</option>
//                   <option value="Trainee">Trainee</option>
//                   <option value="Maintenance">Maintenance</option>
//                   <option value="Admin">Admin</option>
//                   <option value="Instructor_Admin">Instructor_Admin</option>
//                 </Form.Control>
//               </Form.Group>

//               <Form.Group controlId="dateOfRegistration">
//                 <Form.Label>Date of Registration</Form.Label>
//                 <InputGroup>
//                   <FormControl
//                     type="text"
//                     value={dateOfRegistration}
//                     disabled
//                     readOnly
//                   />
//                 </InputGroup>
//               </Form.Group>

//               <Button
//                 variant="primary"
//                 onClick={handleRegister}
//                 className="mt-3"
//               >
//                 Register
//               </Button>
//             </Form>

//             {notification && (
//               <div className="alert alert-info mt-3">{notification}</div>
//             )}
//           </Card.Body>
//         </Card>
//       </Col>
//     </Container>
//   );
// };

// export default Register;
