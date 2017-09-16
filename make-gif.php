<?php
ini_set('display_errors','Off');
include('GIFEncoder.class.php');

$data = json_decode(file_get_contents('php://input'), $assoc = true);

$files = array();



foreach ($data['data'] as $baseUrl) {


    if(strpos($baseUrl, 'data:image/png;base64,')) {
        $file = __DIR__.'/tmp/'.md5(uniqid()) . '.png';
        $baseUrl = str_replace('data:image/png;base64,', '', $baseUrl);
        $baseUrl = str_replace(' ', '+', $baseUrl);
        $img = base64_decode($baseUrl);
        file_put_contents($file, $img);


    } else {
        $file = $baseUrl;
    }
    $image = imagecreatefrompng($file);
    array_push($files, $file);

    ob_start();
    imagegif($image);
    $frames[] = ob_get_contents();
    $framed[] = 100;
    ob_end_clean();

}

$animation = 'tmp/'.md5(uniqid()) . '.gif';

$gif = new GIFEncoder($frames, $framed, 0, 0, 0, 0, 0, 'bin');
$fp = fopen(__DIR__.'/'.$animation, 'w');
fwrite($fp, $gif->GetAnimation());
fclose($fp);

ini_set('display_errors','On');

echo $animation;


foreach ($files as $file) {
    unset($file);
}




