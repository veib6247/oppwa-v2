<?php
// Start the session
session_start();

// read posted data
$post = file_get_contents('php://input');

// parse json string to object
$data_object = json_decode($post);

$responseData = request($data_object->url, $data_object->data, $data_object->authToken);

echo $responseData;

function request($url, $data, $accessToken)
{
 $ch = curl_init();

 curl_setopt_array($ch, array(
  CURLOPT_URL            => $url . "?" . "entityId=" . get_entity($data),
  CURLOPT_HTTPHEADER     => array('Authorization:Bearer ' . $accessToken),
  CURLOPT_CUSTOMREQUEST  => 'GET',
  CURLOPT_SSL_VERIFYPEER => true,
  CURLOPT_RETURNTRANSFER => true,
 ));

 $responseData = curl_exec($ch);

 if (curl_errno($ch)) {
  return curl_error($ch);
 }

 curl_close($ch);

 return $responseData;
}

function get_entity($str_data)
{
 # chop the strings and locate the entityId parameter
 $entity_parameter = explode('&', $str_data);

 foreach ($entity_parameter as $item) {
  $key = explode('=', $item)[0];

  if ($key == 'entityId') {
   $value = explode('=', $item)[1];
  }
 }

 return $value;
}
