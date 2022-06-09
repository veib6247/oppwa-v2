<?php
  // Start the session
  session_start();

  // encode sessions variables to JSON and return
  $session_data = array(
    "endPoint"=> $_SESSION["endPoint"],
    "parameters"=> $_SESSION["parameters"],
    "authToken" => $_SESSION["authToken"]
  );

  echo json_encode($session_data);
?>