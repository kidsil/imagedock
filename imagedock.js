/*!
 * imageDock Plugin for jQuery
 *
 * @author Asaf Zamir
 * @link http://jquery.kidsil.net
 * @version 0.01
 * @date 31/03/2011
 *
 * Description:
 * cute little dock for image galleries, try it yourself
  * 
 * Usage:
 * create a div to hold all the images, then call the initDock function like so:
 * 	$(window).load(function() {
 *		initDock($('#dock'),$('#dock img.active'),250,25);
 *	});
 *  on window.load otherwise Chrome can't calculate the image sizes,
 * 	paramter 1 - the div that holds the images
 *  parameter 2 - the default active image
 *  parameter 3 - basically the radius of the "affected" images,
 * 				  that is, the maximum distance needed for an image to start moving.
 *  parameter 4 - the maximum distance the images would move (upward)
 *
 * an example is available at http://jquery.kidsil.net
 */

function setChosen(element) {
	chosen = element.siblings().find('.active');
	theSrc = chosen.attr('src');
	element.attr('src',theSrc);		
}

function getMarginValue(element,ex,ey,heightDiff,affectedDist) {

	imgMidX = element.offset().left + (element.width() / 2);
	imgMidY = element.offset().top + (element.height() / 2);
	distanceX = Math.abs(ex - imgMidX);
	distanceY = Math.abs(ey - imgMidY);
	maxDist = Math.max(distanceX,distanceY);
	if (maxDist < affectedDist) {
		maxDist = maxDist / (affectedDist / 45);
		reducedMaxDist = heightDiff - maxDist;
		if (reducedMaxDist > 1) {
			return reducedMaxDist;
		}

	}
	return 0


}

function chosenImageSet(element,heightDiff,affectedDist) {
	activImgX = element.find('.active').offset().left + (element.find('.active').width() / 2);
	activImgY = element.find('.active').offset().top + (element.find('.active').height() / 2);
	element.find('img').each(function() {
		margVal = getMarginValue($(this),activImgX,activImgY,heightDiff,affectedDist);
		$(this).css('margin-top',-margVal);
		$(this).css('margin-bottom',margVal);
		/* some past problems occured when I didn't add margin-bottom as well */
		

	});
}
/*
 * element - the dock holder (contains images)
 * activeElem - the activeElement, the one shown
 * affectedDist - the distance that the images will be affected by mouse scroll (see getMarginValue for calculation)
 * heightDiff - the max height change of the hovered image
 *
*/
function initDock(element,activeElem,affectedDist,heightDiff) {
	element.css('padding-top',parseFloat(element.css('padding-top'))+heightDiff);
	element.mousemove(function(e) {
		element.find('img').each(function() {
			margVal = getMarginValue($(this),e.pageX,e.pageY,heightDiff,affectedDist);
			$(this).css('margin-top',-margVal);
			/* Margin bottom for overflowing images (suddenly appear at the bottom half of the float image, go figure */
			$(this).css('margin-bottom',margVal);
		});	
	});
	//On mouse out, make the selected image pop [as well as the images near it, essentially fake mouse enter]
	element.mouseleave(function() {
		chosenImageSet(element,heightDiff,affectedDist);
	});
	
	chosenImageSet(element,heightDiff,affectedDist);

	element.find('img').click(function() {
		$('.dockImg').removeClass('active');
		$(this).addClass('active');
		setChosen($('#chosenImg'));
	});
	setChosen($('#chosenImg'));
	chosenImageSet(element,heightDiff,affectedDist);


}
