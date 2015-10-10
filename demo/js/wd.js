/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */


$(function() {
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '100mb',
        flash_swf_url: 'js/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken_url: $('#uptoken_url').val(),
        domain: $('#domain').val(),
        get_new_uptoken: false,
        // downtoken_url: '/downtoken',
        // unique_names: true,
        // save_key: true,
        // x_vars: {
        //     'id': '1234',
        //     'time': function(up, file) {
        //         var time = (new Date()).getTime();
        //         // do something with 'time'
        //         return time;
        //     },
        // },
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
     
            },
            'BeforeUpload': function(up, file) {
         
            },
            'UploadProgress': function(up, file) {
      
            },
            'UploadComplete': function() {
              
            },
            'FileUploaded': function(up, file, info) {
                var res = $.parseJSON(info);
                    var url;
                    if (res.url) {
                        url = res.url;
                    } else {
                        var domain = up.getOption('domain');
                        url = domain + encodeURI(res.key);
                        var link = domain + res.key;
                    }
                    var ref = new  Wilddog(conf.wilddog.baseurl);
                        ref.push({
                        "id":randomString(10),
                        "name" : res.key,
                        "url":url,
                        "time": new Date().getTime()
                    });
            },
            'Error': function(up, err, errTip) {
            }
        }
    });
    var first = true;
    var options = {
              itemSelector: '.box',
              gutter: 50,
              isAnimated: true
    };

    function randomString(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
    function addImage(data){
        if(jQuery("#"+data.val().id).length>0){
            return;
        }
          var url = conf.qiniu.imageBaseUrl+"/"+data.val().name;
          var $container = $('#masonry');
          var $item =  $("<div  id=\""+data.val().id+"\" class=\"box\"><img title=\""+data.val().name+"\"  src=\""+url+"\"></div>");
          $container.append($item) .masonry( 'appended', $item )
        .masonry(options);
         
    
    }

       var ref = new  Wilddog(conf.wilddog.baseurl);
       ref.once('value',function(snapshot){
        var str = "", url ="";

        snapshot.forEach(function(data) {
                 url = conf.qiniu.imageBaseUrl+"/"+data.val().name;
                 str   +=  "<div id=\""+data.val().id+"\" class=\"box\"><img title=\""+data.val().name+"\"  src=\""+url+"\"></div>";
        });
        var $container = $('#masonry');
        $container.append(str);
        $container.imagesLoaded( function(){
             $container.masonry(options);
        });
         ref.on("child_added",function(snapshot){
              addImage(snapshot);
        });

    });

      
});
