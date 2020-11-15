/* ---------- particles.js functions - start ------------ */

window.pJSDom = [];

window.particlesJS = function(tag_id, params){

	//console.log(params);

	/* no string id? so it's object params, and set the id with default id */
	if(typeof(tag_id) != 'string'){
		params = tag_id;
		tag_id = 'particles-js';
	}

	/* no id? set the id to default id */
	if(!tag_id){
		tag_id = 'particles-js';
	}

	/* pJS elements */
	var pJS_tag = document.getElementById(tag_id);
	if(pJS_tag !== null){
		var pJS_canvas_class = 'particles-js-canvas-el',
			exist_canvas = pJS_tag.getElementsByClassName(pJS_canvas_class);
		/* remove canvas if exists into the pJS target tag */
		if(exist_canvas.length){
			while(exist_canvas.length > 0){
				pJS_tag.removeChild(exist_canvas[0]);
			}
		}

		/* create canvas element */
		var canvas_el = document.createElement('canvas');
		canvas_el.className = pJS_canvas_class;

		/* set size canvas */
		canvas_el.style.width = "100%";
		canvas_el.style.height = "100%";

		/* append canvas */
		var canvas = document.getElementById(tag_id).appendChild(canvas_el);

		/* launch particle.js */
		if(canvas != null){
			pJSDom.push(new pJS(tag_id, params));
		}
	}
};
