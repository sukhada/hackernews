function getTopPosts() {
	var topStories = null;
	var comments = {};
	$.get("https://hacker-news.firebaseio.com/v0/topstories.json", function(data) {
		topStories = data;
		console.log(topStories);
		for (var i = 0; i < topStories.length; i++) {
			var link = "https://hacker-news.firebaseio.com/v0/item/" + topStories[i] + ".json?print=pretty";
			$.get(link, function(story) {
				var subtitle = '<p class="subtitle">'+ story.score + ' points by <a href="https://news.ycombinator.com/user?id=' + story.by + '">' + story.by + '</a></p>';
				comments[story.id] = story.kids;
				$('.links').append('<p><a href="' + story.url +'">' + story.title + '</a></p>');
				$('.links').append(subtitle);
			})
		}		
		
	})
	.done(function() {
		console.log($('.comments'));
		$('.comments').on('click', function(id) {
			console.log($(this).attr('id'));
		});	
	});	
}

function getLink(link) {
	var retVal;
	$.ajax({
		url: link,
		dataType: 'json',
		async: 'true',
		type: 'GET',
		success: function(data) {
			retVal = data;
			return data;
		}
	});
	return retVal;
}

$(document).ready(function() {

})

getTopPosts();