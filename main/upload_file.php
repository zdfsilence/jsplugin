<?php 
$arr = Array();
if ((($_FILES["file"]["type"] == "image/gif") 
|| ($_FILES["file"]["type"] == "image/jpeg") 
|| ($_FILES["file"]["type"] == "image/pjpeg")) 
&& ($_FILES["file"]["size"] < 200000)) 
{ 
	if ($_FILES["file"]["error"] > 0) 
	{ 	
		$arr["Result"] = "Error"; 
		$arr["Message"] = $_FILES["file"]["error"]; 
	} 
	else 
	{ 
		$arr["Upload"] = $_FILES["file"]["name"]; 
		$arr["Type"] = $_FILES["file"]["type"]; 
		$arr["Size"]= $_FILES["file"]["size"]; 
		

	// echo "Upload: " . $_FILES["file"]["name"] . "<br />"; 
	// echo "Type: " . $_FILES["file"]["type"] . "<br />"; 
	// echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />"; 
	// echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />"; 
		if (file_exists("upload/" . $_FILES["file"]["name"])) 
		{ 
			//echo $_FILES["file"]["name"] . " already exists. "; 
			$arr["Result"] = "Repeat"; 
			$arr["Message"] = "upload/" . $_FILES["file"]["name"]; 
		} 
		else 
		{ 
			move_uploaded_file($_FILES["file"]["tmp_name"], 
			"upload/" . $_FILES["file"]["name"]); 
			//echo "Stored in: " . "upload/" . $_FILES["file"]["name"]; 
			$arr["Result"] = "Success"; 
			$arr["Message"] = "upload/" . $_FILES["file"]["name"]; 
		} 
	} 
} 
else 
{ 
//echo "Invalid file"; 

$arr["Result"] = "Error"; 
$arr["Message"] = "Invalid file";
} 
echo json_encode($arr);
?> 