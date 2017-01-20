var $body = $('body'),
    file_input = $body.find('#file-inp'),
    template_input = $body.find('#template-select'),
    $renderHere = $body.find('#renderHere');

file_input.on('change', handleFile);
template_input.on('change', tpl_selection);
var jsonData;
var selected_template;
var flag = false

function handleFile(e) {
    var files = e.target.files;
    var i, f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {

            var data = e.target.result;

            var workbook = XLSX.read(data, {type: 'binary'});
            /* DO SOMETHING WITH workbook HERE */

            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */

            var worksheet = workbook.Sheets[first_sheet_name];

            jsonData = XLSX.utils.sheet_to_json(worksheet);
            flag = true;
            $body.find('#file-input-error')[0].classList.add('hidden');
            $body.find('#file-inp')[0].classList.remove('err');
        };
        reader.readAsBinaryString(f);
    }
}

function tpl_selection() {
    selected_template = $(template_input).find(':selected')[0].value;
    $body.find('#template-input-error')[0].classList.add('hidden');
    $body.find('#template-select')[0].classList.remove('err');

}

function compileTpl(json) {
    console.log(selected_template);
    var $template = $body.find('#' + selected_template).html(),
        speakersTemplate = Handlebars.compile($template), data = {sheetdata: json};
    var html = speakersTemplate(data);
    $renderHere.val(html);
}

function generate() {
    if (flag == false) {
        $body.find('#file-input-error')[0].classList.remove('hidden');
        $body.find('#file-inp')[0].classList.add('err');
    }
    if (selected_template == null || selected_template == 'default') {
        $body.find('#template-input-error')[0].classList.remove('hidden');
        $body.find('#template-select')[0].classList.add('err');
    }
    else if (selected_template && flag == true)
        compileTpl(jsonData);
}