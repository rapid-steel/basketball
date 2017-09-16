<?php
$type = '.'.str_replace('image/','',$_FILES['img']['type']);
$name = 'tmp/'.md5(uniqid());
$file = $name . $type;

if (move_uploaded_file($_FILES['img']['tmp_name'],__DIR__.'/'.$file)) {


    list($oldwidth, $oldheight) = getimagesize($file);

    $width = $oldwidth;
    $height = $oldheight;

    if($oldwidth > 650) {
        $width = 650;
        $height = $height / $oldwidth * 650;
        $oldheight = $height;
    }

    if($height > 400) {
        $height = 400;
        $width = $width / $oldheight * 400;
    }

    $resized = imagecreatetruecolor(650, 400);

    $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
    imagefill($resized, 0, 0, $transparent);

    imagesavealpha($resized, true);

    SWITCH ($type) {
        case '.jpeg':
            $source = @imagecreatefromjpeg($file);
            break;
        case '.png':
            $source = @imagecreatefrompng($file);
            break;
        case '.gif':
            $source = @imagecreatefromgif($file);
            break;
    }

    list($oldwidth, $oldheight) = getimagesize($file);

    imagecopyresampled($resized, $source, (650 - $width)/2, (400 - $height)/2, 0, 0, $width, $height, $oldwidth, $oldheight);
    imagepng($resized, $name.'.png');


    echo $name.'.png';
}



