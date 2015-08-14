define("SetBased/OverviewTable",["jquery"],function($){function OverviewTable($table){var that=this;var i;if(OverviewTable.ourDebug){OverviewTable.log("Start create OverviewTable:");OverviewTable.myTimeStart=new Date();OverviewTable.myTimeIntermidiate=new Date()}this.$myFilters=$table.children("thead").children("tr.filter").find("td");this.$myHeaders=$table.children("thead").children("tr.header").find("th");this.myHeaderIndexLookup=[];this.$myTable=$table;$table.children("thead").children("tr.filter").each(function(){$(this).css("display","table-row")});OverviewTable.benchmark("Prepare table and table info");this.$myHeaders.each(function(header_index,th){var j;var span;span=$(th).attr("colspan");if(span){span=parseFloat(span)}else{span=1}for(j=0;j<span;j=j+1){that.myHeaderIndexLookup[that.myHeaderIndexLookup.length]=header_index}});OverviewTable.benchmark("Create lookup table from column_index to header_index");this.myColumnHandlers=[];$table.children("colgroup").children("col").each(function(column_index,col){var attr;var classes;var column_type;that.myColumnHandlers[column_index]=null;attr=$(col).attr("class");if(attr){classes=attr.split(" ");for(i=0;i<classes.length;i=i+1){if(classes[i].substr(0,10)==="data-type-"){column_type=classes[i].substr(10);if(column_type===undefined||!OverviewTable.ourColumnTypeHandlers[column_type]){column_type="none"}break}}}else{column_type="none"}that.myColumnHandlers[column_index]=new OverviewTable.ourColumnTypeHandlers[column_type]();OverviewTable.benchmark('Install column handler with type "'+column_type+'"');that.myColumnHandlers[column_index].initHandler(that,column_index);OverviewTable.benchmark("Initialize column handler");that.myColumnHandlers[column_index].initFilter(that,column_index);OverviewTable.benchmark("Initialize filter");that.myColumnHandlers[column_index].initSort(that,column_index);OverviewTable.benchmark("Initialize sorter")});this.initHook();OverviewTable.benchmark("Execute additional initializations");if(OverviewTable.ourDebug){OverviewTable.log("End of create OverviewTable "+(new Date().getTime()-OverviewTable.myTimeIntermidiate.getTime())+"ms")}}OverviewTable.prototype.initHook=function(){return null};OverviewTable.prototype.filterHook=function(){return null};OverviewTable.ourDebug=false;OverviewTable.ourTables={};OverviewTable.ourColumnTypeHandlers={};OverviewTable.ourCharacterMap={"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ě":"e","ę":"e","ð":"d","ì":"i","í":"i","î":"i","ï":"i","ł":"l","ñ":"n","ń":"n","ň":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ş":"s","š":"s","ý":"y","ÿ":"y","ž":"z","þ":"th","ß":"ss","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ě":"E","Ę":"E","Ð":"D","Ì":"I","Í":"I","Î":"I","Ï":"I","Ł":"L","Ñ":"N","Ń":"N","Ň":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ş":"S","Š":"S","Ý":"Y","Ÿ":"Y","Ž":"Z","Þ":"TH"};OverviewTable.toLowerCaseNoAccents=function(text){var c;var text_new="";var i;if(text===null||text===undefined){return text}for(i=0;i<text.length;i=i+1){c=text.substr(i,1);if(OverviewTable.ourCharacterMap[c]){text_new+=OverviewTable.ourCharacterMap[c]}else{text_new+=c}}return text_new.toLowerCase()};OverviewTable.enableDebug=function(){OverviewTable.ourDebug=true};OverviewTable.prototype.mergeInfo=function(sort_info,column_sort_info){if(sort_info.length===0){column_sort_info.sort_order=1;sort_info[0]=column_sort_info}else{if(column_sort_info.sort_order!==-1&&sort_info[column_sort_info.sort_order-1]){sort_info[column_sort_info.sort_order-1].sort_direction=column_sort_info.sort_direction}else{column_sort_info.sort_order=sort_info.length+1;sort_info[sort_info.length]=column_sort_info}}return sort_info};OverviewTable.prototype.getSortOrder=function($header,infix){var attr;var classes;var sort_order_class;var i;var order=-1;attr=$header.attr("class");if(attr){classes=attr.split(" ");for(i=0;i<classes.length;i=i+1){sort_order_class="sort-order"+infix;if(classes[i].substr(0,sort_order_class.length)===sort_order_class){order=parseInt(classes[i].substr(sort_order_class.length),10)}}}return order};OverviewTable.prototype.getSortDirection=function($header,infix){if($header.hasClass("sorted"+infix+"desc")){return"desc"}if($header.hasClass("sorted"+infix+"asc")){return"asc"}return""};OverviewTable.prototype.sort=function(event,$header,column,column_index){var sort_info;var sort_column_info;if(OverviewTable.ourDebug){OverviewTable.log("Start sort:");OverviewTable.myTimeStart=new Date();OverviewTable.myTimeIntermidiate=new Date()}sort_info=this.getSortInfo();OverviewTable.benchmark("Get all sort info");sort_column_info=this.getColumnSortInfo(event,$header,column_index);OverviewTable.benchmark("Get info about current column");this.cleanSortClasses();OverviewTable.benchmark("Reset column headers");if(!event.ctrlKey){sort_info=this.mergeInfo([],sort_column_info);OverviewTable.benchmark("Merge info");this.sortSingleColumn(sort_info[0],column)}else{sort_info=this.mergeInfo(sort_info,sort_column_info);OverviewTable.benchmark("Merge info");if(sort_info.length===1){this.sortSingleColumn(sort_info[0],column)}else{this.sortMultiColumn(sort_info)}}this.addSortInfo(sort_info);OverviewTable.benchmark("Added info to table head");this.applyZebraTheme();OverviewTable.benchmark("Apply zebra theme");if(OverviewTable.ourDebug){OverviewTable.log("Finish sort "+(new Date().getTime()-OverviewTable.myTimeIntermidiate.getTime())+"ms")}};OverviewTable.prototype.getSortInfo=function(){var columns_info=[];var span;var sort_order;var sort_direction;var that=this;var colspan;var dual;this.$myTable.children("colgroup").children("col").each(function(column_index){var $th=that.$myHeaders.eq(that.myHeaderIndexLookup[column_index]);span=$th.attr("colspan");if(!span||span==="1"){sort_order=that.getSortOrder($th,"-");if(sort_order!==-1){columns_info[sort_order-1]={column_index:column_index,sort_order:sort_order,sort_direction:that.getSortDirection($th,"-"),infix:"-",colspan:1,offset:0}}}else{if(span==="2"){if(!dual||dual==="right"){dual="left"}else{dual="right"}if(dual==="left"&&$th.hasClass("sort-1")){sort_order=that.getSortOrder($th,"-1-");if(sort_order!==-1){columns_info[sort_order-1]={column_index:column_index,sort_order:sort_order,sort_direction:that.getSortDirection($th,"-1-"),infix:"-1-",colspan:2,offset:0}}}if(dual==="right"&&$th.hasClass("sort-2")){sort_order=that.getSortOrder($th,"-2-");if(sort_order!==-1){columns_info[sort_order-1]={column_index:column_index,sort_order:that.getSortDirection($th,"-2-"),sort_direction:sort_direction,infix:"-2-",colspan:2,offset:1}}}}}});return columns_info};OverviewTable.prototype.getColumnSortInfo=function(event,$header,column_index){var span;var column_info={};var width_col1;var width_col2;var width_header;var diff;var x;function getFlipSortDirection($table,$header,infix){var sort_direction;sort_direction=$table.getSortDirection($header,infix);if(sort_direction==="desc"||sort_direction===""){return"asc"}return"desc"}column_info.column_index=column_index;span=$header.attr("colspan");if(!span||span==="1"){column_info.infix="-";column_info.colspan=1;column_info.offset=0;column_info.sort_order=this.getSortOrder($header,column_info.infix);column_info.sort_direction=getFlipSortDirection(this,$header,column_info.infix)}else{if(span==="2"){if($header.hasClass("sort-1")&&$header.hasClass("sort-2")){x=event.pageX-$header.offset().left;if(this.myHeaderIndexLookup[column_index]===this.myHeaderIndexLookup[column_index-1]){width_col1=this.$myTable.children("tbody").find("tr:visible:first > td:eq("+(column_index-1)+")").outerWidth();width_col2=this.$myTable.children("tbody").find("tr:visible:first > td:eq("+column_index+")").outerWidth()}if(this.myHeaderIndexLookup[column_index]===this.myHeaderIndexLookup[column_index+1]){width_col1=this.$myTable.children("tbody").find("tr:visible:first > td:eq("+column_index+")").outerWidth();width_col2=this.$myTable.children("tbody").find("tr:visible:first > td:eq("+(column_index+1)+")").outerWidth()}width_header=$header.outerWidth();diff=width_header-width_col1-width_col2;if(x<(width_col1-diff/2)){column_info.infix="-1-";column_info.colspan=2;column_info.offset=0;column_info.sort_order=this.getSortOrder($header,column_info.infix);column_info.sort_direction=getFlipSortDirection(this,$header,column_info.infix)}else{if(x>(width_col1+diff/2)){column_info.infix="-2-";column_info.colspan=2;column_info.offset=1;column_info.sort_order=this.getSortOrder($header,column_info.infix);column_info.sort_direction=getFlipSortDirection(this,$header,column_info.infix)}}}else{if($header.hasClass("sort-1")){column_info.infix="-1-";column_info.colspan=2;column_info.offset=0;column_info.sort_order=this.getSortOrder($header,column_info.infix);column_info.sort_direction=getFlipSortDirection(this,$header,column_info.infix)}else{if($header.hasClass("sort-2")){column_info.infix="-2-";column_info.colspan=2;column_info.offset=1;column_info.sort_order=this.getSortOrder($header,column_info.infix);column_info.sort_direction=getFlipSortDirection(this,$header,column_info.infix)}}}}}return column_info};OverviewTable.prototype.cleanSortClasses=function(){var that=this;var i;for(i=0;i<that.myColumnHandlers.length;i=i+1){that.$myTable.children("thead").find("th").removeClass("sort-order-"+i);that.$myTable.children("thead").find("th").removeClass("sort-order-1-"+i);that.$myTable.children("thead").find("th").removeClass("sort-order-2-"+i)}that.$myTable.children("thead").find("th").removeClass("sorted-asc").removeClass("sorted-desc");that.$myTable.children("thead").find("th").removeClass("sorted-1-asc").removeClass("sorted-1-desc");that.$myTable.children("thead").find("th").removeClass("sorted-2-asc").removeClass("sorted-2-desc")};OverviewTable.prototype.addSortInfo=function(sort_info){var order;var $header;var i;for(i=0;i<sort_info.length;i=i+1){order=i+1;$header=this.$myHeaders.eq(this.myHeaderIndexLookup[sort_info[i].column_index]);$header.addClass("sort-order"+sort_info[i].infix+order);$header.addClass("sorted"+sort_info[i].infix+sort_info[i].sort_direction)}};OverviewTable.prototype.applyZebraTheme=function(){var even=true;this.$myTable.children("tbody").children("tr").each(function(){var $this=$(this);if(this.style.display!=="none"){if(even===true){$this.removeClass("odd").addClass("even")}else{$this.removeClass("even").addClass("odd")}even=!even}})};OverviewTable.prototype.sortSingleColumn=function(sorting_info,column){var rows;var sort_direction;var i;var tbody;var cell;if(!sorting_info.infix){return}if(sorting_info.sort_direction==="asc"){sort_direction=1}else{sort_direction=-1}rows=this.$myTable.children("tbody").children("tr").get();for(i=0;i<rows.length;i=i+1){cell=rows[i].cells[sorting_info.column_index];rows[i].sortKey=column.getSortKey(cell)}OverviewTable.benchmark("Extracting sort keys");rows.sort(function(row1,row2){return sort_direction*column.compareSortKeys(row1.sortKey,row2.sortKey)});OverviewTable.benchmark("Sorted by one column");tbody=this.$myTable.children("tbody")[0];for(i=0;i<rows.length;i=i+1){rows[i].sortKey=null;tbody.appendChild(rows[i])}OverviewTable.benchmark("Reappend the sorted rows")};OverviewTable.prototype.sortMultiColumn=function(sorting_info){var dir;var cmp=null;var i,j;var sort_func="";var rows;var cell;var column_handler;var tbody;var this1=this;var multi_cmp=null;rows=this.$myTable.children("tbody").children("tr").get();for(i=0;i<rows.length;i=i+1){rows[i].sortKey=[];for(j=0;j<sorting_info.length;j=j+1){column_handler=this.myColumnHandlers[sorting_info[j].column_index];cell=rows[i].cells[sorting_info[j].column_index];rows[i].sortKey[j]=column_handler.getSortKey(cell)}}OverviewTable.benchmark("Extracting sort keys");sort_func+="multi_cmp = function (row1, row2) {\n";sort_func+="  var cmp;\n";for(i=0;i<sorting_info.length;i=i+1){dir=1;if(sorting_info[i].sort_direction==="desc"){dir=-1}sort_func+="  cmp = this1.myColumnHandlers["+sorting_info[i].column_index+"].compareSortKeys(row1.sortKey["+i+"], row2.sortKey["+i+"]);\n";sort_func+="  if (cmp !== 0) {\n";sort_func+="    return cmp * "+dir+";\n";sort_func+="  }\n"}sort_func+="  return 0;\n";sort_func+="};\n";eval(sort_func);OverviewTable.benchmark("Prepare multi sort function");rows.sort(multi_cmp);OverviewTable.benchmark("Sorted by "+sorting_info.length+" columns");tbody=this.$myTable.children("tbody")[0];for(i=0;i<rows.length;i=i+1){rows[i].sortKey=null;tbody.appendChild(rows[i])}OverviewTable.benchmark("Reappend the sorted rows")};OverviewTable.prototype.filter=function(){var filters=[];var i;var that=this;var count;if(OverviewTable.ourDebug){OverviewTable.log("Apply filters:");OverviewTable.myTimeStart=new Date();OverviewTable.myTimeIntermidiate=new Date()}count=0;for(i=0;i<this.myColumnHandlers.length;i=i+1){if(this.myColumnHandlers[i]&&this.myColumnHandlers[i].startFilter()){filters[i]=this.myColumnHandlers[i];count+=1}else{filters[i]=null}}OverviewTable.benchmark("Create a list of effective filters");if(count===0){if(OverviewTable.ourDebug){OverviewTable.log("Filters list is empty.")}this.$myTable.children("tbody").children("tr").show();OverviewTable.benchmark("Show all rows")}else{this.$myTable.children("tbody").children("tr").hide();OverviewTable.benchmark("Hide all rows");this.$myTable.children("tbody").children("tr").each(function(){var j;var show=1;var $this=$(this);for(j=0;j<filters.length;j+=1){if(filters[j]&&!filters[j].simpleFilter(this.cells[j])){show=0;break}}if(show===1){$this.show()}});OverviewTable.benchmark("Apply all effective filters")}that.applyZebraTheme();OverviewTable.benchmark("Apply zebra theme");that.filterHook();OverviewTable.benchmark("Execute additional action after filtering");if(OverviewTable.ourDebug){OverviewTable.log("Finish, total time: "+(new Date().getTime()-OverviewTable.myTimeIntermidiate.getTime())+" ms")}};OverviewTable.registerColumnTypeHandler=function(column_type,handler){OverviewTable.ourColumnTypeHandlers[column_type]=handler};OverviewTable.filterTrigger=function(event){event.data.table.filter(event,event.data.element)};OverviewTable.benchmark=function(message){if(OverviewTable.ourDebug===true){OverviewTable.log(message+" "+(new Date().getTime()-OverviewTable.myTimeStart.getTime())+" ms");OverviewTable.myTimeStart=new Date()}};OverviewTable.log=function(s){if(console!=="undefined"&&console.debug!=="undefined"){console.log(s)}else{alert(s)}};OverviewTable.registerTable=function(selector,className){if(className===undefined){className="SetBased/OverviewTable"}$(selector).each(function(){var $this1=$(this);if($this1.is("table")){if(!$this1.hasClass("registered")){require([className],function(Constructor){OverviewTable.ourTables[OverviewTable.ourTables.length]=new Constructor($this1)});$this1.addClass("registered")}}else{$this1.find("table").first().each(function(){var $this2=$(this);if(!$this2.hasClass("registered")){require([className],function(Constructor){OverviewTable.ourTables[OverviewTable.ourTables.length]=new Constructor($this2)});$this2.addClass("registered")}})}})};return OverviewTable});require(["SetBased/OverviewTable/ColumnTypeHandler/DateTime"]);require(["SetBased/OverviewTable/ColumnTypeHandler/Ipv4"]);require(["SetBased/OverviewTable/ColumnTypeHandler/None"]);require(["SetBased/OverviewTable/ColumnTypeHandler/Numeric"]);require(["SetBased/OverviewTable/ColumnTypeHandler/Text"]);require(["SetBased/OverviewTable/ColumnTypeHandler/Uuid"]);define("SetBased/OverviewTable/ColumnTypeHandler",[],function(){function a(){return this}a.prototype.startFilter=function(){return false};a.prototype.initHandler=function(){return null};a.prototype.initSort=function(c,d){var g=this;var b;var i;var e;var h;var f;var j;b=c.$myHeaders.eq(c.myHeaderIndexLookup[d]);if(b.hasClass("sort")){b.click(function(k){c.sort(k,b,g,d)})}else{if(b.hasClass("sort-1")||b.hasClass("sort-2")){b.click(function(k){if(b.hasClass("sort-1")&&b.hasClass("sort-2")){i=k.pageX-b.offset().left;if(c.myHeaderIndexLookup[d]===c.myHeaderIndexLookup[d-1]){h=c.$myTable.children("tbody").children("tr:visible:first").find("td:eq("+(d-1)+")").outerWidth();f=c.$myTable.children("tbody").children("tr:visible:first").find("td:eq("+d+")").outerWidth()}if(c.myHeaderIndexLookup[d]===c.myHeaderIndexLookup[d+1]){h=c.$myTable.children("tbody").children("tr:visible:first").find("td:eq("+d+")").outerWidth();f=c.$myTable.children("tbody").children("tr:visible:first").find("td:eq("+(d+1)+")").outerWidth()}e=b.outerWidth();j=e-h-f;if(i>(h-j/2)){if(c.myHeaderIndexLookup[d]===c.myHeaderIndexLookup[d-1]){c.sort(k,b,g,d)}}else{if(i<(h+j/2)){if(c.myHeaderIndexLookup[d]===c.myHeaderIndexLookup[d+1]){c.sort(k,b,g,d)}}}}else{if(b.hasClass("sort-1")){c.sort(k,b,g,d)}else{if(b.hasClass("sort-2")){c.sort(k,b,g,d)}}}})}}};return a});define("SetBased/OverviewTable/ColumnTypeHandler/Uuid",["SetBased/OverviewTable","SetBased/OverviewTable/ColumnTypeHandler/Text"],function(a,b){a.registerColumnTypeHandler("uuid",b);return null});define("SetBased/OverviewTable/ColumnTypeHandler/None",["SetBased/OverviewTable","SetBased/OverviewTable/ColumnTypeHandler"],function(a,c){function b(){c.call(this)}b.prototype=Object.create(c.prototype);b.constructor=b;b.prototype.initSort=function(d,e){return null};b.prototype.initFilter=function(){return null};a.registerColumnTypeHandler("none",b);return b});define("SetBased/OverviewTable/ColumnTypeHandler/Numeric",["jquery","SetBased/OverviewTable","SetBased/OverviewTable/ColumnTypeHandler/Text"],function(d,b,c){function a(){c.call(this)}a.prototype=Object.create(c.prototype);a.constructor=a;a.prototype.getSortKey=function(g){var e;var f;e=/[\d\.,\-\+]*/;f=e.exec(d(g).text());return parseInt(f[0].replace(".","").replace(",","."),10)};a.prototype.compareSortKeys=function(f,e){if(f===e){return 0}if(f===""&&!isNaN(e)){return -1}if(e===""&&!isNaN(f)){return 1}return f-e};b.registerColumnTypeHandler("numeric",a);return a});define("SetBased/OverviewTable/ColumnTypeHandler/Ipv4",["SetBased/OverviewTable","SetBased/OverviewTable/ColumnTypeHandler/Text"],function(a,b){a.registerColumnTypeHandler("ipv4",b);return null});define("SetBased/OverviewTable/ColumnTypeHandler/Text",["jquery","SetBased/OverviewTable","SetBased/OverviewTable/ColumnTypeHandler"],function(d,a,b){function c(){b.call(this);this.$myInput=null;this.myFilterValue=null}c.prototype=Object.create(b.prototype);c.constructor=c;c.prototype.startFilter=function(){this.myFilterValue=a.toLowerCaseNoAccents(this.$myInput.val());return(this.myFilterValue!==undefined&&this.myFilterValue!=="")};c.prototype.simpleFilter=function(f){var e;e=this.extractForFilter(f);return(e.indexOf(this.myFilterValue)!==-1)};c.prototype.initFilter=function(e,g){var f=this;this.$myInput=e.$myFilters.eq(g).find("input");this.$myInput.val("");this.$myInput.keyup(function(h){if(h.keyCode===27){f.$myInput.val("")}});this.$myInput.keyup({table:e,element:this.$myInput},a.filterTrigger);this.$myInput.width(this.$myInput.width()+(this.$myInput.closest("td").innerWidth()-this.$myInput.outerWidth(true)))};c.prototype.extractForFilter=function(e){return a.toLowerCaseNoAccents(d(e).text())};c.prototype.getSortKey=function(e){return a.toLowerCaseNoAccents(d(e).text())};c.prototype.compareSortKeys=function(f,e){if(f<e){return -1}if(f>e){return 1}return 0};a.registerColumnTypeHandler("text",c);a.registerColumnTypeHandler("email",c);return c});define("SetBased/OverviewTable/ColumnTypeHandler/DateTime",["jquery","SetBased/OverviewTable","SetBased/OverviewTable/ColumnTypeHandler/Text"],function(c,a,b){function d(){b.call(this)}d.prototype=Object.create(b.prototype);d.constructor=d;d.prototype.getSortKey=function(j){var g;var h;var e="";var f;g=c(j).attr("class");if(g){h=g.split(/\s+/);for(f=0;f<h.length;f=f+1){if(h[f].substr(0,5)==="data-"){e=decodeURIComponent(h[f].substr(5).replace(/\+/g,"%20"));break}}}return e};a.registerColumnTypeHandler("date",d);a.registerColumnTypeHandler("datetime",d);return d});