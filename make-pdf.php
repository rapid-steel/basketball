<?php


$data = json_decode(file_get_contents('php://input'), $assoc = true);


include('fpdf.php');

$pdf= new FPDF();

$files = [];

foreach ($data['data'] as $index => $baseUrl) {


    if(!strpos($baseUrl, '.png')) {
        $file = __DIR__.'/tmp/'.md5(uniqid()) . '.png';
        $baseUrl = str_replace('data:image/png;base64,', '', $baseUrl);
        $baseUrl = str_replace(' ', '+', $baseUrl);
        $img = base64_decode($baseUrl);
        file_put_contents($file, $img);


    } else {
        $file = $baseUrl;
    }
    array_push($files, $file);

    if ($index % 2 == 0) {
        $pdf->AddPage('P');
        $pdf->Image($file,20,20);
    } else {
        $pdf->Image($file,20,150);
    }

}

$path = 'tmp/'.md5(uniqid()) . '.pdf';

$pdf->Output($path,'F');

echo $path;


foreach ($files as $file) {
    unset($file);
}