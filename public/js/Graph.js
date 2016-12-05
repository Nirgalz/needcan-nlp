//graph vis module with cytoscape

let Graph = (function () {



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



    let getGraphViz = function (nobjectID) {

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
            {data :{id: nobjectID, name: nobNC, rank:148}},

        ];

        let taggedNobjects = gunDB.getsSharedTagsNobjects(nobTags);


        getsTags(nobTags, nobjectID, taggedNobjects, elements);
        //init graph and options
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

    };



    return {
        getGraphViz: getGraphViz
    }
    
})();