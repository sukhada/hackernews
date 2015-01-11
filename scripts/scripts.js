function getTopPosts() {
	var topStories = null;
	var comments = {};
	$.get("https://hacker-news.firebaseio.com/v0/topstories.json", function(data) {
		topStories = data;
		for (var i = 0; i < topStories.length; i++) {
			var link = "https://hacker-news.firebaseio.com/v0/item/" + topStories[i] + ".json?print=pretty";
			$.get(link, function(story) {
				var p = '';
				var newDiv = '';
				var comment = 0;
				if (story.kids) {
					comment = story.kids.length;
				}
				p+= '<p class="subtitle">' + story.score + ' points by ';
				p+=('<a href="https://news.ycombinator.com/user?id=' + story.by + '">' + story.by + '</a> | ');
				p+=('<a data-toggle="collapse" href="#collapse' + story.id +  '" class="comments" id=' + story.id +'>' + comment + ' comments' + '</a>');
				comments[story.id] = story.kids;
				newDiv +=('<p><a href="' + story.url +'">' + story.title + '</a></p>');	
				newDiv += p;
				var commentDiv = '<div class="panel-collapse collapse" id="collapse' + story.id + '"></div>';
				newDiv+=commentDiv;
				$('.links').append('<div class="story">' + newDiv + '</div>');
			})
			.done(function(story) {
				$('#' + story.id).on('click', function(id) {
					if ($('#collapse' + story.id).children().length > 0) {
						return;
					}
					var id = $(this).attr('id');
					var commentList = comments[id];
					populateCommentTree(commentList, id, $('#collapse' + id));
				});	
			})
		}		
	});
}

function populateCommentTree(comments, id, last) {
	last.append('<ul></ul>');
	for(var i = 0; i < comments.length; i++) {
		var comment = apiRequest('https://hacker-news.firebaseio.com/v0/item/' + comments[i] + '.json?print=pretty');
		if (typeof(comment.text) !== 'undefined') {
			last.children('ul').append('<li>' + comment.text + '</li>');
		}
		if (typeof(comment.kids) !== 'undefined') {
			populateCommentTree(comment.kids, id, $('#collapse' + id + ' li:last'));
		}
	}
}

function apiRequest(url, data, method) {
    if (typeof method === "undefined") {
        method = "GET";
    }
    if (typeof data === "undefined") {
        data = {};
    }

    var results = null;

    $.ajax({
        url: url,
        type: method,
        data: data,
        dataType: 'json',
        async: false,
        success: function (data, status, jqXHR) {
            results = data;
        }
    });

    return results;
}


getTopPosts();