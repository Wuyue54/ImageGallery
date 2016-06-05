/*
	JQuery KissSlider plugin
	v1.4.7
	https://github.com/VivienLN/jquery.kiss-slider
*/
(function ($) {
	var KissSlider = function ($container, options) {
		this.options = {};
		this.$container = null;
		this.$slides = null;

		this.currentIndex = null;
		this.animated = false;
		this.slideWidth = null;
		this.slideHeight = null;
		this.autoscrollInterval = null;

		this.startX = null;
		this.startY = null;
		this.startTime = null;

		return this.init($container, options);
	};
	KissSlider.instances = [];

	KissSlider.prototype.init = function($container, options) {
		// settings
		var defaults = {
			slideSelector: null,	// if null, get the direct children
			nextSelector: null,
			prevSelector: null,
			paginationSelector: null, 	// container where pagination liks are generated
			paginationBefore: '',		// '<li>'
			paginationAfter: '',		// '</li>'
			paginationCurrentClass: 'current', //
			startIndex: 0,
			startingZ: 1,			// z-index for the slides. Usefull if the slider have to display on top of other things
			slideDuration: 400,
			easing: 'swing',
			autoscrollDelay: 0,
			alwaysAutoscroll: false,// @since 1.4.4 Do not disable autoscroll when mouse is over the slideshow
			noAnim: false,			// Do not animate the slider
			beforeSlide: null,		// callback parameters : oldIndex, newIndex.
			afterSlide: null,		// callback parameters : oldIndex, newIndex.
			init: null,				// calls when the slider is ready
			allowSwipe: true		// @since 1.1 Allow swipe on touch-enabled devices
		};
		var that = this;
		var s = this.options = $.extend({}, defaults, options);

		// variables
		that.$container = $container;

		// show first slide
		that.$slides = s.slideSelector ? $(s.slideSelector) : this.$container.children();
		that.currentIndex = s.startIndex < that.$slides.length ? s.startIndex : 0;

		// set slidse css and add them to list
		that.refreshSlides();

		// pagination
		if(s.paginationSelector && that.$slides.length > 1) {
			for(var i = 0; i < that.$slides.length; i++) {
				$(s.paginationBefore + '<button>' + (i+1) + '</button>' + s.paginationAfter)
				.appendTo(s.paginationSelector)
				.data('kissSliderTarget', i);
			}
			$('button', s.paginationSelector).click(function(e) {
				that.paginationClick(this);
				e.preventDefault();
			});
			$('button', s.paginationSelector)
			.filter(function(){
				return $(this).data('kissSliderTarget') == s.startIndex;
			})
			.addClass('active');
		}
		// autoscroll (pause when mouse over)
		if(s.autoscrollDelay) {
			that.startAutoScroll(s.autoscrollDelay);
			if(!s.alwaysAutoscroll) {
				this.$container.mouseenter(function(){
					that.stopAutoScroll();
				});
				this.$container.mouseleave(function(){
					that.startAutoScroll(s.autoscrollDelay);
				});
			}
		}
		// resize event
		$(window).resize(function() {
			// return that.resizeSlider();
		});


		// prev/next events
		if(s.nextSelector) {
			var firstWidth = that.$slides.eq(0).children().first().width();
			var offset = firstWidth - $(s.nextSelector).width();
			$('.left').hide();
			$('.right').width('100%');
			$(s.nextSelector).css('float','right');
			$(s.nextSelector).css({'margin-right': offset/2});
			$(s.prevSelector).hide();
			$(s.nextSelector).click(function(e) {
				// console.log(that.currentIndex);
				if(that.currentIndex == that.$slides.length-2){
					$(s.nextSelector).text('first page');
					$(s.nextSelector).css({'margin-right':12,
										   'margin-left': 0,
										   'float': 'right',
										   });
					$(s.prevSelector).css({'margin-left':12,
										   'margin-right': 0 ,
										   'float': 'left'
											});
					$('.left').css('display','inline-block');
					$(s.prevSelector).show();
					$('.left').width("35%");
					$('.right').width("35%");
					$('.center').css('display','inline-block');
				}
				else if(that.currentIndex == that.$slides.length-1){
					$('.left').hide();
					$(s.prevSelector).hide();
					// $('.left').width("35%");
					$('.center').css('display','none');

					$(s.nextSelector).text('next page');
					var offset = firstWidth - $(s.nextSelector).width();
					$('.right').width('100%');
					$(s.nextSelector).css('float','right');
					$(s.nextSelector).css({'margin-right': offset/2});
					$(s.prevSelector).hide();
				}else{
					$('.left').hide();
					$(s.prevSelector).hide();
					$('.left').width("50%");
					$('.center').css('display','none');
					
					$(s.nextSelector).text('next page');
					$('.left').css('display','inline-block');
					$('.right').width('50%');
					$(s.prevSelector).show();
					$(s.prevSelector).css({'float':'right',
										   'margin-right': 56,
										   'margin-left': 0 
										  });
					
					$(s.nextSelector).css({'float':'left',
										   'margin-left': 56,
										   'margin-right': 0
									      });
				}
				that.nextSlide();
				e.preventDefault();
			});
		}
		if(s.prevSelector) {
			var firstWidth = that.$slides.eq(0).children().first().width();
			if(that.currentIndex == 0){
				$(s.prevSelector).hide();
			}else{
				$(s.prevSelector).show();
			}
			$(s.prevSelector).click(function(e) {
				$(s.nextSelector).text('next page');
				$('.center').css('display','none');

				if(that.currentIndex == 1){
					$('.left').hide();
					$('.right').width('100%');
					$(s.nextSelector).css('float','right');
					$(s.nextSelector).css({'margin-right': offset/2});
					$(s.prevSelector).hide();
				}else{
					$('.left').css('display','inline-block');
					$('.left').width('50%');
					$(s.prevSelector).show();
					$('.right').width('50%');
					$(s.prevSelector).css({'float':'right',
										   'margin-right': 56,
										   'margin-left': 0 
										  });
					
					$(s.nextSelector).css({'float':'left',
										   'margin-left': 56,
										   'margin-right': 0
									      });
				}
				that.prevSlide();
				e.preventDefault();
			});
		}

		// swipe events
		if(s.allowSwipe) {
			that.$container[0].addEventListener('touchstart', function(e) {
				that.touchStartEvent(e);
			}, false);
			that.$container[0].addEventListener('touchend', function(e) {
				that.touchEndEvent(e);
			});
		}

		// callback init
		that.applyCallback(s.init);

		// add instance to list
		KissSlider.instances.push(this);

		// return
		return this.$container;
	};

	KissSlider.prototype.refreshSlides = function() {
		var s = this.options;

		this.$slides = s.slideSelector ? $(s.slideSelector) : this.$container.children();

		// css
		this.$slides.css({
			position: 'absolute',
			left: 0,
			top: 0,
			zIndex: s.startingZ
		});
		this.$container.css({
			position: 'relative',
			overflow: 'hidden'
		});

		this.resizeSlider();

		this.$slides.css({
			width: '100%'
		});
		
		this.$slides.hide().eq(this.currentIndex).show();
	};

	KissSlider.prototype.cleanSlides = function() {
		var s = this.options;
		var $current = this.$slides.eq(this.currentIndex);
		this.$slides.not($current).remove();
		this.currentIndex = $current.index();
	};

	KissSlider.prototype.resizeSlider = function() {
		var that = this;
		that.slideWidth = that.$container.innerWidth();
		that.slideHeight = 0;
		that.$slides.each(function() {
			that.slideHeight = Math.max(that.slideHeight, $(this).outerHeight(true));
		});
		that.$container.css('height', that.slideHeight);
	};

	KissSlider.prototype.startAutoScroll = function(delay) {
		var that = this;
		if(!this.autoscrollInterval) {
			this.autoscrollInterval = setInterval(function() {
				that.nextSlide();
			}, delay);
		}
	};

	KissSlider.prototype.stopAutoScroll = function() {
		clearInterval(this.autoscrollInterval);
		this.autoscrollInterval = null;
	};

	// functions
	// @param int index index of the slide to reach
	// @param int dir 1 or -1 (respectively slide to the right and to the left)
	// @param bool noAnim whether or not to skip the animation
	// --------------------------------------
	KissSlider.prototype.moveTo = function(index, dir, noAnim) {
		index = Math.max(0, Math.min(index, this.$slides.length));
		this.applyCallback(this.options.beforeSlide, [this.currentIndex, index]);
		
		if(this.animated || index == this.currentIndex) {
			this.applyCallback(this.options.afterSlide, [index, index]);
			return false;
		}
		this.animated = true;

		dir = dir || 1;

		var $target = this.$slides.eq(index);
		var $current = this.$slides.eq(this.currentIndex);
		var that = this;

		$current.css('zIndex', this.options.startingZ + 1);
		$target.css('zIndex', this.options.startingZ + 2).show();
		this.$slides.not($target).not($current).hide();

		if(this.options.paginationSelector) {
			$('button', this.options.paginationSelector)
			.removeClass('active')
			.filter(function(){
				return $(this).data('kissSliderTarget') == index;
			})
			.addClass('active');
		}

		if(noAnim || this.options.noAnim) {
			$target.css('left', 0);
			// applyCallback(this.options.afterSlide, [_currentIndex, index]); // should be called???
			this.currentIndex = index;
			this.animated = false;
		} else {
			var targetLeftFrom = this.slideWidth * dir;
			var distance = -this.slideWidth * dir;
			$target.css('left', targetLeftFrom).add($current).animate({left:'+=' + distance}, this.options.slideDuration, this.options.easing, function() {
				that.finishSlide(index);
			});
		}
		// console.log(this.currentIndex);
		// console.log("dir is: "+dir);
		that.setSize(1,dir);
		return false;
	};

	KissSlider.prototype.finishSlide = function(newIndex) {
		if(!this.animated) {
			return;
		}
		this.applyCallback(this.options.afterSlide, [this.currentIndex, newIndex]);
		this.currentIndex = newIndex;
		this.animated = false;
	};

	KissSlider.prototype.paginationClick = function(target) {
		var index = $(target).data('kissSliderTarget');
		if(isNaN(index)) {
			return false;
		}
		var dir = index > this.currentIndex ? 1 : -1;
		return this.moveTo(index, dir);
	};

	KissSlider.prototype.setSize = function(state, dir) {
		// console.log("passin dir is: "+dir);
		var that = this;
		var tempIndex = 0 ;

		if(state == 0){
			var $current = this.$slides.eq(0);
			// console.log($current.children().first().width());
			that.$container.css({'height': $current.height()
								// 'width': $current.children().first().width()
							}
								);
			$('.buttons').width($current.children().first().width());
		}else{
			if(dir == 1){
				// console.log(this.$slides.length);
				if(this.currentIndex<this.$slides.length-1){
					tempIndex = this.currentIndex+1;
				}else{
					tempIndex = 0;
				}
				// console.log(tempIndex);
				var $current = this.$slides.eq(tempIndex);
				// console.log($current.height());
				// console.log($current.width());
				// console.log($current.children().first().width());
				that.$container.css({'height': $current.height()
									// 'width': $current.children().first().width()
								});
				$('.buttons').width($current.children().first().width());
			}else{
				if(this.currentIndex>0){
					tempIndex = this.currentIndex-1;
				}else{
					tempIndex = this.$slides.length-1;
				}
				// console.log(tempIndex);
				var $current = this.$slides.eq(tempIndex);
				// console.log($current.children().first().width());
				that.$container.css({'height': $current.height()
									// 'width': $current.children().first().width()
								});
				$('.buttons').width($current.children().first().width());
			}
		}	
	};

	KissSlider.prototype.nextSlide = function() {
		var that = this;
		var target = this.currentIndex + 1 < this.$slides.length ? this.currentIndex + 1 : 0;
		// that.setSize();
		// console.log("next");
		return this.moveTo(target, 1);
	};

	KissSlider.prototype.prevSlide = function() {
		var that = this;
		// if(this.currentIndex == 0){
		// 	$(s.prevSelector).hide();
		// }
		var target = this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : this.$slides.length - 1;
		// console.log("prev");
		return this.moveTo(target, -1);
	};

	KissSlider.prototype.applyCallback = function(fn, args) {
		return typeof(fn) === 'function' ? fn.apply(this, args) : null;
	};

	KissSlider.prototype.touchStartEvent = function(e) {
		// e.preventDefault();
		// startX = e.pageX ? e.pageX : e.changedTouches[0].pageX;
		// startY = e.pageY ? e.pageY : e.changedTouches[0].pageY;
		this.startX = e.changedTouches[0].pageX;
		this.startY = e.changedTouches[0].pageY;
		this.startTime = new Date().getTime();
	};

	KissSlider.prototype.touchEndEvent = function(e) {
		// e.preventDefault();
		var maxDuration = 1000;
		var minDist = 100; // px
		var maxDeviation = 50; // % of distance in an axe ; max distance in the other axis (ex if horiz swipe, max vertical distance)
		var duration = new Date().getTime() - this.startTime;
		var dir = null;
		if(duration <= maxDuration) {
			// var distX = (e.pageX ? e.pageX : e.changedTouches[0].pageX) - startX;
			// var distY = (e.pageY ? e.pageY : e.changedTouches[0].pageY) - startY;
			var distX = e.changedTouches[0].pageX - this.startX;
			var distY = e.changedTouches[0].pageY - this.startY;
			var distXAbs = Math.abs(distX);
			var distYAbs = Math.abs(distY);
			if(distXAbs > minDist && distYAbs <= distXAbs*maxDeviation/100) {
				if(distX < 0) {
					this.nextSlide();
				} else {
					this.prevSlide();
				}
			} /*else if(distYAbs > minDist && distXAbs <= distYAbs*maxDeviation/100) {
				dir = distY > 0 ? 'down' : 'up';
			}*/
		}
	};

	KissSlider.callAction = function(target, actionName, actionParams) {
		var instance;
		// find the instance attached to target
		for(var i in KissSlider.instances) {
			if(KissSlider.instances[i].$container[0] === target[0]) {
				instance = KissSlider.instances[i];
				break;
			}
		}
		if(instance) {
			KissSlider.actions[actionName].call(null, instance, actionParams);
		}
	};


	KissSlider.actions = {
		next: function(instance, actionParams) { instance.nextSlide(); },
		previous: function(instance, actionParams) { instance.prevSlide(); },
		moveTo: function(instance, actionParams) { instance.moveTo(actionParams.index, actionParams.dir); },
		refresh: function(instance, actionParams) { instance.refreshSlides(); },
		startAutoScroll: function(instance, actionParams) { 
			var delay = (actionParams && actionParams.delay) ? actionParams.delay : instance.options.autoscrollDelay; 
			instance.startAutoScroll(delay); 
		},
		stopAutoScroll: function(instance, actionParams) { instance.stopAutoScroll(); },
		clean: function(instance, actionParams) { instance.cleanSlides(); },
		setSize: function(instance, actionParams) { instance.setSize(actionParams.state, actionParams.dir); }
	};

	// jquery extension (can take options object or action string as parameter)
	$.fn.extend({
		kissSlider: function(optionsOrAction, actionParams) {
			if(typeof(optionsOrAction) === "string" && typeof(KissSlider.actions[optionsOrAction] === "function")) {
				KissSlider.callAction(this, optionsOrAction, actionParams);
				return this;
			}
			// else => init
			this.each(function(){
				new KissSlider($(this), optionsOrAction);
			});
			return this;
		}
	});

}(jQuery));