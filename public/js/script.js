let nlp = nlp_compromise

//gunDB stuff
// Sync this gun instance with the server.
let gun = Gun([
    'http://localhost:3000/node_modules/gun',
]);
// Reads key 'data'.

let nobjects = gun.get('nobjects');



function addKnobject(item, tags) {

    //object constructor
    let nobject = {
        needcan: item.needcan
    };

    //user constructor
    let noUser = {
        username: item.owner,
        nobjects: {}
    };

    //associations
    nobject.owner = noUser;
    noUser.nobjects = nobject;

    //puts in gundb and indexes objects
    gun.put(nob).key('nobject/' + item.owner + item.needcan);
    gun.put(noUser).key('noUsers/' + item.owner);


    //for loop for tags
  /*  for (var i = 0; i < tags.length; i++) {

        //creates tags keys for each tag
        gun.put(tags[i]).key('noTags/' + tags[i]);
        let tag = gun.get('noTags/' + tags[i]);
        tag.path('name').set(tags[i]);

        //add tags to the nobject

        nobjects.path('tags').set(tags[i]);
    }*/


    /*  user.path('nobjects').set( object key or something)*/



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
function Knobject(username, needcan, tags) {
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
            if (terms[j].tag == 'Noun') {
                tags.splice(j, 0, terms[j].text);
            }
        }
    }
    return tags;
}


function processData() {
    let username = $('#username').val();

    processNames();

    let knob = new Knobject(username, checkNeedCanButton());
    let tags = processNouns();
    $('#result-print').html(printResults(knob.username, knob.needcan, tags))
    addKnobject(knob, tags);

}


//print results
function printResults(username, needType, tags) {
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

