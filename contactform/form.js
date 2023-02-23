// // https://api.jquery.com/jQuery.ajax
// $.ajax({
// 	method: 'POST',
// 	url: 'https://formsubmit.co/ajax/74ffc38f73956b55619c7450b256f8f3',
// 	dataType: 'json',
// 	accepts: 'application/json',
// 	data: {
// 		name: 'FormSubmit',
// 		message: "I'm from Devro LABS",
// 	},
// 	success: (data) => console.log(data),
// 	error: (err) => console.log(err),
// });

$(document).ready(function () {
	'use strict';

	$('form.contactForm').submit(function (e) {
		e.preventDefault();
		var f = $(this).find('.form-group'),
			ferror = false,
			emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

		f.children('input').each(function () {
			// run all inputs
			var i = $(this); // current input
			var rule = i.attr('data-rule');
			if (rule !== undefined) {
				var ierror = false; // error flag for current input
				var pos = rule.indexOf(':', 0);
				if (pos >= 0) {
					var exp = rule.substr(pos + 1, rule.length);
					rule = rule.substr(0, pos);
				} else {
					rule = rule.substr(pos + 1, rule.length);
				}

				switch (rule) {
					case 'required':
						if (i.val() === '') {
							ferror = ierror = true;
						}
						break;
					case 'minlen':
						if (i.val().length < parseInt(exp)) {
							ferror = ierror = true;
						}
						break;
					case 'email':
						if (!emailExp.test(i.val())) {
							ferror = ierror = true;
						}
						break;
					case 'checked':
						if (!i.is(':checked')) {
							ferror = ierror = true;
						}
						break;
					case 'regexp':
						exp = new RegExp(exp);
						if (!exp.test(i.val())) {
							ferror = ierror = true;
						}
						break;
				}
				i.next('.validation')
					.html(
						ierror
							? i.attr('data-msg') !== undefined
								? i.attr('data-msg')
								: 'wrong input'
							: ''
					)
					.show('blind');
			}
		});
		f.children('textarea').each(function () {
			// run all inputs

			var i = $(this); // current input
			var rule = i.attr('data-rule');

			if (rule !== undefined) {
				var ierror = false; // error flag for current input
				var pos = rule.indexOf(':', 0);
				if (pos >= 0) {
					var exp = rule.substr(pos + 1, rule.length);
					rule = rule.substr(0, pos);
				} else {
					rule = rule.substr(pos + 1, rule.length);
				}

				switch (rule) {
					case 'required':
						if (i.val() === '') {
							ferror = ierror = true;
						}
						break;

					case 'minlen':
						if (i.val().length < parseInt(exp)) {
							ferror = ierror = true;
						}
						break;
				}
				i.next('.validation')
					.html(
						ierror
							? i.attr('data-msg') != undefined
								? i.attr('data-msg')
								: 'wrong Input'
							: ''
					)
					.show('blind');
			}
		});
		if (ferror) return false;
		else var str = $(this).serialize();
		var action = $(this).attr('action');
		if (!action) {
			action =
				'https://formsubmit.co/ajax/74ffc38f73956b55619c7450b256f8f3';
		}

		var formData = {
			name: $('#name').val(),
			email: $('#email').val(),
			subject: $('#subject').val(),
			message: $("textarea.form-control[name='message']").val(),
		};

		$.ajax({
			type: 'POST',
			url: action,
			data: formData,
			dataType: 'json',
			encode: true,
			// success: function (msg) {
			// 	console.log(msg);
			// 	if (msg == 'OK') {
			// 		$('#sendmessage').addClass('show');
			// 		$('#errormessage').removeClass('show');
			// 		$('.contactForm').find('input, textarea').val('');
			// 	} else {
			// 		$('#sendmessage').removeClass('show');
			// 		$('#errormessage').addClass('show');
			// 		$('#errormessage').html(msg);
			// 	}
			// },
		})
			.done(function (data) {
				console.log(data);
				$('#sendmessage').addClass('show');
				$('form').each((i, f) => f.reset()); //.reset();
				// GTM event
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({
					event: 'form_submit',
					form_subject: formData.subject,
					form_message: formData.message,
					user_data: {
						email: formData.email,
						name: formData.name,
					},
				});
			})
			.fail(function (jqXHR, _, errorThrown) {
				console.error(jqXHR);
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({
					event: 'form_submit_error',
					error_thrown: errorThrown,
					error_status: jqXHR.status,
				});
				$('#errormessage').addClass('show');
			});
	});
});
// });
