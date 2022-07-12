const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


function create_table(table_id, json_data) {
    // const json_data = '[{"id": 1,"speaker": "user","intent": "教える","slots": {"ユーザの名前": "鈴木"}},{"id": 2,"speaker": "system","intent": "観光地の名称を確認する","slots": {"ユーザの名前": "鈴木","観光地1の名称": "お台場海浜公園","観光地2の名称": "第三台場"}}]';
    let dialog = JSON.parse(json_data);
    // console.log(js)
    // console.log(js.length)

    var t_re = "";
    let table_title = table_id + "つ目の対話";
    // let dialog_id = dialog.id;
    // let dialog_turns = dialog.turns;
    // const JsonData = require('./example.json');
    // let da_n = dialog.length

    t_re += '<table border="1" style="width:100%" align="center">' +
        '<caption>' +
        '<div class="text-center">' +
        '</br></br>' +
        '<h3>' +
        table_title +
        '</h3>' +
        '</div>' +
        '</caption>' +
        '<tbody>' +
        '<th style="width:10%; text-align:center">話者</th>' +
        '<th style="width:40%; text-align:center" colspan="2">DA・情報</th>' +
        '<th style="width:50%; text-align:center">発話文</th>'

    for (var i = 0; i < dialog.length; i++) {
        var table_tmp = '<tr>'
        // let rowspan = String(1+Object.keys(dialog[i].slots[0]).length)
        let rowspan = String(1+Object.keys(dialog[i].slots).length)
        if (dialog[i].speaker == "system") {
            table_tmp += '<td style = "text-align:center" rowspan='+ rowspan + '>店員</td>'
            // table_tmp += '<td style = "text-align:center">店員</td>'
        } else if (dialog[i].speaker == "user") {
            table_tmp += '<td style = "text-align:center" rowspan='+ rowspan + '>客</td>'
            // table_tmp += '<td style = "text-align:center">客</td>'
        }

        table_tmp += '<td>発話意図</td><td>' + dialog[i].intent + '</td>'
        table_tmp += '<td rowspan=' + rowspan + '>' +
            '<li><input type="text" id="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance1" + '" name="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance1" + '" style="width:90%;margin:2 0px;resize:none" placeholder="1つ目の発話文を入力してください"/></li>' +
            '<li><input type="text" id="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance2" + '" name="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance2" + '" style="width:90%;margin:2 0px;resize:none" placeholder="2つ目の発話文を入力してください"/></li>' +
            '</td></tr>';
        for (var s = 0; s < Object.keys(dialog[i].slots).length; s++) {
            table_tmp += '<tr><td>' + Object.keys(dialog[i].slots)[s] + '</td><td>' + Object.values(dialog[i].slots)[s] + '</td></tr>'
        }
        // table_tmp += '</tr>'
        //     } else {
        //         table_tmp += '<td></td>'
        //     }
        //     table_tmp += '<td>' +
        //         '</td>' +
        //         '<td>' +
        //         '</td>'
        // } else {
        //     table_tmp += '<td>' +
        //         '</td>' +
        //         '<td>' +
        //         '</td>'
        // }
        t_re += table_tmp;
    }
    return t_re
};

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
};

function submit(table_id) {
    var all_checked = true;
    var text_write = "turn_id,speaker,utterance1,utterance2,smile,nod\n";

    var gender = "";
    var age = "";
    for (var j = 0; j < document.getElementsByName("Gender").length; j++) {
        if (document.getElementsByName("Gender")[j].checked) {
            gender = document.getElementsByName("Gender")[j].value;
        }
    }

    for (var j = 0; j < document.getElementsByName("Age").length; j++) {
        if (document.getElementsByName("Age")[j].checked) {
            age = document.getElementsByName("Age")[j].value;
        }
    }

    if (document.getElementById("WorkerID").value == "" || age == "" || gender == "") {
        all_checked = false;
        alert("ワーカーID，性別，年代を入力してください．");
        return;
    }

    if (!document.getElementById("smile_check").checked) {
        alert("笑顔度合いを確認してチェックしてください．");
        all_checked = false;
        return;
    }

    if (!document.getElementById("nod_check").checked) {
        alert("頷き度合いを確認してチェックしてください．");
        all_checked = false;
        return;
    }


    const dialog_id = dialog_list[table_id - 1].id;
    const dialog_turns = dialog_list[table_id - 1].turns;
    for (var i = 0; i < dialog_turns.length; i++) {
        var value_tmp = dialog_turns[i][0] + "," + dialog_turns[i][1] + ",";

        if (dialog_turns[i][1] == "system") {
            value_tmp += dialog_turns[i][2] + ",,"
            var smile_tmp = document.getElementsByName(dialog_id + "_" + dialog_turns[i][0] + "_smile");
            var nod_tmp = document.getElementsByName(dialog_id + "_" + dialog_turns[i][0] + "_nod");
            smile_selected = null;
            nod_selected = null;
            for (var j = 0; j < smile_tmp.length; j++) {
                if (smile_tmp[j].checked) {
                    value_tmp += smile_tmp[j].value + ",";
                    smile_selected = smile_tmp[j].value;
                }
            }
            if (smile_selected == null) {
                all_checked = false;
                break;
            }
            for (var j = 0; j < nod_tmp.length; j++) {
                if (nod_tmp[j].checked) {
                    value_tmp += nod_tmp[j].value;
                    nod_selected = nod_tmp[j].value;
                }
            }
            if (nod_selected == null) {
                all_checked = false;
                break;
            }
        } else if (dialog_turns[i][1] == "user") {
            var replace1 = "";
            var replace2 = "";
            if (dialog_turns[i][2] != "") {
                replace1 = document.getElementById(dialog_id + "_" + dialog_turns[i][0] + '_' + dialog_turns[i][1] + "_utterance1").value;
                replace2 = document.getElementById(dialog_id + "_" + dialog_turns[i][0] + '_' + dialog_turns[i][1] + "_utterance2").value;
                if (replace1 == "" || replace2 == "") all_checked = false;
                else value_tmp += replace1 + "," + replace2 + ",,";
            } else {
                value_tmp += ",,,";
            }
        }

        text_write += value_tmp + "\n";
    }

    if (all_checked == true) download(table_id + "_" + document.getElementById("WorkerID").value + "_" + age + "_" + gender + "_" + dialog_id + ".csv", text_write);
    else alert(dialog_id + "つ目の対話欄に入力されていない項目があります．");
};
