var trans={"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ě":"e","ę":"e","ð":"d","ì":"i","í":"i","î":"i","ï":"i","ł":"l","ñ":"n","ń":"n","ň":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ş":"s","š":"s","ý":"y","ÿ":"y","ž":"z","þ":"th","ß":"ss","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ě":"E","Ę":"E","Ð":"D","Ì":"I","Í":"I","Î":"I","Ï":"I","Ł":"L","Ñ":"N","Ń":"N","Ň":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ş":"S","Š":"S","Ý":"Y","Ÿ":"Y","Ž":"Z","Þ":"TH"};function set_to_lower_case_no_accents(d){var e;var a="";var b;for(b=0;b<d.length;b=b+1){e=d.substr(b,1);if(trans[e]){a+=trans[e]}else{a+=e}}return a.toLowerCase()}function SET_OverviewTable(a){var c=this;var b;this.$myFilters=a.find("thead tr.filter").find("td");this.$myHeaders=a.find("thead tr.header").find("th");this.myHeaderIndexLook=[];this.$myTable=a;a.find("thead tr.filter").each(function(){$(this).css("display","table-row")});this.$myHeaders.each(function(d,g){var e;var f;f=$(g).attr("colspan");if(f){f=parseFloat(f)}else{f=1}for(e=0;e<f;e=e+1){c.myHeaderIndexLook[c.myHeaderIndexLook.length]=d}});this.myColumnHandlers=[];a.find("colgroup").find("col").each(function(g,e){var d;var f;c.myColumnHandlers[g]=null;d=$(e).attr("class");if(d){f=d.split(" ");for(b=0;b<f.length;b=b+1){if(f[b].substr(0,10)==="data-type-"){var h=f[b].substr(10);if(SET_OverviewTable.ourColumnTypeHandlers[h]){c.myColumnHandlers[g]=new SET_OverviewTable.ourColumnTypeHandlers[h]()}}}}if(!c.myColumnHandlers[g]){c.myColumnHandlers[g]=new SET_NoneColumnTypeHandler()}c.myColumnHandlers[g].initFilter(c,g);c.myColumnHandlers[g].initSort(c,g)})}SET_OverviewTable.enableDebug=function(){SET_OverviewTable.myDebug=true};SET_OverviewTable.prototype.mergeInfo=function(b,a){if(b.length===0){a.sort_order=1;b[0]=a}else{if(a.sort_order!==false&&b[a.sort_order-1]){b[a.sort_order-1].sort_direction=a.sort_direction}else{a.sort_order=b.length;b[b.length]=a}}return b};SET_OverviewTable.prototype.getSortOrder=function(c,d){var b;var f;var g;var e;var a=false;b=c.attr("class");if(b){f=b.split(" ");for(e=0;e<f.length;e=e+1){g="sort-order"+d;if(f[e].substr(0,g.length)===g){a=parseInt(f[e].substr(g.length),10)}}}return a};SET_OverviewTable.prototype.getSortDirection=function(a,b){if(a.hasClass("sorted"+b+"desc")){return"desc"}if(a.hasClass("sorted"+b+"asc")){return"asc"}return""};SET_OverviewTable.prototype.sort=function(e,b,d,f){var c;var a;if(SET_OverviewTable.myDebug){SET_OverviewTable.log("Start sort:");SET_OverviewTable.myTimeStart=new Date();SET_OverviewTable.myTimeIntermidiate=new Date()}c=this.getSortInfo();SET_OverviewTable.benchmark("Get all sort info");a=this.getColumnSortInfo(e,b,f);SET_OverviewTable.benchmark("Get info about current column");this.cleanSortClasses();SET_OverviewTable.benchmark("Reset column headers");if(!e.ctrlKey){c=this.mergeInfo([],a);SET_OverviewTable.benchmark("Merge info");this.sortSingleColumn(c[0],d)}else{c=this.mergeInfo(c,a);SET_OverviewTable.benchmark("Merge info");if(c.length===1){this.sortSingleColumn(c[0],d)}else{this.sortMultiColumn(c)}}this.addSortInfo(c);SET_OverviewTable.benchmark("Added info to table head");this.applyZebraTheme();SET_OverviewTable.benchmark("Apply zebra theme");if(SET_OverviewTable.myDebug){SET_OverviewTable.log("Finish sort "+(new Date().getTime()-SET_OverviewTable.myTimeIntermidiate.getTime())+"ms")}};SET_OverviewTable.prototype.getSortInfo=function(){var b=[];var c;var a;var e;var d=this;var f;this.$myTable.find("colgroup").find("col").each(function(h){var g=d.$myHeaders.eq(d.myHeaderIndexLook[h]);c=g.attr("colspan");if(!c||c==="1"){a=d.getSortOrder(g,"-");if(a){b[a-1]={column_index:h,sort_order:a,sort_direction:d.getSortDirection(g,"-"),infix:"-",colspan:1,offset:0}}}else{if(c==="2"){if(g.hasClass("sort-1")){a=d.getSortOrder(g,"-1-");if(a){b[a-1]={column_index:h,sort_order:a,sort_direction:d.getSortDirection(g,"-1-"),infix:"-1-",colspan:2,offset:0}}}if(g.hasClass("sort-2")){a=d.getSortOrder(g,"-2-");if(a){b[a-1]={column_index:h,sort_order:d.getSortDirection(g,"-2-"),sort_direction:e,infix:"-2-",colspan:2,offset:1}}}}}});return b};SET_OverviewTable.prototype.getColumnSortInfo=function(b,a,d){var k;var c={};var h;var g;var f;var l=this.$myTable;var j;var i;function e(o,m,n){var p;p=o.getSortDirection(m,n);if(p==="desc"||p===""){return"asc"}return"desc"}c.column_index=d;k=a.attr("colspan");if(!k||k==="1"){c.infix="-";c.colspan=1;c.offset=0;c.sort_order=this.getSortOrder(a,c.infix);c.sort_direction=e(this,a,c.infix)}else{if(k==="2"){if(a.hasClass("sort-1")&&a.hasClass("sort-2")){i=b.pageX-a.offset().left;h=l.find("tbody > tr:visible:first > td:eq("+d+")").outerWidth();g=l.find("tbody > tr:visible:first > td:eq("+(d+1)+")").outerWidth();f=a.outerWidth();j=f-h-g;if(i<((2*h-j)/2)){c.infix="-1-";c.colspan=2;c.offset=0;c.sort_order=this.getSortOrder(a,c.infix);c.sort_direction=e(this,a,c.infix)}else{if(i>((2*h+j)/2)){c.infix="-2-";c.colspan=2;c.offset=1;c.sort_order=this.getSortOrder(a,c.infix);c.sort_direction=e(this,a,c.infix)}}}else{if(a.hasClass("sort-1")){c.infix="-1-";c.colspan=2;c.offset=0;c.sort_order=this.getSortOrder(a,c.infix);c.sort_direction=e(this,a,c.infix)}else{if(a.hasClass("sort-2")){c.infix="-2-";c.colspan=2;c.offset=1;c.sort_order=this.getSortOrder(a,c.infix);c.sort_direction=e(this,a,c.infix)}}}}}return c};SET_OverviewTable.prototype.cleanSortClasses=function(){var b=this;var a;for(a=0;a<b.myColumnHandlers.length;a=a+1){b.$myTable.children("thead").find("th").removeClass("sort-order-"+a)}b.$myTable.children("thead").find("th").removeClass("sorted-asc").removeClass("sorted-desc");b.$myTable.children("thead").find("th > span").removeClass("sorted-asc").removeClass("sorted-desc")};SET_OverviewTable.prototype.addSortInfo=function(d){var a;var b;var c;for(c=0;c<d.length;c=c+1){a=c+1;b=this.$myHeaders.eq(this.myHeaderIndexLook[d[c].column_index]);b.addClass("sort-order"+d[c].infix+a);b.addClass("sorted"+d[c].infix+d[c].sort_direction)}};SET_OverviewTable.prototype.applyZebraTheme=function(){var a=false;this.$myTable.children("tbody").children("tr").each(function(){var b=$(this);if(this.style.display!=="none"){if(a===true){b.removeClass("odd").addClass("even")}else{b.removeClass("even").addClass("odd")}a=!a}})};SET_OverviewTable.prototype.sortSingleColumn=function(b,e){var h;var g;var f;var d;var c;if(!b.infix){return}if(b.sort_direction==="asc"){f=1}else{f=-1}h=b.column_index+b.offset;g=this.$myTable.children("tbody").children("tr").get();for(d=0;d<g.length;d=d+1){var a=g[d].cells[h];g[d].sortKey=e.getSortKey(a)}SET_OverviewTable.benchmark("Extracting sort keys");g.sort(function(j,i){return f*e.compareSortKeys(j.sortKey,i.sortKey)});SET_OverviewTable.benchmark("Sorted by one column");c=this.$myTable.children("tbody")[0];for(d=0;d<g.length;d=d+1){g[d].sortKey=null;c.appendChild(g[d])}SET_OverviewTable.benchmark("Reappend the sorted rows")};SET_OverviewTable.prototype.sortMultiColumn=function(sorting_info){var dir;var cmp;var i,j;var sort_func="";var rows;var cell;var column_handler;var tbody;var that=this;var multi_cmp=null;rows=this.$myTable.children("tbody").children("tr").get();for(i=0;i<rows.length;i=i+1){rows[i].sortKey=[];for(j=0;j<sorting_info.length;j=j+1){column_handler=this.myColumnHandlers[sorting_info[j].column_index];cell=rows[i].cells[sorting_info[j].column_index];rows[i].sortKey[j]=column_handler.getSortKey(cell)}}SET_OverviewTable.benchmark("Extracting sort keys");sort_func+="multi_cmp = function (row1, row2) {\n";sort_func+="  var cmp;\n";for(i=0;i<sorting_info.length;i=i+1){dir=1;if(sorting_info[i].sort_direction==="desc"){dir=-1}sort_func+="  cmp = that.myColumnHandlers["+sorting_info[i].column_index+"].compareSortKeys(row1.sortKey["+i+"], row2.sortKey["+i+"]);\n";sort_func+="  if (cmp !== 0) {\n";sort_func+="    return cmp * "+dir+";\n";sort_func+="  }\n"}sort_func+="  return 0;\n";sort_func+="};\n";eval(sort_func);SET_OverviewTable.benchmark("Prepare multi sort function");rows.sort(multi_cmp);SET_OverviewTable.benchmark("Sorted by "+sorting_info.length+" columns");tbody=this.$myTable.children("tbody")[0];for(i=0;i<rows.length;i=i+1){rows[i].sortKey=null;tbody.appendChild(rows[i])}SET_OverviewTable.benchmark("Reappend the sorted rows")};SET_OverviewTable.prototype.filter=function(){var d=[];var a;var c=this;var b;if(SET_OverviewTable.myDebug){SET_OverviewTable.log("Apply filters:");SET_OverviewTable.myTimeStart=new Date();SET_OverviewTable.myTimeIntermidiate=new Date()}b=0;for(a=0;a<this.myColumnHandlers.length;a=a+1){if(this.myColumnHandlers[a]&&this.myColumnHandlers[a].startFilter()){d[a]=this.myColumnHandlers[a];b+=1}else{d[a]=null}}SET_OverviewTable.benchmark("Create a list of effective filters");if(b===0){if(SET_OverviewTable.myDebug){SET_OverviewTable.log("Filters list is empty.")}this.$myTable.children("tbody").children("tr").show();SET_OverviewTable.benchmark("Show all rows")}else{this.$myTable.children("tbody").children("tr").hide();SET_OverviewTable.benchmark("Hide all rows");this.$myTable.children("tbody").children("tr").each(function(){var f;var e=1;var g=$(this);for(f=0;f<d.length;f+=1){if(d[f]&&!d[f].simpleFilter(this.cells[f])){e=0;break}}if(e===1){g.show()}});SET_OverviewTable.benchmark("Apply all effective filters")}c.applyZebraTheme();SET_OverviewTable.benchmark("Apply zebra theme");if(SET_OverviewTable.myDebug){SET_OverviewTable.log("Finish, total time: "+(new Date().getTime()-SET_OverviewTable.myTimeIntermidiate.getTime())+" ms")}};SET_OverviewTable.registerColumnTypeHandler=function(b,a){SET_OverviewTable.ourColumnTypeHandlers[b]=a};SET_OverviewTable.filterTrigger=function(a){a.data.table.filter(a,a.data.element)};SET_OverviewTable.benchmark=function(a){if(this.myDebug===true){SET_OverviewTable.log(a+" "+(new Date().getTime()-SET_OverviewTable.myTimeStart.getTime())+" ms");SET_OverviewTable.myTimeStart=new Date()}};SET_OverviewTable.log=function(a){if(console!=="undefined"&&console.debug!=="undefined"){console.log(a)}else{alert(a)}};SET_OverviewTable.ourTables=[];SET_OverviewTable.ourColumnTypeHandlers={};SET_OverviewTable.registerTable=function(a){$(a).each(function(){var b=$(this);if(b.is("table")){SET_OverviewTable.ourTables[SET_OverviewTable.ourTables.length]=new SET_OverviewTable(b)}else{b.find("table").each(function(){SET_OverviewTable.ourTables[SET_OverviewTable.ourTables.length]=new SET_OverviewTable($(this))})}})};function SET_NoneColumnTypeHandler(){}SET_NoneColumnTypeHandler.prototype.startFilter=function(){return false};SET_NoneColumnTypeHandler.prototype.initSort=function(a,b){return false};SET_NoneColumnTypeHandler.prototype.initFilter=function(a,c){var b;b=a.$myFilters.eq(c);b.html("");b.width(b.css("width"))};SET_OverviewTable.registerColumnTypeHandler("none",SET_NoneColumnTypeHandler);function SET_TextColumnTypeHandler(){this.$myInput=null;this.myFilterValue=null}SET_TextColumnTypeHandler.prototype.startFilter=function(){this.myFilterValue=set_to_lower_case_no_accents(this.$myInput.val());return(this.myFilterValue!=="")};SET_TextColumnTypeHandler.prototype.simpleFilter=function(b){var a;a=this.extractForFilter(b);return(a.indexOf(this.myFilterValue)!==-1)};SET_TextColumnTypeHandler.prototype.initSort=function(a,d){var c=this;var b;b=a.$myHeaders.eq(a.myHeaderIndexLook[d]);if(b.hasClass("sort")||b.hasClass("sort-1")||b.hasClass("sort-2")){b.click(function(e){a.sort(e,b,c,d)})}};SET_TextColumnTypeHandler.prototype.initFilter=function(a,c){var b=this;this.$myInput=a.$myFilters.eq(c).find("input");this.$myInput.val("");this.$myInput.keyup(function(d){if(d.keyCode===27){b.$myInput.val("")}});this.$myInput.keyup({table:a,element:this.$myInput},SET_OverviewTable.filterTrigger);this.$myInput.width(this.$myInput.closest("td").width()-parseInt(this.$myInput.css("margin-left"),10)-parseInt(this.$myInput.css("border-left-width"),10)-parseInt(this.$myInput.css("border-right-width"),10)-parseInt(this.$myInput.css("margin-right"),10));this.$myInput.css("visibility","visible")};SET_TextColumnTypeHandler.prototype.extractForFilter=function(a){return set_to_lower_case_no_accents($(a).text())};SET_TextColumnTypeHandler.prototype.getSortKey=function(a){return set_to_lower_case_no_accents($(a).text())};SET_TextColumnTypeHandler.prototype.compareSortKeys=function(b,a){if(b<a){return -1}if(b>a){return 1}return 0};SET_OverviewTable.registerColumnTypeHandler("text",SET_TextColumnTypeHandler);SET_OverviewTable.registerColumnTypeHandler("email",SET_TextColumnTypeHandler);function SET_DateTimeColumnTypeHandler(){}SET_DateTimeColumnTypeHandler.prototype=Object.create(SET_TextColumnTypeHandler.prototype);SET_DateTimeColumnTypeHandler.constructor=SET_DateTimeColumnTypeHandler;SET_DateTimeColumnTypeHandler.prototype.getSortKey=function(e){var c;var d;var a="";var b;c=$(e).attr("class");if(c){d=c.split(/\s+/);for(b=0;b<d.length;b=b+1){if(d[b].substr(0,5)==="data-"){a=decodeURIComponent(d[b].substr(5).replace(/\+/g,"%20"));break}}}return a};SET_OverviewTable.registerColumnTypeHandler("date",SET_DateTimeColumnTypeHandler);SET_OverviewTable.registerColumnTypeHandler("date-time",SET_DateTimeColumnTypeHandler);function SET_NumericColumnTypeHandler(){}SET_NumericColumnTypeHandler.prototype=Object.create(SET_TextColumnTypeHandler.prototype);SET_NumericColumnTypeHandler.constructor=SET_NumericColumnTypeHandler;SET_NumericColumnTypeHandler.prototype.getSortKey=function(c){var a;var b;a=/[\d\.,\-\+]*/;b=a.exec($(c).text());return parseInt(b[0].replace(",","."),10)};SET_NumericColumnTypeHandler.prototype.compareSortKeys=function(b,a){if(b===a){return 0}if(b===""&&!isNaN(a)){return -1}if(a===""&&!isNaN(b)){return 1}return b-a};SET_OverviewTable.registerColumnTypeHandler("numeric",SET_NumericColumnTypeHandler);