// FIXME convert part of the html generation code to a static template.html

// FIXME prettify, highlight columns in rainbow colors, highlight header, add help and examples. Add command history.

function escape_html(src) {
    return String(src).replace(/[&<>"'`=\/]/g, function (s) { return entity_map[s]; });
}


function make_html_table(records) {
    result = [];
    // TODO use th elements for header row
    result.push('<table>');
    for (var nr = 0; nr < records.length; nr++) {
        result.push('<tr>');
        for (var nf = 0; nf < records[nr].length; nf++) {
            result.push('<td>');
            result.push(escape_html(records[nr][nf]));
            result.push('</td>');
        }
        result.push('</tr>');
    }
    result.push('</table>');
    return result.join('');
}


function make_html_head(style, script) {
    return '<head><style>' + style + '</style><script>' + script + '</script></head>';
}


function make_html(head, body) {
    return '<!DOCTYPE html><html>' + head + body + '</html>';
}


function make_css() {
    css_rules = [];
    css_rules.push('html * { font-size: 16px !important; }');
    css_rules.push('table { display: block; overflow-x: auto; white-space: nowrap; border-collapse: collapse; }');
    css_rules.push('th, td { border: 1px solid rgb(130, 6, 219); padding: 3px 8px; }');
    css_rules.push('input { margin-right: 10px; font-size: 18px !important; vertical-align: bottom; height: 22px }');
    css_rules.push('#rbql_run_btn { width: 70px; background-color: #4CAF50; text-decoration: none; display: inline-block; transition-duration: 0.3s; border:none; font-size: 18px !important; color: white; height: 28px;}');
    css_rules.push('#rbql_run_btn:hover { background-color: #3e8e41; }');
    css_rules.push('#rbql_error_message { width: 50%; top: 20%; left: 25%; z-index: 1000000; padding: 2px; background-color: #FF4444; position: fixed; display: none; color: black; border: 2px solid rgb(130, 6, 219);}');
    css_rules.push('#ack_error { width: 70px; background-color: #FF0000; text-decoration: none; display: inline-block; transition-duration: 0.3s; border:none; font-size: 18px !important; color: white; height: 28px; border: 1px solid black;}');
    css_rules.push('#ack_error:hover { background-color: #b70101; }');
    css_rules.push('#error_message_details { height: 100px; overflow: auto; border: 1px solid black; white-space: pre;}');
    return css_rules.join('\n');
}


function slow_replace_all(src, old_substr, new_substr) {
    while (src.indexOf(old_substr) != -1) {
        src = src.replace(old_substr, new_substr);
    }
    return src;
}


function make_preview(client_js_template, preview_records, origin_server_port) {
    var css_part = make_css();

    const js_template = client_js_template;
    
    var client_side_js = slow_replace_all(js_template, '__EMBEDDED_JS_PORT__', String(origin_server_port));

    var html_head = make_html_head(css_part, client_side_js);

    var html_table = '<h3>Table preview around cursor:</h3>';
    html_table += make_html_table(preview_records);
    var input_html = '<br><h3>Input SQL-like RBQL query and press Enter:</h3>';
    input_html += '<input type="text" size="70" id="rbql_input" placeholder="select ... where ... order by ... limit ... " autofocus><button id="rbql_run_btn">Run</button>'

    var status_label = '<br><div><span id="status_label"></span></div>';
    var error_message = '<div id="rbql_error_message"><div><span>Error while executing RBQL query!</span><br><span id="error_message_header"></span></div><br><div><span>Details:</span><br><div id="error_message_details"></div></div><div style="display: flex; justify-content:center;"><button id="ack_error">OK</button></div></div>';
    var rbql_dashboard = '<div id="rbql_dashboard" style="display:none">' + html_table + input_html + status_label + error_message + '</div>';
    var init_running = '<span id="init_running">Connecting to the main VSCode process at http://localhost:__EMBEDDED_JS_PORT__/echo ...<br>Please submit a bugreport to https://github.com/mechatroner/vscode_rainbow_csv if this message doesn\'t disappear.<br>You can also try to reopen this preview page.</span>'.replace('__EMBEDDED_JS_PORT__', String(origin_server_port))
    var html_body = '<body>' + init_running + rbql_dashboard + '</body>';

    return make_html(html_head, html_body);
}


module.exports.make_preview = make_preview;
