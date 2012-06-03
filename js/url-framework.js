/*
are nevoie de:
	jquery.ba-hashchange.js
	jquery-1.5.1.min.js
*/

function UrlFrameworkClass() {
	
	this.isActive = true;
	
	this.loadHash = function() {
		this.hash = location.hash;
		this.hashArray = this.hash.split("/");
	}

	this.totalSegments = function() {
		return this.hashArray.length - 1;
	}

	this.getSegment = function(i) {
		return this.hashArray[i];
	}

	this.redirect = function(url, executeHash) {
		if(executeHash == false) {
			this.isActive = false;
		}
		if(url) {
			location.hash = url;
		} else {
			location.hash = "";
		}
	}

	this.setHash = function(newHash) {
		location.hash = newHash;
	}


	this.evalUrl = function (oldHash) { //apeleaza functia din URL
		if (this.totalSegments() < 1) {
			return;
		}
		object = this.getSegment(1);

		var objectReference;
		eval("objectReference = " + object);
		var interval = setInterval(function () {
			if (objectReference.waitForLoad != true) {
				clearInterval(interval);
				if (UrlObject.totalSegments() == 1) {
					eval(object + ".index();");
				} else {
					method = UrlObject.getSegment(2);
					parameterList = UrlObject.getSegment(3) == undefined ? "" : "'" + UrlObject.getSegment(3) + "'";
					for (i = 4; i < UrlObject.hashArray.length; i++) {
						parameterList += ", '" + UrlObject.getSegment(i) + "'";
					}
					eval(object + "." + method + "(" + parameterList + ");");
					if (oldHash) {
						this.isActive = false;
						UrlObject.setHash(oldHash); //restaurez hash-ul
					}
				}
			}
		}, 50);
	}

	this.refresh = function () {
		this.evalUrl();
	}


	this.executeUrl = function () {

		var oldObject, newObject;
		var oldHash;

		if (this.hash) { //salvez hash-ul pentru a-l restaura in caz ca se apeleaza o functie cu _ in fata
			oldHash = this.hash;
			if (this.totalSegments() >= 1) {
				oldObject = this.getSegment(1); //salvez obiectul ca sa vad daca se modifica si respectiv daca trebuie sa apelez __load()
			}
		}

		this.loadHash(); //incarc noul hash

		if (!this.hash.match(/^[a-zA-z0-9\/#_]*$/)) { //verific sa fie alfanumeric sau sa aiba _
			this.redirect();
			return;
		}
		if (this.hash.match(/__[_]*/)) { //hash-ul nu trebuie sa aiba __
			this.redirect();
			return;
		}

		if (this.totalSegments() >= 2) { //verific daca metoda e de tipul _metoda
			method = this.getSegment(2);

			if (method[0] == '_') {
				this.evalUrl(oldHash); //evaluez functia si restaurez hash-ul

				return;
			}
		}

		if (this.totalSegments() >= 1) {
			newObject = this.getSegment(1);
		}

		if (oldObject != newObject) { //verific daca s-a schimbat obiectul
			eval(this.getSegment(1) + ".__load();");
		}

		if (this.totalSegments() < 1) { //nu s-au dat obiectul si functia

		} else {
			this.evalUrl();
		}
	}

	this.executeUrl();
	
	$(document).ready(function() {
		$(window).hashchange(function() {
			if(UrlObject.isActive == true) {
				UrlObject.executeUrl();
				} else { //nu se doreste executia url-ului, insa memorez hash-ul pentru a sti daca la urmatorul apel trebuie sa apelez __load();
					UrlObject.loadHash();
				}
			Panels.getCurrent().currentUrl = location.hash;
			UrlObject.isActive = true;
		});
	});
}

var UrlObject = null;