let gunDB = (function () {


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


    function getsSharedTagsNobjects(tagz) {
        let nobjects = [];

        for (let i=1; i<tagz.length; i++) {
            gun.tagged().path(tagz[i]).val(function(tagmember,tags){
                nobjects.push(tagmember)
            })
        }

        return nobjects;

    }

    function getsAllData() {
        let tagz;

            gun.tagged().val(function(tagmember,tags){
                tagz =tagmember;
            });


        return tagz;
    }



    return {
        addGunNobject: addGunNobject,
        getsSharedTagsNobjects: getsSharedTagsNobjects,
        getsAllData: getsAllData
    }

})();