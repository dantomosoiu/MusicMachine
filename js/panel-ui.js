var PanelInstSync = {};

function PanelsClass() {
	this.panelsList = new Array();
	this.extendedPanelWidth = 10;
	this.compactedPanelWidth = 10;
	var animationDuration = 200;
	this.currentExtendedPanelId = 0;

	$(function() {
		$('#panels_container').sortable({handle: 'h2', axis: 'x', cursor: 'w-resize', tolerance: 'pointer'});
		$('#panels_container').height($(window).height() - 250);
	});

	$(window).resize(function () {
	    $.fx.off = true;
	    $('#panels_container').height($(window).height() - 250);
	    Panels.recalculateSizes();
	    Panels.fixPanelSizes();
	    Panels.fixVerticalScroll();
	    $.fx.off = false;
	});

	/*
	 * Adauga un nou panou
	 * newPanel este de tip Panel
	 * Pentru adaugarea panourilor la pornirea aplicatiei, se dezactiveaza efectele jQuery ($.fx.off)
     * Intoarce: true - panoul a fost adaugat, false - panoul exista deja si nu a fost adaugat
	 */
	this.add = function (newPanel) {
	    var i;
	    if (this.panelsList) {
	        for (i = 0; i < this.panelsList.length; i++) {
	            if (this.panelsList[i].id == newPanel.id) {
	                return false;
	            }
	        }
	    }
	    this.panelsList[this.panelsList.length] = newPanel;
	    var totalPanels = $('#panels_container').children().length;
	    var closeButtonHtml = '';
	    if (newPanel.isCloseable == true) {
	        closeButtonHtml = '<div class="panel_close_button" onclick="Panels.close(\'' + newPanel.id + '\')"><img src="images/panel-ui/close-button.png" alt="Close" title="Close this panel"></div>';
	    }
	    var panelHtmlCode = '<div class="panel panel_extended" id="panel-' + newPanel.id + '" style="width: 0px">' + closeButtonHtml + '<h2>' + newPanel.title + '</h2><div id="panel-extended-' + newPanel.id + '" class="content">' + newPanel.extendedHtml + '</div><div id="panel-compacted-' + newPanel.id + '" class="content" style="display: none">' + newPanel.compactedHtml + '</div>';
	    if (totalPanels == 0) {
	        $('#panels_container').html(panelHtmlCode);
	        this.currentExtendedPanelId = newPanel.id;
	    }
	    else {
	        if (totalPanels % 2 == 1) {
	            // numar impar de panouri: noul panou este adaugat la dreapta panoului [(n+1)/2]
	            $('#panels_container DIV.panel:nth-child(' + (totalPanels + 1) / 2 + ')').after(panelHtmlCode);
	        }
	        else {
	            // numar par de panouri: noul panou este adaugat la mijloc
	            $('#panels_container DIV.panel:nth-child(' + totalPanels / 2 + ')').after(panelHtmlCode);
	        }
	    }

	    this.fixCompactedLinks(newPanel.id);

	    this.recalculateSizes();
	    this.fixPanelSizes();
	    this.fixVerticalScroll();
	    this.extend(newPanel.id, false, false);  // ultimul parametru era true

	    PanelInstSync[newPanel.id] = setInterval(function () {
	        eval("if(" + newPanel.id + ") { clearInterval(PanelInstSync['" + newPanel.id + "']); if(" + newPanel.id + ".__panelAdded) { " + newPanel.id + ".__panelAdded() } }");
	    }, 50);

	    return true;
	}

	/*
	 * Extinde un panou.
	 * panelId este id-ul panoului, stabilit la crearea lui
     * checkPanelState (default: true) - daca un panou este deja extins, nu se mai executa functia
     * restorePanelUrl (default: false) - daca pune in URL dupa # ultima adresa in care a fost folosit panoul
	 */
	this.extend = function (panelId, checkPanelState, restorePanelUrl) {
	    // verific daca panoul e deja extins si setez URL Hash-ul
	    if (checkPanelState == undefined) {
	        checkPanelState = true;
	    }
	    if (restorePanelUrl == undefined) {
	        restorePanelUrl = false;
	    }
	    if (this.panelsList) {
	        for (i = 0; i < this.panelsList.length; i++) {
	            if (this.panelsList[i].id == panelId) {
	                if (checkPanelState == true && this.panelsList[i].isExtended == true) {
	                    return;
	                }
	                if (restorePanelUrl == true && UrlObject) {
	                    UrlObject.redirect(this.panelsList[i].currentUrl, false);
	                }
	                break;
	            }
	        }
	    }
	    // transform ultimul panou extins in panou compactat
	    var currentExtPanel = this.currentExtendedPanelId;
	    $('#panel-' + this.currentExtendedPanelId).switchClass('panel_extended', 'panel_compacted', animationDuration / 2);
	    $('#panel-' + this.currentExtendedPanelId).animate({ width: this.compactedPanelWidth + 'px' }, animationDuration);
	    $('#panel-extended-' + this.currentExtendedPanelId).fadeOut(animationDuration, function () {
	        $('#panel-compacted-' + currentExtPanel).fadeIn(animationDuration);
	    });
	    $('#panel-' + this.currentExtendedPanelId).click(function () {
	        Panels.extend(currentExtPanel, true, true);
	    });

	    // setez starile corespunzatoare (isExtended) in panelsList
	    for (i = 0; i < this.panelsList.length; i++) {
	        if (this.panelsList[i].id == this.currentExtendedPanelId) {
	            this.panelsList[i].isExtended = false;
	        }
	        else if (this.panelsList[i].id == panelId) {
	            this.panelsList[i].isExtended = true;
	        }
	    }

	    // transform panelId in panou extins
	    this.currentExtendedPanelId = panelId;
	    $('#panel-compacted-' + this.currentExtendedPanelId).fadeOut(animationDuration, function () {
	        $('#panel-extended-' + Panels.currentExtendedPanelId).fadeIn(animationDuration);
	    });
	    $('#panel-' + this.currentExtendedPanelId).switchClass('panel_compacted', 'panel_extended', animationDuration / 2);
	    $('#panel-' + this.currentExtendedPanelId).animate({ width: this.extendedPanelWidth + 'px' }, animationDuration, function () { Panels.fixVerticalScroll(); });
	    $('#panel-' + this.currentExtendedPanelId).unbind('click');
	    $('#panels_container').sortable('refresh');

	    // execut __load pentru panoul extins
	    if (this.panelsList) {
	        for (i = 0; i < this.panelsList.length; i++) {
	            if (this.panelsList[i].id == panelId) {
	                if (UrlObject) {
	                    if (panelId != UrlObject.getSegment(1)) {
	                        eval(panelId + ".__load()");
	                    }
	                }
	                break;
	            }
	        }
	    }
	}

	/*
	 * Recalculeaza dimensiunile panourilor. Ar trebui apelata odata cu functia fixPanelSizes().
	 */
	this.recalculateSizes = function() {
		var compactedPanels = $('#panels_container').children().length - 1;
		var totalWidth = $('#panels_container').width() - 2 - compactedPanels; // scad conturul panourilor
		this.extendedPanelWidth = Math.floor((-3 * compactedPanels + 60) / 100 * totalWidth);
		if(compactedPanels == 0) {
		    this.compactedPanelWidth = 0;
		}
		else {
		    this.compactedPanelWidth = Math.floor((totalWidth - this.extendedPanelWidth) / compactedPanels);
		}
	}

	/*
	 * Seteaza dimensiunile panourilor.
	 */
	this.fixPanelSizes = function() {
		$('DIV.panel').height($('#panels_container').height());
		$('#panels_container DIV.panel_compacted').animate({ width: this.compactedPanelWidth + 'px' }, animationDuration);
		$('#panels_container DIV.panel_extended').animate({ width: this.extendedPanelWidth + 'px' }, animationDuration);
    }

    /*
     * Redimensioneaza toate elementele de tip DIV class="scroll_vertical" astfel incat sa afiseze scrollbar
     */
    this.fixVerticalScroll = function () {
        $('DIV.panel DIV.scroll_vertical').height(function (index, height) {
            $(this).height($('#panels_container').height() - ($(this).offset().top - $('#panels_container').offset().top) - 10);
        });
    }

    /*
    * Inchide un panou.
    */
	this.close = function(panelId) {
		var i, isExtended, extendId;
		for (i = 0; i < this.panelsList.length; i++) {
		    if (this.panelsList[i].id == panelId) {
		        isExtended = this.panelsList[i].isExtended;
		        this.panelsList.splice(i, 1);
				break;
			}
		}
		$('#panel-' + panelId).remove();
		if(isExtended == true) {
			if(i == 0) {
			    extendId = this.panelsList[1].id;
			}
			else {
			    extendId = this.panelsList[i - 1].id;
			}
		}
		
		Panels.recalculateSizes();
		Panels.fixPanelSizes();
		if(isExtended == true) {
		    Panels.extend(extendId, false, true);
		}
    }

    /*
    *  Inchide panoul curent
    */
    this.closeCurrent = function () {
        Panels.close(Panels.currentExtendedPanelId);
    }

/*
* Reafiseaza informatia (extendedHtml si compactedHtml) intr-un panou.
*/
	this.refreshExtendedPanel = function (panelId) {
	    if (this.panelsList) {
	        var i;
	        for (i = 0; i < this.panelsList.length; i++) {
	            if (this.panelsList[i].id == panelId) {
	                $('#panel-extended-' + panelId).html(this.panelsList[i].extendedHtml);
	                break;
	            }
	        }
	        this.fixVerticalScroll();
	    }
	}
	this.refreshCompactedPanel = function (panelId) {
	    if (this.panelsList) {
	        var i;
	        for (i = 0; i < this.panelsList.length; i++) {
	            if (this.panelsList[i].id == panelId) {
	                $('#panel-compacted-' + panelId).html(this.panelsList[i].compactedHtml);
	                break;
	            }
	        }
	        this.fixVerticalScroll();
	        this.fixCompactedLinks(panelId);
	    }
	}

	this.fixCompactedLinks = function (panelId) {
	    $('#panel-compacted-' + panelId + ' A').unbind('click').click(function (e) {
	        e.stopPropagation();
	    });
	}

    // Intoare un obiect de tipul Panel ce reprezinta panoul extins
	this.getCurrent = function () {
	    var i;
	    for (i = 0; i < this.panelsList.length; i++) {
	        if (this.panelsList[i].id == this.currentExtendedPanelId) {
	            return this.panelsList[i];
	        }
	    }
	}
}

function Panel(panelTitle, panelId, showCloseButton) {
	this.title = panelTitle;
	this.id = panelId
	this.compactedHtml = '';
	this.extendedHtml = '';
	this.currentUrl = '#/' + panelId;
	if(showCloseButton == undefined) {
		showCloseButton = true;
	}
	this.isCloseable = showCloseButton;
	this.isExtended = true;

	this.setCompactedHtml = function (html) {
	    this.compactedHtml = html;
	    Panels.refreshCompactedPanel(this.id);
	    $('.button_toolbar').buttonset();
	    $('.button').button();
	}
	this.setExtendedHtml = function(html) {
	    this.extendedHtml = html
	    Panels.refreshExtendedPanel(this.id);
	    $('.button_toolbar').buttonset();
	    $('.button').button();
	}

}

var Panels = new PanelsClass();