<?php
  // read posted data
  $post = file_get_contents('php://input');

  // parse json string to object
  $data_object = json_decode($post);

  function request($url, $data, $accessToken) {
  
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization:Bearer '. $accessToken));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $responseData = curl_exec($ch);

      if(curl_errno($ch)) {
        return curl_error($ch);
      }
    curl_close($ch);

    return $responseData;
  }

  $responseData = request($data_object->endPoint, $data_object->parameters, $data_object->authToken);
  
  echo $responseData;
?>