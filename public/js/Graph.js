//graph vis module with cytoscape

let Graph = (function () {


    let cy = cytoscape({
        container: $('#cy'),
        refresh: 20,
        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                }
            }
        ]


    });



    function vizAllData(action, nobjectID, tags) {



        if (action === 'fullUpdate') {

            let data = gunDB.getsAllData();
            let nobTags = Object.keys(data);
            let elements = [];
            for (let j=1; j<nobTags.length; j++) {
                elements.push({data :{id: nobTags[j], name: nobTags[j]}});
                gun.get('guntagger/' +nobTags[j]).val(function(tagmember,tags){
                    let nobjects =Object.keys(tagmember);
                    for (let k= 1; k<nobjects.length; k++) {
                        elements.push({data :{id: nobjects[k], name: nobjects[k]}});
                        elements.push({data:{id: nobTags[j] + nobjects[k] ,source: nobjects[k], target: nobTags[j]}});

                    }
                })
            }


            cy.add(elements);
            cy.layout({
                name: 'concentric',
                concentric: function( node ){
                    return node.degree() *4;
                },
                levelWidth: function( nodes ){
                    return 2;
                }
            })
        } else  if (action === 'addUpdate') {
            getGraphViz(action, nobjectID)
        }




    }



    function getsTags(nobTags, nobjectID, taggedNobjects, elements) {

        for (let i=1; i<nobTags.length; i++) {
            elements.push({data:{id: nobTags[i], name: nobTags[i]}});
        }
        for (let j=1; j<nobTags.length; j++) {
            elements.push({data:{id: nobjectID + nobTags[j] ,source: nobjectID, target: nobTags[j]}});
        }
        for (let k=0; k<taggedNobjects.length; k++) {
            let keys = Object.keys(taggedNobjects[k]);
            let noTag = taggedNobjects[k]['_']['#'].split('/');
            for (let l=1; l<keys.length; l++) {
                let id = keys[l];
                elements.push({data:{id: id, name: id}});


                elements.push({data:{id: noTag[1] + keys[l],source: noTag[1], target: keys[l]}});
            }
        }
        console.log(elements);
        return elements;

    }



    let getGraphViz = function (action, nobjectID) {

        let nobNC;
        let nobTags;

        gun.get('nobject/'+nobjectID).path('needcan').val(function (needcan) {
            nobNC = needcan;
        });
        gun.get('nobject/'+nobjectID).path('tags').val(function (tags) {
            nobTags = tags;
        });
        nobTags = Object.keys(nobTags);


        let elements = [
            {data :{id: nobjectID, name: nobNC}},

        ];

        let taggedNobjects = gunDB.getsSharedTagsNobjects(nobTags);


        getsTags(nobTags, nobjectID, taggedNobjects, elements);
        //init graph and options
        if (action === 'notag') {
            let cy = cytoscape({
                container: $('#cy'),
                style: [ // the stylesheet for the graph
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#666',
                            'label': 'data(id)'
                        }
                    },

                    {
                        selector: 'edge',
                        style: {
                            'width': 3,
                            'line-color': '#ccc',
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle'
                        }
                    }
                ],

                layout: {
                    name: 'concentric',
                    concentric: function( node ){
                        return node.degree();
                    },
                    levelWidth: function( nodes ){
                        return 2;
                    }
                },
                elements: elements
            });
        } else  if (action === 'addUpdate') {
            cy.add(elements);
        }



    };



    return {
        getGraphViz: getGraphViz,
        vizAllData: vizAllData
    }
    
})();