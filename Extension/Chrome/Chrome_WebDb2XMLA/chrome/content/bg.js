(function () {

  window.addEventListener('DOMContentLoaded', run, false);
  
  function run() {
	var  plg;
 
	plg = document.createElement('EMBED');
	plg.type = "application/xmla-chrome";
	plg.width=1;
	plg.height=1;
	document.body.appendChild(plg);
  }
 
})();

