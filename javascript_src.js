
var country_id = "person_address_country";
var country_id_list = country_id + "_list";
var default_country = "1 Guatemala";

var province_id = "person_address_state_province";
var province_id_list = province_id + "_list";

var village_id = "person_address_city_village";
var village_id_list = village_id + "_list";

var district_id = "person_address_county_district";
var district_id_list = district_id + "_list";

var subdistrict_id = "person_address_address1";
var subdistrict_id_list = subdistrict_id + "_list";

var community_id = "person_address_address2";
var community_id_list = community_id + "_list";

var convergence_id = "person_address_neighborhood_cell";
var convergence_id_list = convergence_id + "_list";
 
var location_id = "location_id";
var gender_id = "gender";
var birth_date_id = "birth_date";
var given_name_id = "given_name";
var middle_name_id = "middle_name";
var family_name_id = "family_name";
var family_name2_id = "family_name2";
var personal_code_id = "cribado";

var patient_id_id = "identifier"; 
var patient_id_type_id = "patient_identifier_type_id";
var default_patient_id_type = "DPI";
 
var secundary_patient_id_type = "cribado";
var use_personal_code_as_identifier = false;

var code_delimiter = " ";

var options_init = $j("#" + location_id).find("option").clone();

var country = $j("#" + country_id).val();
var province = $j("#" + province_id).val();
var village = $j("#" + village_id).val();
var district = $j("#" + district_id).val();
var subdistrict = $j("#" + subdistrict_id).val();
var community = $j("#" + community_id).val();
var convergence = $j("#" + convergence_id).val();


/* Initialize dropdown boxes */
$j(function () {

	/* Warning message if using windows */
	var ua = window.navigator.userAgent;
	if(ua.indexOf("MSIE") > -1 || !!ua.match(/Trident.*rv\:11\./)){
		alert("Estás utilizando el navegador web Internet Explorer.\nAlgunas de las funciones de esta página no funcionan correctamente con este navegador.\nAconsejamos el uso de Mozilla Firefox o Google Chrome.");
	}

	createList(country_id, country_id_list, 8);
	createList(province_id, province_id_list, 9);
	createList(village_id, village_id_list, 10);
	createList(district_id, district_id_list, 11);
	createList(subdistrict_id, subdistrict_id_list, 12);
	createList(community_id, community_id_list, 13);

	var country_to_select;
	if(country != null && country.length > 0){
		country_to_select = country;
	}
	else {
		country_to_select = default_country;
	}

	options_init.each(function () {
		var code = $j(this).text().split(code_delimiter)[0];
		if(code.length == 1){
			var code_index = $j(this).text().indexOf(code_delimiter);
			$j("#" + country_id_list).append("<option value='" + $j(this).text() + "'>" + $j(this).text().substring(code_index + 1) + "</option>");
			if(code == country_to_select.split(code_delimiter)[0]){
				$j("#" + country_id_list).val($j(this).text());
			}
		}
	});

	var selected_opt = $j("#" + country_id_list + " option:selected");
	if(selected_opt.length == 1){
		update_province(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + country_id).val(selected_opt[0].value);
	}
	else {
		update_province("");
	}

	var current_id_type = $j("#" + patient_id_type_id + " option:selected");
	if(current_id_type.length == 1 && current_id_type.first().text().length > 0){
		check_if_secundary_patient_id_type(current_id_type);
	}
	else{
		$j("#" + patient_id_type_id).find("option").each(function () {
			if($j(this).text().toLowerCase().indexOf(default_patient_id_type.toLowerCase()) > -1){
				$j("#" + patient_id_type_id).val($j(this).val());
				return;
			}
		});
	}
	
});

$j("#" + country_id_list).change(function () {
	var selected_opt = $j("#" + country_id_list + " option:selected");
	if(selected_opt.length == 1){
		update_province(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + country_id).val(selected_opt[0].value);
		update_personal_code();
	}
});

