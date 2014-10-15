
var country_id = "person_address_country";
var country_id_list = country_id + "_list";
var default_country = "1 Guatemala";

var district_id = "person_address_state_province";
var district_id_list = district_id + "_list";

var village_id = "person_address_city_village";
var village_id_list = village_id + "_list";

var subvillage_id = "person_address_address1"; // It corresponds to jurisdiccion
var subvillage_id_list = subvillage_id + "_list";
 
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
 
// If this identifier type is selected, personal code is used as identifier
var secundary_patient_id_type = "cribado";
var use_personal_code_as_identifier = false;

var code_delimiter = " ";

var options_init = $j("#" + location_id).find("option").clone();

var country = $j("#" + country_id).val();
var district = $j("#" + district_id).val();
var village = $j("#" + village_id).val();
var subvillage = $j("#" + subvillage_id).val();


// Init dropdown lists and other fields
$j(function () {

	// Check if using Internet Explorer. If so, show a warning message
	var ua = window.navigator.userAgent;
	if(ua.indexOf("MSIE") > -1 || !!ua.match(/Trident.*rv\:11\./)){
		alert("Estás utilizando el navegador web Internet Explorer.\nAlgunas de las funciones de esta página no funcionan correctamente con este navegador.\nAconsejamos el uso de Mozilla Firefox o Google Chrome.");
	}

	// Create the list associated to every field
	createList(country_id, country_id_list, 8);
	createList(district_id, district_id_list, 9);
	createList(village_id, village_id_list, 10);
	createList(subvillage_id, subvillage_id_list, 11);

	var country_to_select;
	if(country != null && country.length > 0){
		country_to_select = country;
	}
	else {
		country_to_select = default_country;
	}

	// Create a dropdown with all locations that meet the requirements to be a country
	options_init.each(function () {
		var code = $j(this).text().split(" ")[0];
		if(code.length == 1){
			$j("#" + country_id_list).append("<option value='" + $j(this).text() + "'>" + $j(this).text() + "</option>");
			if($j(this).text() == country_to_select){
				$j("#" + country_id_list).val($j(this).text());
			}
		}
	});

	var selected_opt = $j("#" + country_id_list + " option:selected");
	if(selected_opt.length == 1){
		update_district(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + country_id).val(selected_opt[0].value);
	}
	else {
		// Show all districts
		update_district("");
	}

	// Look for an identifier that contains the default_patient_id string
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
		update_district(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + country_id).val(selected_opt[0].value);
		update_personal_code();
	}
});

function createList(element_id, element_id_list, tab_index){
	$j("#"+ element_id).before('<select class="gwt-ListBox" tabindex="' + tab_index + '" id="' + element_id_list + '" style="width: 200px; height: 25px; font-size: 16px; font-family: Verdana, \'Lucida Grande\', \'Trebuchet MS\', Arial, sans-serif;"><option value=" "> </option></select>');

	$j("#" + element_id).hide();
}

function update_district(filter_code){
    
	$j("#" + district_id_list).find("option").remove();
		
	var filter_reg;
	if(filter_code.length > 0){
		filter_reg = new RegExp("^" + filter_code + "[0-9]" + " ");
	}
	else {
		filter_reg = new RegExp("^[0-9][0-9] ");
	}
	
	$j("#" + district_id_list).append("<option value></option>");
	options_init.each(function () {
		if(filter_reg.test($j(this).text())){
			$j("#" + district_id_list).append("<option value'" + $j(this).text() + "'>" + $j(this).text() + "</option>");
			if($j(this).text() == district){
				$j("#" + district_id_list).val($j(this).text());
			}
		}
	});
	process_district();	
 }

$j("#" + district_id_list).change(function () {
	process_district();
});

function process_district(){
	var selected_opt = $j("#" + district_id_list + " option:selected");
	if(selected_opt.length == 1){
		update_village(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + district_id).val(selected_opt[0].value);
	}
	else {
		update_village("");
	}
	update_personal_code();
}

function update_village(filter_code){
	
	$j("#" + village_id_list).find("option").remove();
	
	var filter_reg;
	if(filter_code.length > 0){
		filter_reg = new RegExp("^" + filter_code + "[0-9][0-9]" + " ");
	}
	else {
		filter_reg = new RegExp("^[0-9][0-9][0-9][0-9] ");
	}
	
	$j("#" + village_id_list).append("<option value></option>");
	options_init.each(function () {
		if(filter_reg.test($j(this).text())){
			$j("#" + village_id_list).append("<option value'" + $j(this).text() + "'>" + $j(this).text() + "</option>");
			if($j(this).text() == village){
				$j("#" + village_id_list).val($j(this).text());
			}
		}
	});	
	process_village();
 }

$j("#" + village_id_list).change(function () {
	process_village();
});

function process_village(){
	var selected_opt = $j("#" + village_id_list + " option:selected");
	if(selected_opt.length == 1){
		update_subvillage(selected_opt[0].value.split(code_delimiter)[0]);
		$j("#" + village_id).val(selected_opt[0].value);
		select_location(selected_opt[0].value);
	}
	else {
		update_subvillage("");
	}
	update_personal_code();
}
	
function update_subvillage(filter_code){
	
	$j("#" + subvillage_id_list).find("option").remove();
		
	var filter_reg;
	if(filter_code.length > 0){
		filter_reg = new RegExp("^" + filter_code + "[0-9]" + " ");	
	}	
	else {
		filter_reg = new RegExp("^[0-9][0-9][0-9][0-9][0-9] ");
	}

	$j("#" + subvillage_id_list).append("<option value></option>");
	options_init.each(function () {
		if(filter_reg.test($j(this).text())){
			$j("#" + subvillage_id_list).append("<option value'" + $j(this).text() + "'>" + $j(this).text() + "</option>");
			if($j(this).text() == subvillage){
				$j("#" + subvillage_id_list).val($j(this).text());
			}
		}
	});
	process_subvillage();
}

$j("#" + subvillage_id_list).change(function () {
	process_subvillage();
});

function process_subvillage(){
	var selected_opt = $j("#" + subvillage_id_list + " option:selected");
	if(selected_opt.length == 1){
		$j("#" + subvillage_id).val(selected_opt[0].value);
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
		
	var country_code = $j("#" + country_id).val().split(code_delimiter)[0];
	if(country_code.length != 1){
		return "";
	}
	
	var village_code = $j("#" + village_id).val().split(code_delimiter)[0];
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
	
	//Delete special characters
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
 
// Listeners associated to personal code (codigo de cribado)

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

// Listeners associated a identifier type dropdown
$j("#" + patient_id_type_id).change(function () {
	
	var selected_opt = $j("#" + patient_id_type_id + " option:selected");
	if(selected_opt.length == 1){
		check_if_secundary_patient_id_type(selected_opt);
	}
});

function check_if_secundary_patient_id_type(selected_opt){
	if (selected_opt.first().text().toLowerCase().indexOf(secundary_patient_id_type.toLowerCase()) > -1){
		use_personal_code_as_identifier = true;
		update_personal_code();
	}
	else {
		use_personal_code_as_identifier = false;
	}
}