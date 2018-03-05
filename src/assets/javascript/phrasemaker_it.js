var PM = function () {

	//------------------------------------------------------------------------------------------------
	// Catalog
	//------------------------------------------------------------------------------------------------

	function refreshPhrases() {
		var filter = $('#filterInput').val();
		var words = filter == "" ? [] : filter.split(" ");
		var regExps = new Array();
		for (var i = 0; i < words.length; i++)
			regExps.push(new RegExp(words[i], 'i'));

		$('tr.sentence:has(:checked)').each(function (i) {
			$('.singleOption', $(this)).each(function (i) { highlightCell(this, words, regExps); });

			$('.phraseTable', $(this)).each(function (i) {
				var cellToSelect = null;
				var maxHitRate = 0;
				$('.phraseRow > td', $(this)).each(function (i) {
					var hitRate = highlightCell(this, words, regExps);

					if (maxHitRate < hitRate) {
						cellToSelect = this;
						maxHitRate = hitRate;
					} else if (maxHitRate == hitRate)
						cellToSelect = null;
				});
				if (maxHitRate > 0 && cellToSelect != null)
					onPhraseClick(cellToSelect);
			});

		});

	}

	function highlightCell(cell, words, regExps) {
		var phrase = phraseArray[cell.getAttribute('id')];
		var filteredOptions = filterPhraseOptions(cell.getAttribute('id'), words, regExps);
		var text = highlight(phrase, words, regExps, filteredOptions);
		cell.innerHTML = text;
		return text.length - phrase.length;
	}

	function filterPhraseOptions(phraseId, words, regExps) {
		if (words.length == 0) return [];
		var result = new Array();
		var options = getPhraseOptions(phraseId);
		for (var i = 0; i < options.length; i++) {
			var notFound = true;
			var phrases = optionArray[options[i]];
			if (phrases == undefined) continue;
			for (var j = 0; j < phrases.length && notFound; j++) {
				var txt = phraseArray[phrases[j]];
				for (var k = 0; k < regExps.length && notFound; k++) {
					var pos = txt.search(regExps[k]);
					if (pos != -1) {
						result.push(i);
						notFound = false;
					}
				}
			}
		}
		return result;
	}

	function highlight(text, words, regExps, filteredOptions) {
		var froms = new Array();
		var tos = new Array();
		for (var i = 0; i < words.length; i++) {
			var pos = text.search(regExps[i]);
			if (pos != -1) {
				froms.push(pos + 0);
				tos.push(pos + words[i].length);
			}
		}
		// highlight filtered subOptions
		var regexp = new RegExp("\{.+?\}", 'gi');
		if ((list = text.match(regexp)) != null)
			for (var i = 0; i < filteredOptions.length; i++) {
				var pos = text.search(list[filteredOptions[i]]);
				if (pos != -1) {
					froms.push(pos + 0);
					tos.push(pos + list[i].length);
				}
			}
		// 
		PMUTIL.cleanRanges(froms, tos);
		return highlightRanges(text, froms, tos);
	}

	function highlightRanges(text, froms, tos) {
		if (froms.length == 0 || tos.length == 0 || froms.length != tos.length) return text;
		var result = "";
		var index = 0;
		for (var i = 0; i < froms.length; i++) {
			result = result.concat(text.substring(index, froms[i]) + "<span class='filter'>" + text.substring(froms[i], tos[i]) + "</span>");
			index = tos[i];
		}
		if (index < text.length)
			result = result.concat(text.substring(index));
		return result;
	}

	function getPhraseOptions(id) {
		var options = new Array();
		var regexp = new RegExp("\{(.+?)\}", 'gi');
		if ((list = phraseArray[id].match(regexp)) != null)
			for (var i = 0; i < list.length; i++)
				if ((phraseId = getOptionId(list[i])) != null)
					options.push(phraseId);
		return options;
	}

	function getOptionId(optionName) {
		for (var i = 0; i < optionNames.length; i++)
			if (optionNames[i] == optionName)
				return i;
		return optionName.replace(/^(\d+)(#\d*)+/g, '$1');
	}

	function getPhraseOption(id, subPhrases, raw, depth, nr) {
		var phrase = phraseArray[id];
		var subOptions = getPhraseOptions(id);
		var regexp = new RegExp("\{.+?\}", 'gi');
		var list = null;
		if ((list = phrase.match(regexp)) != null)
			for (var i = 0; i < list.length; i++) {
				var text = null;
				var index = (depth + nr) * 10 + i;
				if (subPhrases[index] == undefined || subPhrases[index] == "") {
					text = list[i];
				} else {
					text = (raw ? " " : "{") + getPhraseOption(subPhrases[index], subPhrases, raw, depth + 1, i) + (raw ? " " : "}");
				}
				if (!raw) {
					text = "<span class='subOption" + depth + "' onClick='PM.openPhraseOption(this," + index + "," + subOptions[i] + ",event)'>" + text + "</span>";
				}
				phrase = phrase.replace(list[i], text);
			}
		return phrase;
	}

	function openPhraseOption(element, index, optionId, evt) {
		closePhraseOption();
		$(element).addClass('subOptionSelected');
		var phrasesData = new Array();
		optionArray[optionId].forEach(function (item) { phrasesData.push({ Id: item, Text: phraseArray[item] }); });
		$('#phraseOptionTemplate').tmpl({ Index: index, Phrases: phrasesData })
			.insertBefore($('tr.phraseRow:first', $(element).parents('.phraseTable')));
		evt.stopPropagation();
		return false;
	}

	function onPhraseClick(cell) {
		closePhraseOption();
		$(cell.parentNode.parentNode.rows[1].cells[0])
			.html(getPhraseOption($(cell).attr('id'), [], false, 0, 0))
			.attr({
				id: $(cell).attr('id'),
				class: 'selectedOption',
				subPhrases: []
			});
	}

	function closePhraseOption() {
		$('#phraseOptionId').remove();
		$('.subOption0, .subOption1').removeClass('subOptionSelected');
	}

	function onSubPhraseClick(element) {
		var index = $('#phraseOptionId').attr('index');
		var cell = $(element).parents('.phraseTable').find('.selectedOption');

		var subPhrases = cell.attr('subPhrases').split(",");
		subPhrases[index] = $(element).attr('id');
		// clear subsubPhrases
		if (index < 10) {
			var start = (Number(index) + 1) * 10;
			for (var i = start; i < start + 10; i++)
				delete subPhrases[i];
		}
		cell.attr('subPhrases', subPhrases)
			.html(getPhraseOption($(cell).attr('id'), subPhrases, false, 0, 0));

		// highlight the suboption
		if (index < 10)
			$('.subOption0:eq(' + index + ')', cell).addClass('subOptionSelected');
		else {
			var i = Math.floor(index / 10) - 1;
			var r = index % 10;
			$('.subOption0:eq(' + i + ')', cell).find('.subOption1:eq(' + r + ')').addClass('subOptionSelected');
		}

	}

	function getSentence(id, expanded) {
		var optionData = new Array();
		sentenceArray[id].forEach(function (item) { optionData.push(getOptionData(item, expanded)); });
		var data = { Title: sentenceNames[id], Id: id, Options: optionData, ContextPath: contextPath };
		return $('#sentenceTemplate').tmpl(data);
	}

	function getOptionData(option, expanded) {
		var phrases = optionArray[option];
		if (phrases == undefined || phrases.length == 0) return null;

		var data;
		if (phrases.length == 1) {
			data = { Id: phrases[0], Class: 'singleOption', Title: optionNames[option], Text: phraseArray[phrases[0]], Phrases: [] };
		} else {
			data = { Id: '', Class: 'openOption', Title: optionNames[option], Text: 'bitte auswählen', Phrases: [] };
			if (expanded)
				phrases.forEach(function (item) {
					data.Phrases.push({ Id: item, Class: 'phrase' });
				});
		}
		return data;
	}

	function onSentenceClick(el) {
		var newSentence = getSentence(el.parentNode.parentNode.id, el.checked);
		$(el.parentNode.parentNode).replaceWith(newSentence);
		$('.phraseRow', newSentence).css('visibility', el.checked ? 'visible' : 'collapse');
		if (el.checked)
			$(':checkbox', newSentence).attr('checked', 'checked');
		else
			$(':checkbox', newSentence).removeAttr('checked');
		refreshPhrases();
	}

	function search(force) {
		var s = new Date().getTime();
		filtered = getMatchingSentences($('#filterInput').val().split(" "));
		var m1 = new Date().getTime();
		var length = filtered.length;
		if (filtered.length > 50 && !force)
			filtered = [];

		buildSentences(filtered);
		var m2 = new Date().getTime();
		expandOptions(filtered.length == 1);
		var m3 = new Date().getTime();
		refreshPhrases();
		var e = new Date().getTime();
		setStatus(length + ' sentences found (' + (e - s) + '=' + (m1 - s) + ':' + (m2 - m1) + ':' + (m3 - m2) + ':' + (e - m3) + 'ms)');
	}

	function getMatchingSentences(words) {
		var filtered = [];
		for (var i = 0; i < words.length; i++) {
			if (words[i].length == 0) continue;
			var regExp = new RegExp(words[i], 'i');
			var tmp = new Array();
			for (var j in indexArray)
				if (j.match(regExp))
					tmp = tmp.concat(indexArray[j]);
			filtered = (i == 0) ? PMUTIL.unique(tmp) : PMUTIL.intersection(filtered, PMUTIL.unique(tmp));
		}
		return filtered;
	}

	function buildSentences(list) {
		$('#sTable').empty();
		list.forEach(function (item) { getSentence(item, list.length == 1).appendTo('#sTable'); });
		//expandOptions(isExpanded);
	}

	function expandOptions(flag) {
		$('.phraseRow').css('visibility', flag ? 'visible' : 'collapse');
		// requires jquery 1.6.2: $(':checkbox', $('tr.sentence')).prop("checked", flag);
		if (flag)
			$(':checkbox', $('tr.sentence')).attr('checked', 'checked');
		else
			$(':checkbox', $('tr.sentence')).removeAttr('checked');
	}

	function addSentenceClick(row, insert) {
		if ($('.openOption', row).length > 0) { alert('Satz unvollständig!'); return; }
		var errors = [];
		var options = [];
		$('.selectedOption, .singleOption', row).each(function () {
			var elements = [];
			var subPhrases = this.textContent.match(/{/g);
			var undefinedSubPhrases = subPhrases == null ? 0 : subPhrases.length;
			var subPhrases = $(this).attr('subPhrases');
			if (!(subPhrases == '' || subPhrases == undefined)) {
				var list = subPhrases.split(',');
				for (var i = 0; i < list.length; i++)
					if (list[i] != '')
						undefinedSubPhrases--;
				for (var i = 0; i < list.length && i < 10; i++) {
					var sub = list.slice((i + 1) * 10, (i + 1) * 10 + 9).filter(function (el) { return (el != ''); }).join(',');
					elements.push(list[i] + (sub == '' ? '' : '[' + sub + ']'));
				}
			}
			if (undefinedSubPhrases > 0)
				errors.push('Phrase "' + this.textContent + '" unvollständig!');
			options.push($(this).attr('id') + (elements.length == 0 ? '' : '[' + elements.filter(function (el) { return (el != ''); }).join(',') + ']'));
		});
		if (errors.length > 0) {
			alert(errors.join('\n'));
		} else {
			var def = $(row).attr('id') + '[' + options.join(',') + ']';
			//setStatus(convertDBID(def,false));
			if (insert)
				appendSentence(null, def);
			else
				replaceSentence(def);

			updateValue(divPointer);
		}
	}

	function setSentence(def) {

		var options = [];
		buildSentences((def == undefined || def == null) ? [] : [extract(def, options)]);

		var i = 0;
		$('.openOption, .singleOption').each(function () {
			var subOptions = [];
			var id = extract(options[i++], subOptions);
			subOptions = fakeSubOptions(subOptions);
			if ($(this).hasClass('openOption'))
				$(this)
					.html(getPhraseOption(id, subOptions, false, 0, 0))
					.attr({
						id: id,
						class: 'selectedOption',
						subPhrases: subOptions
					});
		});
		expandOptions(true);
		refreshPhrases();
	}

	function createSentence(def) {
		if (def == undefined || def == null) return '';
		var phrases = [];
		var options = [];
		extract(def, options);
		options.forEach(function (item) {
			var subOptions = [];
			var id = extract(item, subOptions);
			phrases.push(getPhraseOption(id, fakeSubOptions(subOptions), true, 0, 0));
		});
		return formatSentence(phrases.join(' '));
	}

	function fakeSubOptions(subOptions) {
		var result = [];
		for (var i = 0; i < subOptions.length && i < 10; i++) {
			var subsubOptions = [];
			result[i] = extract(subOptions[i], subsubOptions);
			for (var j = 0; j < subsubOptions.length; j++)
				result[(i + 1) * 10 + j] = subsubOptions[j];
		}
		return result;
	}

	function convertDBID(def, from) {
		var result = [];
		var map = from ? DBIDMap : IDMap;
		var char = from ? '-' : '';
		def.split(DELIM).forEach(function (item) {
			item = item.replace(/^(\d+)/g, function (a, b) { return map.s[b + char]; });
			result.push(item.replace(/([^\^\d])([\d]+)/g, function (a, b, c) { return b + map.p[c + char]; }));
		});
		return result.join(DELIM);
	}

	function extract(def, options) {
		if (def == null || def.length == 0) return null;
		// "98[1526[502,512],6801,6799]" => id="98" options=[ "1526[502,512]", "6801", "6799" ]
		// 13[5059,5062,5078[2596[6695],3049[6694],5748[6551,6565]],5081]
		var regexp = /^(\d+)(?:\[(.*)\])?$/g;
		var match = regexp.exec(def);

		options.length = 0;
		var depth = 0;
		if (match[2] != undefined) {
			var letters = match[2].split('');
			for (var i = 0; i < letters.length; i++) {
				if (letters[i] == '[') depth++;
				if (letters[i] == ']') depth--;
				if ((depth == 0) && (letters[i] == ',')) letters[i] = ';';
			}
			letters.join('').split(';').forEach(function (item) { options.push(item); });
		}
		return match[1];
	}

	function formatSentence(string) {
		if (string == null || string == undefined || string.length == 0) return string;
		// delete multiple spaces
		string = string.replace(/[ ]+/g, ' ');
		// delete spaces before comma and point
		string = string.replace(/[ ]+,/g, ',');
		string = string.replace(/[ ]+\./g, '.');
		// delete spaces at the beginning
		string = string.replace(/^[ ]+/g, '');
		// start with uppercase letter
		string = string[0].toUpperCase() + string.slice(1);
		return string;
	}

	//------------------------------------------------------------------------------------------------
	// Catalog/Editor - Joker-Sentence
	//------------------------------------------------------------------------------------------------

	var isJokerSentenceFormOpen = false;

	function openJokerSentenceForm() {
		if (!isJokerSentenceFormOpen) {
			isJokerSentenceFormOpen = true;
			$('#jokerSentenceFormTemplate').tmpl({ ContextPath: contextPath }).appendTo($('#dialog_jokerSentenceArea'));
			//$('#jokerSentenceForm_de').val($('#filterInput').val());
			$('#jokerSentenceForm_de').focus();
		}
	}

	function closeJokerSentenceForm() {
		if (isJokerSentenceFormOpen) {
			$('#dialog_jokerSentenceArea').empty();
			isJokerSentenceFormOpen = false;
		}
	}

	function saveJokerSentence() {
		var bValid = true;
		var jokerde = $('#jokerSentenceForm_de');
		var jokeren = $('#jokerSentenceForm_en');
		var jokerfr = $('#jokerSentenceForm_fr');
		var jokerit = $('#jokerSentenceForm_it');
		var allFields = $([]).add(jokerde).add(jokeren).add(jokerfr).add(jokerit)

		allFields.removeClass("ui-state-error");

		bValid = bValid && checkValue(jokerde, "deutschen");
		bValid = bValid && checkValue(jokeren, "englischen");
		bValid = bValid && checkValue(jokerfr, "französischen");
		bValid = bValid && checkValue(jokerit, "italienischen");

		if (bValid) {
			var js = new Object();
			js.de = jokerde.val();
			js.en = jokeren.val();
			js.fr = jokerfr.val();
			js.it = jokerit.val();

			sendSentence(js);
			closeJokerSentenceForm();
		}
	}

	var wait = 4
	function sendSentence(jokerSentence) {
		$.post(saveJokerURL,
			{ type: 'joker', jokerde: jokerSentence.de, jokeren: jokerSentence.en, jokerfr: jokerSentence.fr, jokerit: jokerSentence.it },
			function (dbid) {
				sentenceArray = new Array();
				optionArray = new Array();
				phraseArray = new Array();
				cleanedPhraseArray = new Array();
				regExpArray = new Array();
				indexArray = new Array();

				sentenceNames = new Array();
				optionNames = new Array();

				wait = 4;
				jQuery.getJSON(sentenceURL, function (data) {
					putSentences(data);
					wait--;
					displayJoker(dbid);
				});

				jQuery.getJSON(optionURL, function (data) {
					putOptions(data);
					wait--;
					displayJoker(dbid);
				});

				jQuery.getJSON(phraseURL, function (data) {
					putPhrases(data);
					wait--;
					displayJoker(dbid);
				});

				jQuery.getJSON(indexURL, function (data) {
					putIndexes(data);
					wait--;
					displayJoker(dbid);
				});
			});
	}

	function displayJoker(dbid) {
		if (wait == 0) {
			var ids = new Array();
			var id = DBIDMap.s[dbid + "-"];
			console.info("Id: %d, dbId: %d", id, dbid);
			ids.push(id);
			buildSentences(ids);
		}
	}


	function updateTips(t) {
		var tips = $('#jokerSentenceForm_validateTips');
		tips.text(t).addClass("ui-state-highlight");
		setTimeout(function () {
			tips.removeClass("ui-state-highlight", 1500);
		}, 500);
	}

	function checkValue(o, n) {
		if (o.val().length == 0) {
			o.addClass("ui-state-error");
			updateTips("Bitte den " + n + " Satz eingeben.");
			return false;
		} else {
			return true;
		}
	}

	// Check if entered chars are within ISO-8859-15 charset
	function validateCharsetISO8859(s) {
		if (s.value.length) {
			lastChar = s.value.charCodeAt(s.value.length - 1)
			if (!((lastChar >= 32 && lastChar <= 126) || (
				lastChar >= 160 && lastChar <= 255))) {
				s.value = s.value.substring(0, s.value.length - 1);
				alert('Ungültiges Zeichen verwendet!');
			}
		}
	}

	//------------------------------------------------------------------------------------------------
	// Editor
	//------------------------------------------------------------------------------------------------

	var divPointer = null;
	var DELIM = '.';
	function setStatus(text) { document.getElementById('status').innerHTML = text; }

	$ = jQuery;

	function getValue(element) { return $('input', element).attr("value"); }
	function setValue(element, value) { $('input', element).attr("value", value); }

	function openDialog(ref, def) {
		$('#filterInput').val('');
		$('#dialog').length == 0 ? initDialog(true) : $('#dialog').dialog('open');
		divPointer = ref;
		setSentence(def);
	}

	function createText(def) {
		var sentences = [];
		try {
			convertDBID(def, true).split(DELIM).forEach(function (item) {
				if (item != '')
					sentences.push(createSentence(item));
			});
		} catch (e) {
			return '<span class="empty">Ungültiger Text definiert.</span>'
		}
		return sentences.length == 0 ? '<span class="empty">Kein Text definiert.</span>' : sentences.join(' ');
	}

//Clesius 
	function translateText(def,l) {
		var sentences = [];
		try {
			var param = "";
			if (srcLang == "it")
				param = "&from=it&to=" + l + "&domain=DESCRIPTION_OF_DANGER";
			else
				param = "&from=de&to=" + l + "&domain=DESCRIPTION_OF_DANGER";
			var contextApiPath = getEnvValue(window.contextApiPath, '/' + location.pathname.split('/')[1] + '/');
			var translateURL =  contextApiPath + "api/translate?text=" + def + param;
			jQuery.ajaxSetup({async:false});
			jQuery.get(translateURL, function (data) {
				if (data != '')
				sentences.push(data)
			});
			jQuery.ajaxSetup({async:true});
		} catch (e) {
			return '<span class="empty">Non sono riuscito a tradurre.</span>'
		}
		return sentences.length == 0 ? '<span class="empty">Kein Text definiert.</span>' : sentences.join(' ');
	}
	
	function replaceSentence(value) {
		$('li.selected')
			.html(createSentence(value))
			.attr('id', value);
		$('li').removeClass('selected');
		$('#dialog').dialog('close');
	}

	function appendSentence(div, value, preceding) {
		if (div == null)
			div = divPointer;
		var li = $('<li>')
			.html(createSentence(value))
			.attr('id', value)
			.dblclick(function () {
				$(this).addClass('selected');
				openDialog($(this).parent().parent()[0], $(this).attr('id'));
			});
		if (preceding == null)
			li.appendTo($('ul', div));
		else
			li.insertAfter(preceding);
		$('li').removeClass('selected');
		$('#dialog').dialog('close');
	}

	function expandMe() {
		expand(this);
	}

	function expand(div) {
		$(div).removeClass('tch');
		$('<img title="' + 'Conferma' + '" src="' + contextPath + 'images/text_ok.png" onclick="PM.collapse(this.parentNode)">').appendTo(div);
		$('<img title="' + 'Cerca' + '" src="' + contextPath + 'images/text_find.png" onclick="PM.openDialog(this.parentNode)">').appendTo(div);
		$('<img title="' + 'Elimina' + '" src="' + contextPath + 'images/garbage.png" class="trash">').appendTo(div);
		$("p", div).remove();
		//Clesius
		$("table", div).remove();

		var list = $('<ul class="sortable">').appendTo(div);

		var def = convertDBID($('input', div).attr('value'), true);
		def.split(DELIM).forEach(function (item) {
			if (item.length > 0)
				appendSentence(div, item);
		});

		$(function () {
			$('.trash').droppable({ tolerance: 'pointer', drop: function (event, ui) { $(ui.draggable).remove(); } });
			//$(list).sortable( { connectWith: '.sortable' } );
			//$(list).disableSelection();

			$(list).sortable({
				helper: "clone",
				connectWith: '.sortable',
				start: function (event, ui) {
					if (PMUTIL.ctrlKeyPressed()) {
						$(ui.helper).append('<img src="' + contextPath + 'images/add.png">');
						$(ui.item).show();
						clone = $(ui.item).clone().dblclick(function () {
							$(this).addClass('selected');
							openDialog($(this).parent().parent()[0], $(this).attr('id'));
						});
						before = $(ui.item).prev();
						parent = $(ui.item).parent();
					}
				},
				stop: function (event, ui) {
					if (PMUTIL.ctrlKeyPressed())
						if (before.length == 0)
							parent.prepend(clone);
						else
							before.after(clone);
					updateValue(this.parentNode);
				},
				receive: function (event, ui) {
					updateValue(this.parentNode);
				}
			}).disableSelection();

		});
		$(div).unbind();
	}

	function collapse(el) {
		var def = updateValue(el);
		$(el).addClass('tch');
		$('ul', el).remove();
		$('img', el).remove();
		$('<table id="tradTable">', el).remove();
		$('<p>').append(createText(def)).appendTo(el);
		
		//Clesius
		//traduzione nelle 4 lingue
		$('<table id="tradTable">').appendTo(el);

		$('#tradTable').append('<tr><td> <img src=images/de.png></td><td  class="textcatTrad">' + translateText(def,'de') + '</td></tr>' );
		$('#tradTable').append('<tr><td> <img src=images/it.png></td><td  class="textcatTrad">' + translateText(def,'it') + '</td></tr>' );
		$('#tradTable').append('<tr><td> <img src=images/en.png></td><td  class="textcatTrad">' + translateText(def,'en') + '</td></tr>' );
		$('#tradTable').append('<tr><td> <img src=images/fr.png></td><td  class="textcatTrad">' + translateText(def,'fr') + '</td></tr>' );

		$(el).unbind();
		$(el).dblclick(expandMe);
	}

	function updateValue(el) {
		var values = [];
		$('ul > li', el).each(function () {
			values.push(convertDBID($(this).attr('id'), false));
		});
		var def = values.join(DELIM);
		$('input', el).attr('value', def);
		return def;
	}

	function initDialog(autoOpen) {
		$('#dialogTemplate').tmpl({ ContextPath: contextPath }).appendTo($('input.textcat').first());
		$('#dialog').dialog({
			title: 'Satzkatalog',
			class: 'dialog',
			autoOpen: autoOpen,
			width: '90%',
			height: '900',
			close: function (event, ui) {
				$('li').removeClass('selected');
				closeJokerSentenceForm();
			}
		});
	}

	function readTemplates() {
		$.get(contextPath + 'templates/_templates.html', function (templates) {
			$('body').append(templates);
			initDialog(false);
		}, 'html');
	}

	function initFields() {
		// Init input fields
		$('input.textcat').each(function () {
			if ($(this).get(0).type != 'hidden') {
				$(this).wrap('<div class="textcat tch"/>');
				$(this.parentNode).dblclick(expandMe);	

				$(this).get(0).type = 'hidden';
				$('<p>').append(createText(this.value)).appendTo(this.parentNode);
				
				
			}
		});

		// Init text fields
		$('input.textcatRO').each(function () {
			if ($(this).get(0).type != 'hidden') {
				$(this).wrap('<div class="textcatRO"/>');
				$(this).get(0).type = 'hidden';
				var p = $('<p>').appendTo(this.parentNode);
				this.value.split(DELIM).forEach(function (item) {
					p.append($('<li>').html(createText(item)).attr('id', convertDBID(item, true)));
				});
			}
		});
	}

	var count = 0;
	function initAfterLoad() {
		if (count++ == 3) {
			readTemplates();
			initFields();
			console.info('Texteditor initialized');
		}
	}
	function init() {
		if (count == 4) {
			initFields();
			console.log('Fields refreshed');
		} else
			console.log('Refresh ignored');
	}

	//------------------------------------------------------------------------------------------------
	// Initialisation
	//------------------------------------------------------------------------------------------------
	

	var srcLang = location.search.split('l=')[1]
	if  (typeof srcLang === "undefined")
		 srcLang="de";

	// var contextPath = getEnvValue(window.contextPath, '/' + location.pathname.split('/')[1] + '/');
	var contextPath = "assets/";
	// var contextApiPath = getEnvValue(window.contextApiPath, '/' + location.pathname.split('/')[1] + '/');
	var contextApiPath = "http://albina.clesius.it/textcat/";
	var sentenceURL = getEnvValue( contextApiPath + window.sentenceURL + "&l=" + srcLang, contextApiPath + "textcat?type=sentence");
	var optionURL = getEnvValue( contextApiPath + window.optionURL + "&l=" + srcLang, contextApiPath + "textcat?type=option");
	var phraseURL = getEnvValue( contextApiPath + window.phraseURL + "&l=" + srcLang, contextApiPath + "textcat?type=phrase");
	var indexURL = getEnvValue( contextApiPath + window.indexURL + "&l=" + srcLang, contextApiPath + "textcat?type=indexfull");

	var saveJokerURL = getEnvValue(window.saveJokerURL, contextPath + "textcat");
	


	function getEnvValue(envValue, defaultValue) {
		return envValue == undefined ? defaultValue : envValue;
	}

	$("<link>").attr({ type: 'text/css', rel: 'stylesheet', href: contextPath + 'css/phrasemaker.css' }).appendTo('head');
	$("<link>").attr({ type: 'text/css', rel: 'stylesheet', href: contextPath + 'css/smoothness/jquery-ui.min.css' }).appendTo('head');
	$.getScript(contextPath + 'javascript/util.js');
	$.getScript(contextPath + 'javascript/jquery.tmpl.min.js');
	$.getScript(contextPath + 'javascript/jquery-ui.min.js');

	var sentenceArray = new Array();
	var optionArray = new Array();
	var phraseArray = new Array();
	var cleanedPhraseArray = new Array();
	var regExpArray = new Array();
	var indexArray = new Array();

	var sentenceNames = new Array();
	var optionNames = new Array();

	var IDMap = new Object();
	var DBIDMap = new Object();

	var filtered = new Array();
	var isExpanded = false;
	var isFiltered = false;

	function setId(idm, dbidm, i, item) {
		idm.push(item.dbid);
		dbidm[item.dbid + '-'] = i;
	}
	function putSentences(data) {
		IDMap.s = new Array();
		DBIDMap.s = new Array();
		$.each(data.items, function (i, item) {
			sentenceArray.push(item.options.split(";"));
			if (srcLang == "it")
				sentenceNames.push(item.name_IT);
			else
				sentenceNames.push(item.name);
			setId(IDMap.s, DBIDMap.s, i, item);
		});
		console.info("Init: %d sentences loaded", sentenceArray.length);
		initAfterLoad();
	}
	function putOptions(data) {
		IDMap.o = new Array();
		DBIDMap.o = new Array();
		$.each(data.items, function (i, item) {
			optionArray.push(item.phrases.split(";"));
			if (srcLang == "it")
				optionNames.push(item.name_IT);
			else
				optionNames.push(item.name);
			setId(IDMap.o, DBIDMap.o, i, item);
		});
		console.info("Init: %d options loaded", optionArray.length);
		initAfterLoad();
	}
	function putPhrases(data) {
		IDMap.p = new Array();
		DBIDMap.p = new Array();
		var regexp = new RegExp("\{(\\d+)(#\\d+)\}", 'gi');
		$.each(data.items, function (i, item) {
			phraseArray.push(item.value.replace(regexp, function (match, id) { return optionNames[id]; }));

			var phrase = item.value;
			// leading spaces has to be removed in the metadata!!
			phrase = phrase.replace(/^[\s]+/, '');

			cleanedPhraseArray.push(phrase);

			// trailing blanks have to be removed in the metadata!!
			//phrase = phrase.replace(/\s+$/,''); => makes it slow, but why
			phrase = phrase.replace(/\.\s$/, '');
			// the dot at the end has to be removed in the metadata!!
			phrase = phrase.replace(/\.$/, '');

			var regExpStr = "^" + phrase.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			regExpArray.push(new RegExp(regExpStr, 'i'));

			setId(IDMap.p, DBIDMap.p, i, item);
		});
		console.info("Init: %d phrases loaded", phraseArray.length);
		console.info("Init: %d regexp phrases created", regExpArray.length);
		initAfterLoad();
	}

	function putIndexes(data) {
		$.each(data.items, function (i, item) {
			indexArray[item.word] = item.sentences.split(";").map(Number);
		});
		console.info("Init: %d indexes loaded", indexArray.length);
		initAfterLoad();
	}

	jQuery.getJSON(sentenceURL, putSentences);
	jQuery.getJSON(optionURL, function (data) {
		putOptions(data);
		jQuery.getJSON(phraseURL, putPhrases);
	});
	jQuery.getJSON(indexURL, putIndexes);

	return {
		cut: function () {
			if ($('li:hover').length > 0) {
				console.log('Cut sentence');
				$('li:hover').remove();
			}
			if ($('p:hover').length > 0) {
				console.log('Cut block');
				var parent = $('p:hover').parent();
				$('input', parent).attr('value', '');
				$('p', parent).html(createText(''));
			}
		},

		copy: function () {
			if ($('li:hover').length > 0) {
				var value = $('li:hover').attr('id');
				console.log('Copy sentence ' + value);
				localStorage.setItem("clipboard", value);
			} else
				if ($('p:hover').length > 0) {
					var parent = $('p:hover').parent();
					var value = $('input', parent).attr('value');
					console.log('Copy block ' + value);
					localStorage.setItem("clipboard", convertDBID(value, true));
				}
		},

		paste: function () {
			var value = localStorage.getItem("clipboard");
			var sentences = value.split(".");
			if ($('.textcat ul li:hover').length > 0) {
				var parent = $('li:hover').parent().parent();
				sentences.forEach(function (item) {
					console.log('Append sentence ' + item);
					appendSentence(parent, item, $('li:hover'));
				});
				updateValue(parent);
			} else if ($('.textcat ul:hover').length > 0) {
				sentences.forEach(function (item) {
					console.log('Paste sentence ' + item);
					appendSentence($('ul:hover').parent(), item);
				});
				updateValue($('ul:hover').parent());
			} else if ($('.textcat p:hover').length > 0) {
				console.log('Paste block ' + value);
				var parent = $('p:hover').parent();
				var def = convertDBID(value, false);
				$('input', parent).attr('value', def);
				$('p', parent).html(createText(def));
			}
		},

		init: function () { init() },
		//load:					function()			{ initialLoad()				},
		search: function (a) { search(a) },
		collapse: function (a) { collapse(a) },
		openDialog: function (a, b) { openDialog(a, b) },
		addSentenceClick: function (a, b) { addSentenceClick(a, b) },
		onSentenceClick: function (a) { onSentenceClick(a) },
		onPhraseClick: function (a) { onPhraseClick(a) },
		onSubPhraseClick: function (a) { onSubPhraseClick(a) },
		openPhraseOption: function (a, b, c, d) { openPhraseOption(a, b, c, d) },

		openJokerSentenceForm: function () { openJokerSentenceForm() },
		closeJokerSentenceForm: function () { closeJokerSentenceForm() },
		saveJokerSentence: function () { saveJokerSentence() },
		validateCharsetISO8859: function (s) { validateCharsetISO8859(s) }

	}

}();

//$(document).ready(PM.load);

$(document).ajaxError(function (e, xhr, settings, exception) {
	alert('error in: ' + settings.url + ' \n' + 'error:\n' + xhr.responseText);
}); 
