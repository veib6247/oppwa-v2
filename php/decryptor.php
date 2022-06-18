<?php
  $post = file_get_contents('php://input');

  // parse json string to object
  $data_object = json_decode($post);

  // input the required fields for decryption
  $key_from_configuration = $data_object->secret;
  $iv_from_http_header  = $data_object->initializationVector;
  $auth_tag_from_http_header =  $data_object->authenticationTag;
  $http_body = $data_object->encryptedBody;

  // decrypt the data
  $key = hex2bin($key_from_configuration);
  $iv = hex2bin($iv_from_http_header);
  $auth_tag = hex2bin($auth_tag_from_http_header);
  $cipher_text = hex2bin($http_body);    
  $result = openssl_decrypt($cipher_text, "aes-256-gcm", $key, OPENSSL_RAW_DATA, $iv, $auth_tag);

  // return response
  echo $result;
?>