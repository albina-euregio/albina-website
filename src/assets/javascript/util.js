var PMUTIL = function() {
	var altKeyPressed = false;
	var ctrlKeyPressed = false;
	function Numsort(a, b) {
		return a - b;
	}
	return {
		altKeyPressed: function() { return altKeyPressed },
		ctrlKeyPressed: function() { return ctrlKeyPressed },
		downKeyHandler: function(e) {
			if (e.keyCode==18)
				altKeyPressed = true;
			if (e.keyCode==17)
				ctrlKeyPressed = true;
		},
			
		upKeyHandler: function(e) {
			if (e.keyCode==18)
				altKeyPressed = false;
			if (e.keyCode==17)
				ctrlKeyPressed = false;
		},
			
		keyHandler: function(e) {
			var keyCode = (e) ? e.which : e.keyCode;
		    if (!e) {
		    	e = window.event;
		    }
			// CTRL-X
		    if (e.ctrlKey && keyCode == 88 || keyCode == 120) {
		    	PM.copy();
		    	PM.cut();
		    }
			// CTRL-C
		    if (e.ctrlKey && keyCode == 67 || keyCode == 99)
		    	PM.copy();
		    // CTRL-V
		    if (e.ctrlKey && keyCode == 86 || keyCode == 118)
		    	PM.paste();
		
			// CTRL-RETURN
		    /*
		    if (e.ctrlKey && keyCode == 13)
		    	PM.onExpandClick(document.getElementById('expandImg'));
		    else
		    	// CTRL-RETURN
		    	if (keyCode == 13)
		    		PM.addSingleSentence();
		    	// CTRL-ARROWRIGHT
				if (e.ctrlKey && e.keyCode == 39)
					PM.addCompletion();
				// PLUS
				if (keyCode == 43) {
					PM.focusCatalogPane();
					PM.focusFilter(true);
				}
			*/
		},
		isComplete: function(list) {
			var length = list.length;
			for (var i=0;i<length;i++)
				if (list[i]=='')
					return false;
			return true;
		},
		intersection: function(a, b) {
		  var result = new Array();
		  while( a.length > 0 && b.length > 0 )
		  {  
		     if      (a[0] < b[0] ){ a.shift(); }
		     else if (a[0] > b[0] ){ b.shift(); }
		     else {
		       result.push(a.shift());
		       b.shift();
		     }
		  }
		  return result;
		},
		unique: function(a) {
			var unique = new Array();
			var sorted = a.sort(Numsort);
			var last = "";
			for (var i=0; i<sorted.length;i++) {
				if (last==sorted[i]) continue;
				last = sorted[i];
				unique.push(last);
			}
			return unique;
		},
		cleanRanges: function(froms,tos) {
			if (froms.length>1) {
				var f = froms.sort(Numsort);
				var t = tos.sort(Numsort);
				froms = []; tos = [];
				froms[0] = f[0]; tos[0] = t[0];
				var index = 0;
				for (var j=1;j<f.length;j++) {
					if (f[j]<tos[index])
						tos[index] = t[j];
					else {
						index++;
						froms[j] = f[index];
						tos[j] = t[index];
					}
				}
			}
		}
	};
}();

if (document.captureEvents) {
    document.captureEvents(Event.KEYPRESS);
    document.captureEvents(Event.KEYDOWN);
    document.captureEvents(Event.KEYUP);
}

document.onkeypress = PMUTIL.keyHandler;
document.onkeydown  = PMUTIL.downKeyHandler;
document.onkeyup    = PMUTIL.upKeyHandler;
