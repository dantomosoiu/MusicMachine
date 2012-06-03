function Gridview(columnArray, dataArray, id) {

	this.columnArray = columnArray;
	this.dataArray = dataArray;
	this.id = id;

	this.addRow = function (rowObject) {
		gridviewRow = $("<tr></tr>");
		for (var j in columnArray) {
			property = columnArray[j].columnId;
			if (rowObject[property] == null) {
				rowObject[property] = '';
			}
			if (typeof (rowObject[property]) != 'object') { //continutul celulei este de tip normal
				gridviewRow.append($("<td>" + rowObject[property] + "</td>"));
			} else { //continutul celulei este de tip button, link sau html
				switch (rowObject[property].type) {
					case 'button':
						gridviewButton = $("<a></a>");
						gridviewButton.attr('class', 'button');
						gridviewButton.html(rowObject[property].content);
						gridviewButton.attr('href', '#/' + rowObject[property].callback);
						gridviewRow.append($("<td></td>").append(gridviewButton));
						//						callback = "UrlObject.redirect('" + rowObject[property].callback + "');";
						//						gridviewButton = $("<input></input>", {
						//							'type': 'button',
						//							'value': rowObject[property].content,
						//							onclick: callback
						//						});
						//						gridviewRow.append($("<td></td>").append(gridviewButton));
						break;
					case 'link':
						gridviewLink = $("<a></a>");
						gridviewLink.html(rowObject[property].content);
						gridviewLink.attr('href', '#/' + rowObject[property].callback);
						gridviewRow.append($("<td></td>").append(gridviewLink));
						break;
					case 'html':
						gridviewRow.append($("<td></td>").html(rowObject[property].content));
				}
			}

		}
		this.gridview.find("tbody").append(gridviewRow);
	}

	this.gridview = $("<table></table>").attr('class', 'tablesorter');
	this.gridview.attr('id', id);

	this.gridview.append($("<thead></thead>"));
	this.gridview.append($("<tbody></tbody>"));


	headerRow = $("<tr></tr>");
	for(i in columnArray) {
		headerRow.append($("<th>" + columnArray[i].columnTitle + "</th>"));
	}
	this.gridview.find("thead").append(headerRow);

	for(var i in dataArray) {
		this.addRow(dataArray[i]);
	}

	this.getGridviewObject = function() {
		return this.gridview;
	}

	this.getGridviewHtml = function() {
		return $("<div></div>").append(this.gridview).html();
	}

	this.activate = function() {
		this.gridview = $("#" + this.id);
		this.gridview.tablesorter();
	}
}

