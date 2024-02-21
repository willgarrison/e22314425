<?php

require_once '../vendor/autoload.php';

function dump($var)
{
  echo '<pre>';
  print_r($var);
  echo '</pre>';
}

function get_songs($force_create)
{
  // if force_create is false, check if the songs.json file exists
  if ($force_create === false) {

    // if the songs.json file exists...
    if (file_exists('data/songs.json')) {

      // get modified time of the songs.json file
      $songs_json_modified_time = filemtime('data/songs.json');

      // get time passed since the songs.json file was last modified
      $time_passed = time() - $songs_json_modified_time;

      // if the songs.json file was modified less than N minutes ago, return the file
      $age_threshold_in_minutes = 5;
      if ($time_passed < 60 * $age_threshold_in_minutes) {
        // read the file
        $result = file_get_contents('data/songs.json');

        // decode the file
        $result = json_decode($result, true);

        // return the result
        return $result;
      }
    }
  }

  // instantiate the getID3 class
  $getId3 = new getID3;

  // create an array to hold the song files
  $song_files = [];

  // the files directory is made up of directories containing files
  // read the directories from the files directory
  $directories = scandir('files');

  // remove . and .. from the array
  $directories = array_diff($directories, array('.', '..'));

  // remove anything that starts with a dot
  $directories = array_filter($directories, function ($directory) {
    return strpos($directory, '.') !== 0;
  });

  // loop through the directories
  foreach ($directories as $directory) {
    // read the files from the directory
    $files = scandir('files/' . $directory);

    // remove anything that starts with a dot
    $files = array_filter($files, function ($file) {
      return strpos($file, '.') !== 0;
    });

    // loop through the files
    foreach ($files as $file) {

      // if the file type is not in the valid file types array, skip the file
      if (!in_array(pathinfo($file, PATHINFO_EXTENSION), ['mp3', 'wav', 'flac'])) {
        continue;
      }

      // create an array to hold the file details
      $file_details = [];

      // add the directory as the title to the file details array
      $file_details['title'] = $directory;

      // add the file to the file details array
      $file_details['file'] = $file;

      // get the file details
      $file_info = $getId3->analyze('files/' . $directory . '/' . $file);

      // add duration 
      $file_details['playtime_seconds'] = $file_info['playtime_seconds'];
      $file_details['playtime_string'] = $file_info['playtime_string'];

      // add the full path to the file details array
      $file_details['path'] = 'api/files/' . $directory . '/' . $file;

      // get the lyrics / notes file for the song
      $file_details['lyrics'] = '';

      // Check if there is a lyrics file for this song
      $lyrics_file = 'files/' . $directory . '/' . pathinfo($file, PATHINFO_FILENAME) . '.txt';
      if (file_exists($lyrics_file)) {
        $file_details['lyrics'] = file_get_contents($lyrics_file);
      } else {
        // if there is no lyrics file, create one
        file_put_contents($lyrics_file, '');
      }

      // set plays
      $file_details['plays'] = 0;

      // set playlist 
      $file_details['playlist'] = "Playlist 1";

      // add the file details to the song_files array
      $song_files[] = $file_details;
    }
  }

  $result = [
    'songs' => $song_files
  ];

  // save the result to a file
  file_put_contents('data/songs.json', json_encode($result));

  // return the result 
  return $result;
}

function perform_action($action, $force_create = false)
{
  // call the function based on the action
  switch ($action) {
    case 'get_songs':
      $result = get_songs($force_create);
      break;
    default:
      $result = [
        'error' => 'Invalid action'
      ];
  }

  // output the result
  return $result;
}

// get the action from the query string
$action = isset($_GET['action']) ? $_GET['action'] : null;
$force_create = isset($_GET['force_create']) ? $_GET['force_create'] : false;

if ($action) {
  // call the perform_action function with the action and file
  $result = perform_action($action, $force_create);

  // output the result
  echo json_encode($result);
}