function createList(element_id, element_id_list, tab_index){
	$j("#"+ element_id).before('<select class="gwt-ListBox" tabindex="' + tab_index + '" id="' + element_id_list + '" style="width: 300px; height: 25px; font-size: 16px; font-family: Verdana, \'Lucida Grande\', \'Trebuchet MS\', Arial, sans-serif;"><option value=" "> </option></select>');

	$j("#" + element_id).hide();
}

function populateList(element_id_list, filter_reg, current_value){
	$j("#" + element_id_list).append("<option value></option>");
	
	/* Temp array to sort elements */
	var tempOptions = new Array();
	var index = 0;
	
	options_init.each(function () {
		if(filter_reg.test($j(this).text())){
			var code_index = $j(this).text().indexOf(code_delimiter);
			tempOptions[index] = {"value":$j(this).text(), "text":$j(this).text().substring(code_index + 1)};
			index = index + 1;			
		}
	});
	
	tempOptions = tempOptions.sort(function (a, b) { 
		if (a.text < b.text)
			return -1;
		if (a.text > b.text)
			return 1;
		return 0;
	});
	
	for(i=0; i<tempOptions.length; i++){
		$j("#" + element_id_list).append("<option value='" + tempOptions[i].value + "'>" + tempOptions[i].text + "</option>");
		
		if(tempOptions[i].value.split(code_delimiter)[0] == current_value.split(code_delimiter)[0]){
			$j("#" + element_id_list).val(tempOptions[i].value);
		}
	}
}

function createFilterRegExp(filter_code, total_length){
	
	var digit_number = total_length - filter_code.length;
	
	if( digit_number >= 0 ){
		return new RegExp("^" + filter_code + "[0-9]{" + digit_number + "} ");
	} else {
		return new RegExp("^[0-9]{" + total_length + "} ");
	}
	
}

function update_province(filter_code){
    
	$j("#" + province_id_list).find("option").remove();
		
	var filter_reg = createFilterRegExp(filter_code, 2);
	
	populateList(province_id_list, filter_reg, province);
	process_province(filter_code);	
 }

$j("#" + province_id_list).change(function () {
	process_province("");
});

function process_province(filter_code){
	var selected_opt = $j("#" + province_id_list + " option:selected");
	if(selected_opt.length == 1){
		update_village(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + province_id).val(selected_opt[0].value);
	}
	else {
		update_village(filter_code);
	}
	update_personal_code();
}

function update_village(filter_code){
	
	$j("#" + village_id_list).find("option").remove();
	
	var filter_reg = createFilterRegExp(filter_code, 4);
	
	populateList(village_id_list, filter_reg, village);
	process_village(filter_code);
 }

$j("#" + village_id_list).change(function () {
	process_village("");
});

function process_village(filter_code){
	var selected_opt = $j("#" + village_id_list + " option:selected");
	if(selected_opt.length == 1 && selected_opt[0].value.length > 0){
		update_district(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + village_id).val(selected_opt[0].value);
	}
	else {
		update_district(filter_code);
	}
	update_personal_code();
}

function update_district(filter_code){
	
	$j("#" + district_id_list).find("option").remove();
	
	var filter_reg = createFilterRegExp(filter_code, 5);
	
	populateList(district_id_list, filter_reg, district);
	process_district(filter_code);
}

$j("#" + district_id_list).change(function () {
	process_district("");
});

function process_district(filter_code){
	var selected_opt = $j("#" + district_id_list + " option:selected");
	if(selected_opt.length == 1 && selected_opt[0].value.length > 0){
		update_subdistrict(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + district_id).val(selected_opt[0].value);
	}
	else {
		update_subdistrict(filter_code);
	}
}
	
function update_subdistrict(filter_code){
	
	$j("#" + subdistrict_id_list).find("option").remove();
		
	var filter_reg = createFilterRegExp( filter_code, 6);

	populateList(subdistrict_id_list, filter_reg, subdistrict);
	process_subdistrict(filter_code);
}

$j("#" + subdistrict_id_list).change(function () {
	process_subdistrict("");
});

function process_subdistrict(filter_code){
	var selected_opt = $j("#" + subdistrict_id_list + " option:selected");
	if(selected_opt.length == 1 && selected_opt[0].value.length > 0){
		update_community(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + subdistrict_id).val(selected_opt[0].value);
	}
	else {
		update_community(filter_code);
	}
}

