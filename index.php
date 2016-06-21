<!Doctype html>
<html lang="en">
<head>
	<title>picture</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="style/style.css">
	<link rel="stylesheet" type="text/css" href="style/Grid.css">
	<link rel="stylesheet" href="style/jpreloader.css">
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
	<script src="js/jquery.kiss-slider.js"></script>
	<script type="text/javascript" src="js/jpreloader.min.js"></script>
</head>
<body>
	<div class="container">
		<div class="row">
			<ul id="slider">
				<?php
					class ImageFilter extends FilterIterator{
						public function accept(){
							return preg_match('@\.(gif|jpe?g|png|txt)$@i', $this->current());
						}
					}
					$filenames = array();

					foreach (new ImageFilter(new DirectoryIterator('images')) as $file) {
						if ($file->isFile()) {
            				$filenames[] = $file->getFilename();
        				}
        				
					   
					}
					sort($filenames);
					// print_r($filenames);
					// echo "\n";		
					foreach($filenames as $file){
						if (preg_match("/.txt/i", $file)){
							$rightDir = "images/".$file;
							$myfile = fopen($rightDir, "r") or die("Unable to open file!");

							echo "<li class='video'>".fread($myfile,filesize($rightDir))."</li>";

							fclose($myfile);
						}else{
							echo "<li><img src='images/".htmlentities($file)."'/></li>";
						}
					}
					
				?>
			</ul>
		</div>
		<div class="row">
			<div class="buttons">
				<div class="left">
					<button class="previous ctrBtn">previous page</button>
				</div>
				<div class="center">
					<i class='fa fa-circle dot' aria-hidden='true'></i>
				</div>
				<div class="right">
					<button  class="next ctrBtn">next page</button>
				</div>
			</div>
		</div>	
	</div>
</body>
<script>
	$(document).ready(function() {
        $('body').jpreLoader({
        	loaderVPos: '50%'
        });
    });

	$(window).load(function() {
	    $('#slider').kissSlider({
			prevSelector: ' .previous',
			nextSelector: ' .next'
		});
		$('#slider').kissSlider('setSize',{state:0});
	});


	function initVideos() {
	  // Find all video iframes on the page:
	  var iframes = $(".video").find("iframe");

	  // For each of them:
	  for (var i = 0; i < iframes.length; i++) {
	    // If "enablejsapi" is not set on the iframe's src, set it:
	    if (iframes[i].src.indexOf("enablejsapi") === -1) {
	      // ...check whether there is already a query string or not:
	      // (ie. whether to prefix "enablejsapi" with a "?" or an "&")
	      var prefix = (iframes[i].src.indexOf("?") === -1) ? "?" : "&amp;";
	      iframes[i].src += prefix + "enablejsapi=1";
	    }
	  }
	  // console.log(iframes);
	}
	initVideos();

	$('.ctrBtn').click(function(){
		$('iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');   
	});

</script>
</html>