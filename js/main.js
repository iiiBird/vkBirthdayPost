var DRGroups = [];

function getBirthdayMember(group_id, members_count, dr_day, dr_mounth, cityName, age_from, age_to) {

	var cityID;

	if ( age_from == "" || age_to == "" ) {
		age_from = 0;
		age_to = 100;
	}

	if ( cityName == "" ) {
		VK.Api.call("users.search", {
			"group_id": group_id,
			"birth_day": dr_day,
			"birth_month": dr_mounth,
			"sort": 0,
			"v": 5.126,
			"count": 1000
		}, function(data) {
			if (data.response) {
				DRGroups = data.response.items;

				for (var key in DRGroups) {
					$('.well').append('@id' + DRGroups[key].id + ' (' + DRGroups[key].first_name +' '+ DRGroups[key].last_name + ')' + '</br>');
				}
			} else {
				alert(data.error.error_msg);
			}
		});
	} else {
		VK.Api.call("database.getCities", {
			"country_id": 1,
			"q": cityName,
			"count": 1,
			"v": 5.126
		}, function(data) {
			if (data.response) {
				DRGroups = data.response.items;

				for (var key in DRGroups) {
					cityID = DRGroups[key].id;
					break;
				}
			}


			VK.Api.call("users.search", {
				"group_id": group_id,
				"birth_day": dr_day,
				"birth_month": dr_mounth,
				"country": 1,
				"city": cityID,
				"hometown": cityName,
				"age_from": age_from,
				"age_to": age_to,
				"sort": 0,
				"v": 5.126,
				"count": 1000
			}, function(data) {
				if (data.response) {
					DRGroups = data.response.items;

					for (var key in DRGroups) {
						$('.well').append('@id' + DRGroups[key].id + ' (' + DRGroups[key].first_name +' '+ DRGroups[key].last_name + ')' + '</br>');
					}
				} else {
					alert(data.error.error_msg);
				}
			});
		});
	}
}

$('.btn-search').on('click', function() {
	var date = $('.date').val();
	var mem_count = $('.mem-count').val();
	var group_id = $('.group_id').val();
	var cityName = $('.city').val();
	var age_from = $('.age_from').val();
	var age_to = $('.age_to').val();

	localStorage.setItem('group_id', group_id);
	localStorage.setItem('cityName', cityName);
	localStorage.setItem('age_from', age_from);
	localStorage.setItem('age_to', age_to);

	$('.well').html('');

	date = date.split('.');

	if ( group_id.length === 0 ) {
		alert("Введите id группы");
		return false;
	}

	getBirthdayMember(group_id, mem_count, date[0], date[1], cityName, age_from, age_to);
});

$('.btn-post').on('click', function() {
	var post_text = $('.post-text textarea').val();
	localStorage.setItem('post_text', post_text);
});

$('.hidden-btn').on('click', function() {
	var groupAttr = $('.group_id').attr('data-value');
	var cityAttr = $('.city').attr('data-value');

	$('.group_id').val(groupAttr);
	$('.city').val(cityAttr);

});

function sendWallPost() {
	var group_id = $('.group_id').val();
	var peopleList = $('.well').html();
	var text = $('.post-text textarea').val();
	var photo = '';

	peopleList = peopleList.replace(/\<br>/g, '\n');

	var newMsg = text + '\n' + peopleList;

    VK.api("wall.post", {
        owner_id: '-'+group_id+'',
        message: newMsg,
		from_group: 1,
        attachments: 'photo-61961289_456239692'
    }, function (data) {});
}

$(function (){
	/*datetimepicker*/
	if ( $('.datetimepicker').length > 0) {
		$('.datetimepicker').datepicker({
			format: 'dd.mm.yyyy',
			language: "ru",
			autoclose: true
		});
	}

	$('.datetimepicker').datepicker('update', new Date());
	/*end datetimepicker*/

	/*localStorage*/

	var localGroup_id = localStorage.getItem('group_id');
	var localCityName = localStorage.getItem('cityName');
	var localAge_from = localStorage.getItem('age_from');
	var localAge_to = localStorage.getItem('age_to');
	var localPost_text = localStorage.getItem('post_text');


	$('.group_id').val(localGroup_id);
	$('.city').val(localCityName);
	$('.age_from').val(localAge_from);
	$('.age_to').val(localAge_to);
	$('.post-text textarea').val(localPost_text);

	/*end localStorage*/
});
