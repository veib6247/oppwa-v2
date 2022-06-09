<?php
// Start the session
session_start();

// read posted data
$post = file_get_contents('php://input');

// parse json string to object
$data_object = json_decode($post);

// Set session variables
$_SESSION["endPoint"] = $data_object->endPoint;
$_SESSION["parameters"] = $data_object->parameters;
$_SESSION["authToken"] = $data_object->authToken;

$responseData = request($data_object->endPoint, $data_object->parameters, $data_object->authToken);

echo $responseData;

function request($url, $data, $accessToken)
{
    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_HTTPHEADER => array('Authorization:Bearer ' . $accessToken),
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => $data,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_RETURNTRANSFER => true
    ));

    $responseData = curl_exec($ch);

    if (curl_errno($ch)) {
        return curl_error($ch);
    }

    curl_close($ch);

    return $responseData;
}