// (function(){
// 	$(document).ready(function(){
// 		var padding = 28,
// 			padding2 = 12;
// 		var imgNum = $('.img-wrapper').length;
	  
// 		$('.ppt').slick({
// 		  	// arrows: true,
// 		  	slidesToShow: 1,
// 	  		slidesToScroll: 1,
// 	  		// lazyLoad: 'ondemand',
// 	  		adaptiveHeight:true,
// 		  	prevArrow: '<div class="slick-prev"><span class="sr-text">previous page</span></div>',
// 	  		nextArrow: '<div class="slick-next"><span class="sr-text">next page</span></div>'
// 		});
 
// 		var windowWidth = $(window).width();
// 		var nextWidth = $(".slick-next").width();
// 		var nextLeft = (windowWidth-nextWidth)/2;
 
// 		$(".slick-prev").css('display','none');
// 		$(".slick-next").css('left','50%');
		 
// 		var initialNextLeft = $(".slick-next").offset().left - nextWidth/2;
// 		$(".slick-next").offset({left: initialNextLeft});
		 
// 		var initialSlide = $('.ppt').slick('slickCurrentSlide');
// 		var initialIndex = initialSlide+1;
		 
// 		var initialHeight = $('.img-wrapper').eq(initialIndex).height();
 
// 		$('.slick-arrow').css('top',initialHeight+padding);


// 		$('.ppt').on('beforeChange', function(event, slick, currentSlide, nextSlide){

// 	  		var nextIndex = nextSlide+1;
// 	  		var currentHeight = $('.img-wrapper').eq(nextIndex).height();
// 	  		$('.slick-arrow').css('top',currentHeight+padding);
// 	  		if(nextSlide == 0){
// 	  			$(".slick-prev").css('display','none');
// 	  			$(".slick-next").offset({left: initialNextLeft});
// 	  		}else{
// 	  			$(".slick-prev").css('display','block');
// 	  			$(".slick-prev").css('left','50%');
// 	  			var prevWidth = $(".slick-prev").width();
// 	  			var prevLeft = $(".slick-prev").offset().left - 55- prevWidth/2;
// 	  			$(".slick-prev").offset({left: prevLeft});

	  			
// 	  			$(".slick-next").css('left','50%');
// 	  			var nextLeft = $(".slick-next").offset().left + 55 ;
// 	  			$(".slick-next").offset({left: nextLeft});

// 	  		}
// 	  		if(nextSlide == (imgNum-1) ){
// 	  			var dot = "<i class='fa fa-circle dot' aria-hidden='true'></i>";
// 	  			$('.ppt').append(dot);
// 	  			$('.dot').css('top',currentHeight+padding-10);
// 	  			var dotLeft = $('.dot').offset().left - $('.dot').width()/2;
// 	  			$('.dot').offset({left: dotLeft+10});
	  			
// 	  			$(".slick-prev").css('display','block');

// 	  			var picWidth = $(".ppt").width()-20;
// 	  			var prevWidth = $(".slick-prev").width();
// 				$(".slick-prev").css('left','50%');	
// 	  			var prevLeft = $(".slick-prev").offset().left - picWidth/2 +padding2;
// 	  			$(".slick-prev").offset({left: prevLeft});
	  			
// 	  			$('.slick-next').children().first().text('first page');
// 	  			$(".slick-next").css('left','50%');
// 	  			var nextLeft = $(".slick-next").offset().left + picWidth/2+ 20 - prevWidth - padding2 ;
// 	  			$(".slick-next").offset({left: nextLeft});

// 	  		}else{
// 	  			$('.slick-next').children().first().text('next page');
// 	  			if($('.dot')){
// 	  				$('.dot').remove();
// 	  			}
// 	  		}
// 		});
// 	});
// }());