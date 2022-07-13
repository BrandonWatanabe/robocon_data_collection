const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


function create_table(task_id, json_data) {
    // const json_data = '[{"id": 1,"speaker": "user","intent": "教える","slots": {"ユーザの名前": "鈴木"}},{"id": 2,"speaker": "system","intent": "観光地の名称を確認する","slots": {"ユーザの名前": "鈴木","観光地1の名称": "お台場海浜公園","観光地2の名称": "第三台場"}}]';
    var dialog = json_data;
    // console.log(js)
    // console.log(js.length)

    var t_re = "";
    let table_title = "task" + task_id;

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
        let rowspan = String(1+Object.keys(dialog[i].slots).length)
        if (dialog[i].speaker == "system") {
            table_tmp += '<td style = "text-align:center" rowspan='+ rowspan + '>店員</td>'
        } else if (dialog[i].speaker == "user") {
            table_tmp += '<td style = "text-align:center" rowspan='+ rowspan + '>客</td>'
        }

        table_tmp += '<td>発話意図</td><td>' + dialog[i].intent + '</td>'
        table_tmp += '<td rowspan=' + rowspan + '>' +
            '<li><input type="text" id="' + task_id + dialog[i].id + "_" + dialog[i].speaker + "_utterance1" + '" name="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance1" + '" style="width:90%;margin:2 0px;resize:none" placeholder="1つ目の発話文を入力してください"/></li>' +
            '<li><input type="text" id="' + task_id + dialog[i].id + "_" + dialog[i].speaker + "_utterance2" + '" name="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance2" + '" style="width:90%;margin:2 0px;resize:none" placeholder="2つ目の発話文を入力してください"/></li>' +
            '</td></tr>';
        for (var s = 0; s < Object.keys(dialog[i].slots).length; s++) {
            table_tmp += '<tr><td>' + Object.keys(dialog[i].slots)[s] + '</td><td>' + Object.values(dialog[i].slots)[s] + '</td></tr>'
        }
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
    var text_write = "id,speaker,intent,slots.keys,slots.values,utterance1,utterance2\n";

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


    // const dialog_id = dialog_list[table_id - 1].id;
    // const dialog_turns = dialog_list[table_id - 1].turns;
    for (var i = 0; i < dialog.length; i++) {
        var value_tmp = dialog[i].id + "," + dialog[i].speaker + "," + dialog[i].intent + ",";
        var value_tmp_slots_keys = "";
        var value_tmp_slots_values = "";
        for (var j = 0; j < dialog[i].slots.length; j++) {
            value_tmp_slots_keys += Object.keys(dialog[i].slots)[j] + " ";
            value_tmp_slots_values += Object.values(dialog[i].slots)[j] + " ";
        }
        value_tmp += value_tmp_slots_keys.trimRight() + "," + value_tmp_slots_values.trimRight() + ",";
        // value_tmp += dialog["intent"] + ","
        // var smile_tmp = document.getElementsByName(dialog_id + "_" + dialog[i][0] + "_smile");
        // var nod_tmp = document.getElementsByName(dialog_id + "_" + dialog[i][0] + "_nod");
        // smile_selected = null;
        // nod_selected = null;
        // for (var j = 0; j < smile_tmp.length; j++) {
        //     if (smile_tmp[j].checked) {
        //         value_tmp += smile_tmp[j].value + ",";
        //         smile_selected = smile_tmp[j].value;
        //     }
        // }
        // if (smile_selected == null) {
        //     all_checked = false;
        //     break;
        // }
        // for (var j = 0; j < nod_tmp.length; j++) {
        //     if (nod_tmp[j].checked) {
        //         value_tmp += nod_tmp[j].value;
        //         nod_selected = nod_tmp[j].value;
        //     }
        // }
        // if (nod_selected == null) {
        //     all_checked = false;
        //     break;
        // }
        var replace1 = "";
        var replace2 = "";
        // if (dialog[i].intent != "") {
        replace1 = document.getElementById(task_id + "_" + dialog[i].id + '_' + dialog[i].speaker + "_utterance1").value;
        replace2 = document.getElementById(task_id + "_" + dialog[i].id + '_' + dialog[i].speaker + "_utterance2").value;
        if (replace1 == "" || replace2 == "") all_checked = true;
        else value_tmp += replace1 + "," + replace2;
        // } else {
        //     value_tmp += ",,,";
        // }

        text_write += value_tmp + "\n";
    }

    if (all_checked == true) download(table_id + "_" + document.getElementById("WorkerID").value + "_" + age + "_" + gender + "_" + dialog_id + ".csv", text_write);
    else alert(dialog_id + "つ目の対話欄に入力されていない項目があります．");
};
