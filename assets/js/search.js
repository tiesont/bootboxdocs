
    var idx;
    var docs = [];
    var $searchForm = $('#search-form');
    var $searchBox = $('#lunrsearch');
    var $lunrOutput = $('#lunrsearchresults');
    var $clearBtn = $('<button type="button" class="btn btn-clear"><i class="fas fa-times"></i> Clear results</button>');

    $(function(){
        $.getJSON('/assets/data/index.json', function(json){
            docs = json;

            idx = lunr(function () {
                this.ref('id');
                this.field('title');
                this.field('body');
                this.field('url');
                this.metadataWhitelist = ['position'];

                docs.forEach(function (doc) {
                    this.add(doc);
                }, this);
            });
        }).fail(function(jqxhr, status, err){
            console.log(err);
        });
    });

    function lunr_search(term) {
        $lunrOutput.empty();
        var $output = $('<ul id="search-results"></ul>');

        if(term) {
            $lunrOutput.html($clearBtn);
           
            $clearBtn.off('click');
            $clearBtn.on('click', function(e) {
                e.preventDefault();

                $lunrOutput.empty();
            });
            
            var results = idx.search(term);
            if(results.length > 0){
                results.forEach(function (result) {
                    var doc = docs[result.ref];
                    if(doc) {
                        var url = doc.url;
                        var title = doc.title;
                        
                        var body;
                        var key = Object.keys(result.matchData.metadata)[0];
                        if(key) {
                            var content = result.matchData.metadata[key].body;
                            if(content) {
                                var pos = content.position[0];
                                body = '&hellip;' + doc.body.substring(pos[0] - 60, pos[0] + pos[1] + 60) + '&hellip;';
                            }
                            else {
                                body = doc.body.substring(0, 60) + '&hellip;';
                            }
                        }
                        else {
                            body = doc.body.substring(0, 60) + '&hellip;';
                        }
                        
                        // Highlight matches in snippet
                        var r = $('<div><span class="body">' + body + '</span></div>').mark(term);
                        $output.append('<li class="lunrsearchresult"><a href="./' + url + '"><span class="title">' + title + '</span>' + r.html() + '<span class="url">' + url + '</span></a></li>');
                    }
                });
            } 
            else {
                $output.html('<li class="lunrsearchresult">No results found&hellip;</li>');
            }
        }
        
        $lunrOutput.append($output);
    }

    $searchForm.on('submit', function(e) {
        e.preventDefault();

        lunr_search($searchBox.val());
    });