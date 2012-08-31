$("form").on("submit", function(event) {
	event.preventDefault();
	
	var contentType = this.getAttribute("enctype");
	if (contentType) {
		alert("This data needs to be submitted as " + contentType + ", which isn't possible with HTML forms.");
		return false;
	}

	var form = $(this);	
	var formToSubmit = form.clone();

	// replace the placeholders in the form action URI template, and remove those inputs from the form
	formToSubmit.attr("action", formToSubmit.attr("action").replace(/\{(\w+)\}/, function getFormValue(match, field) {
		var node = formToSubmit.find("[name=" + field + "]");
		if (!node.length) return "";

		var value = node.val();
		node.remove();

		//return encodeURIComponent(value);
		return value;
	}));

	form.find("select,textarea").each(function() {
		var node = $(this);
		formToSubmit.find("*[name=" + node.attr("name") + "]").val(node.val());
	});

	formToSubmit.find("input,select,textarea").each(function(index, node) {
		var node = $(node);

		if (!node.val()) {
			node.remove();
		}
	});

	formToSubmit.submit();
});

$("input[data-example]").each(function() {
	var input = $(this);

	var link = $("<a/>", { "class": "example", href: "#", text: input.data("example") }).insertAfter(input);
});

$(".example").on("click", function(event) {
	event.preventDefault();

	var example = $(this);

	example.prev("input,select").val(example.text());

	example.closest("form").submit();
});

$("input[name=has_category]").each(function() {
	var input = $(this);

	$.getJSON("categories.json", function(data) {
		var select = $("<select/>", { name: input.attr("name") });

		if (!input.attr("required")) {
			$("<option/>", { value: "", text: "All Categories" }).appendTo(select);
		}

		data.items.forEach(function(item) {
			$("<option/>", { value: item.id, text: item.name }).appendTo(select);
		});

		input.replaceWith(select);
	});
});