function update_community(filter_code){
	
	$j("#" + community_id_list).find("option").remove();
		
	var filter_reg = createFilterRegExp( filter_code, 8);

	populateList(community_id_list, filter_reg, community);
	process_community();
}

$j("#" + community_id_list).change(function () {
	process_community();
});

function process_community(){
	var selected_opt = $j("#" + community_id_list + " option:selected");
	if(selected_opt.length == 1 && selected_opt[0].value.length > 0){
		$j("#" + community_id).val(selected_opt[0].value);
		select_location(selected_opt[0].value);
	}
}

function select_location(selected_location){
	var value = $j("#" + location_id).find("option").filter(function () {
		return $j(this).text() === selected_location;
	}).first().attr("value");
	
	$j("#" + location_id).val(value);
}

function generate_personal_code(){
	var personal_code = "";
		
	var gender;
	var gender_opts = $j("#" + gender_id + " option:selected");
	if(gender_opts.length == 1 && gender_opts.first().text().length > 0){
		gender = gender_opts[0].value;
	}
	else {
		return "";
	}

	var birth_date = $j("#" + birth_date_id).val();
	if(birth_date.length < 1){
		return "";
	}
	else {
		var tokens = birth_date.split("/");
		var day = tokens[0];
		var month = tokens[1];
		var year = tokens[2].substring(2);
		birth_date = "" + day + month + year;
	}
		
	var country_code = $j("#" + country_id_list).val().split(code_delimiter)[0];
	if(country_code.length != 1){
		return "";
	}
	
	var village_code = $j("#" + village_id_list).val().split(code_delimiter)[0];
	if(village_code.length != 4) {
		return "";
	}
	
	var name_code = "";
	
	if($j("#" + given_name_id).val().length > 1){
		name_code = name_code + $j("#" + given_name_id).val().substring(0,2).toUpperCase();
	}
	else {
		name_code = name_code + "XX";
	}
	
	if($j("#" + family_name_id).val().length > 1){
		name_code = name_code + $j("#" + family_name_id).val().substring(0,2).toUpperCase();
	}
	else {
		return "";
	}
	
	name_code = name_code.replace(/[Á]/g,"A");
	name_code = name_code.replace(/[É]/g,"E");
	name_code = name_code.replace(/[Í]/g,"I");
	name_code = name_code.replace(/[Ó]/g,"O");
	name_code = name_code.replace(/[Ú]/g,"U");
	name_code = name_code.replace(/[Ñ]/g,"N");
	
	personal_code = gender + birth_date + country_code + village_code + name_code;
	return personal_code;  	
}
	
function update_personal_code(){
	var personal_code = generate_personal_code();
	$j("#" + personal_code_id).val(personal_code);
	
	if(use_personal_code_as_identifier){
		$j("#" + patient_id_id).val(personal_code);
	}
}
 

$j("#" + gender_id).change(function () {
	update_personal_code();
});

$j("#" + birth_date_id).change(function () {
	update_personal_code();
});

$j("input#" + given_name_id).change(function () {
	update_personal_code();
});

$j("input#" + family_name_id).change(function () {
	update_personal_code();
});

$j("#" + patient_id_type_id).change(function () {
	
	var selected_opt = $j("#" + patient_id_type_id + " option:selected");
	if(selected_opt.length == 1){
		var old_use_personal_code_as_identifier = use_personal_code_as_identifier;
		check_if_secundary_patient_id_type(selected_opt);
		
		if( use_personal_code_as_identifier ){
			update_personal_code();
		} 
		/* If use_personal_code_as_identifier changes from true to false, clean the value */
		else if( old_use_personal_code_as_identifier && !use_personal_code_as_identifier ){
			$j("#" + patient_id_id).val('');			
		}
	}
});

function check_if_secundary_patient_id_type(selected_opt){
	if (selected_opt.first().text().toLowerCase().indexOf(secundary_patient_id_type.toLowerCase()) > -1){
		use_personal_code_as_identifier = true;
	}
	else {
		use_personal_code_as_identifier = false;
	}
}

