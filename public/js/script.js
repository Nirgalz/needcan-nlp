let nlp = nlp_compromise

//gunDB stuff
// Sync this gun instance with the server.
let gun = Gun([
    'http://localhost:3000/node_modules/gun',
]);
// Reads key 'data'.

/*
let nobjects = gun.get('nobjects');
*/


function getsSharedTagsNobjects(tagz) {
    let nobjects = [];

    for (let i=1; i<tagz.length; i++) {
        gun.tagged().path(tagz[i]).val(function(tagmember,tags){
            nobjects.push(tagmember)
        })
    }

    return nobjects;

}






//adds object linked with tags
function addGunNobject(item, inctags) {


    //object constructor
    let nobject = {
        needcan: item.needcan,
        fullText: $('#inputData').val()
    };

    //user constructor
    /* let noUser = {
     username: item.owner,
     nobjects: {}
     };*/

    //associations
    /* nobject.owner = noUser;
     noUser.nobjects = nobject;
     $.extend(noUser.nobjects, nobject);
     */
    //puts in gundb and indexes objects

    let nobjectID = Gun.text.random(6);

    gun.put(nobject).key('nobject/' + nobjectID);
    /*
     gun.put(noUser).key('noUsers/' + item.owner);
     */
    let guNobject = gun.get('nobject/' + nobjectID);

    let tags = inctags.toString().split(' ');
    //for loop for tags
    for (var i = 0; i < tags.length; i++) {
        guNobject.tag(tags[i]);
    }
    Graph.getGraphViz(nobjectID);


    /* nobjects.path('tags').on(function (tags) {
     console.log('tags:', tags)
     })*/
}


const resultCellName = $('#result-names');
const resultCellNoun = $('#result-nouns');


//interface semantic-ui stuff :
//sidebar
$('#side-menu').on('click', function () {
    $('.ui.labeled.icon.sidebar')
        .sidebar('toggle');
});

//need can button
const needcanBTN = $('.needcan-btn');

needcanBTN.on('click', function () {
    needcanBTN.removeClass('active needcan-active');
    $(this).addClass('active needcan-active');
});

function checkNeedCanButton() {
    let result = $('.needcan-active').attr('id').split('-');
    return result[1];
}


//knobject constructor
//placeholder
function NobjectConstr(username, needcan, tags) {
    this.owner = username;
    this.needcan = needcan;
    this.tags = {};
}


//NLP stuff
function processNames() {
    let data = $('#inputData');
    resultCellName.empty();
    let result = nlp.text(data.val()).people();
    result.forEach(function (item, index, arr) {
        resultCellName.append(arr[index].firstName + ' - ');
    });
}

function processNouns() {
    let tags = [];
    let data = nlp.text($('#inputData').val());
    resultCellNoun.empty();
    let sentences = data.sentences;
    for (var i = 0; i < sentences.length; i++) {
        let terms = sentences[i].terms;
        for (var j = 0; j < terms.length; j++) {
            if (terms[j].tag == 'Noun' || terms[j] == 'Verb') {
                tags.splice(j, 0, terms[j].text);
            }
        }
    }
    return tags;
}


function processData() {
    let username = $('#username').val();

    processNames();

    let knob = new NobjectConstr(username, checkNeedCanButton());
    let tags = processNouns();
    $('#result-print').html(printsNobjectData(knob.owner, knob.needcan, tags));
    addGunNobject(knob, tags);

}


//print results
function printsNobjectData(username, needType, tags) {
    return `<table class="ui celled table">
<tbody>
<tr>
<td>Username</td>
<td>${ username }</td>
</tr>
<tr>
<td>NEED/CAN</td>
<td>${ needType }</td>
</tr>
<tr>
<td>Tags</td>
<td>${ tags }</td>
</tr>
</tbody>
</table>`;
}

