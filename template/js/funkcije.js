
$(document).ready(function(){
	var grid;

	
	
	$('[data-toggle="tooltip"]').tooltip();
	$("body").niceScroll();
	$(".gridster-item").niceScroll();
/*	$(".navbar").css("opacity", "0");

	var timer;
	var delay = 100;


	$(".navbar").hover(function (e) {
	    timer = setTimeout(function () {
	        if (e.pageY <= 50 && $(".navbar").css('opacity') == '0') {
	            $(".navbar").animate({
	                opacity: 1
	            }, 1000, function () {
	            });
	        }
	    }, delay);
	}, function () {
	    clearTimeout(timer);

	    $(".navbar").animate({
	        opacity: 0


	    }, 500, function () {

	    });

	});


	/* if(e.pageY <= 50 && $(".navbar").css('opacity') == '0' ) 
	    {
	        $(".navbar").animate({
	    opacity: 1
	  
	   
	  }, 1000, function() {
	    
	  });
			//$(".grid-stack").css("margin-top","50px");
			
	    }else{
			 $(".navbar").animate({
	    opacity: 0
	  
	   
	  }, 500, function() {
	    
	  });
			// $(".grid-stack").css("margin-top","0px");
		}
		*/
/*
	$("#vremeD").click(function () {
	    if ($("#vreme").css('display') == 'none') {
	        $("#vreme").show();
	    } else {
	        $("#vreme").hide();
	    }
	});
	
	//$( document ).on( "mousemove", function( event ) {
	//	$(".grid-stack-item-content").append(event.pageY);
	//});
	
	var moovable = true;
	$(function () {
		
	    var options = {
			disableResize: "true",
			float : true

		};
		
	    $('.grid-stack').gridstack(options);
		grid = $('.grid-stack').data('gridstack');
		grid.makeWidget(".grid-stack");
		grid.movable(".grid-stack", true);
		
	});
/*	
	$("#asd").click(function () {
	    $(".grid-stack-item-content input").show();
	    if (moovable == true) {
	        grid.movable('.grid-stack-item', false);
	        moovable = false;
	    } else {
	        grid.movable('.grid-stack-item', true);
	        moovable = true;
	    }


	    //	var asd = document.querySelectorAll(".grid-stack .grid-stack-item")[2].dataset.gsX;
	    // var vremeX=$("#vreme").data("gs-x");
	    // var vremeY=$("#vreme").data("gs-y");
	/*
		var items = [];

	    $('.grid-stack-item.ui-draggable').each(function () {
	        var $this = $(this);
	        items.push({
	            x: $this.attr('data-gs-x'),
	            y: $this.attr('data-gs-y'),

	            //  content: $('.grid-stack-item-content', $this).html()
	        });
	    });

	   alert(JSON.stringify(items));
	

	    //alert(asd);
	//     $.post( "template/test.php", { 'asd': "asd1234124"  } ).success(function(data) {
	//		alert(data);
			
	//		});
	
	    $.get("template/test2.php").success(function (data) {
	        data = JSON.parse(data);
	        console.log(data);
	        var asd = document.querySelectorAll(".grid-stack .grid-stack-item")[0];

	        //grid.move(document.querySelectorAll(".grid-stack .grid-stack-item")[0],4,0);
	        //grid.move(document.querySelectorAll(".grid-stack .grid-stack-item")[1],0,0);
	 });	*/	   
//	});
//	$(".grid-stack").on("click",".grid-stack-item input",function () {
//	    $(this).closest(".grid-stack-item").hide();

//	});


  
	
});
