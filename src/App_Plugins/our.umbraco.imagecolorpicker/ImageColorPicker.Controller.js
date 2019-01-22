angular.module('umbraco').controller('imagecolorpicker.controller', function ($scope, entityResource, editorState, mediaHelper) {


  $scope.imageSrc = null;
  $scope.imageId = null;
  $scope.swatchStyle = {};
  $scope.hoverSwatchStyle = {};
  $scope.hexColor = '';
  $scope.top = 0;
  $scope.left = 0;

  $scope.setImageSrc = function (mediaId) {
    if (mediaId) {
      entityResource.getById(mediaId, 'Media').then(function (ent) {

        $scope.imageSrc = mediaHelper.resolveFileFromEntity(ent);

      });
    }
  };

  $scope.getMediaId = function (alias) {

    if (editorState.current) {
      var tabs = editorState.current.tabs;
      var id = null;
      var prop = null;

      angular.forEach(tabs, function (tab) {
        if (prop === null || prop.length <= 0) {
          prop = _.filter(tab.properties, function (prop) {
            return prop.alias === alias;
          });
        }

      });

      if (prop != null && prop.length > 0) {
        id = prop[0].value;
        $scope.imageId = id;
      }
    }

  };

  $scope.init = function () {

    //setup the canvas
    var canvas = $('#icpImageCanvas').get(0);
    var ctx = canvas.getContext('2d');

    //set the canvas image once we have an image source set
    $scope.$watch('imageSrc', function (n, o) {

      if (n !== o || $scope.model.config.pickedImage) {

        var image = new Image();
        image.src = $scope.imageSrc;

        $(image).load(function () {

          //set the height either from configuration or defaults
          if ($scope.model.config.width && $scope.model.config.height) {
            canvas.width = $scope.model.config.width;
            canvas.height = $scope.model.config.height;
          } else {
            canvas.width = 300;
            canvas.height = 300;
          }


          var hRatio = canvas.width / image.width;
          var vRatio = canvas.height / image.height;
          var ratio = Math.min(hRatio, vRatio);

          //set the canvas size according to image;

          if (vRatio < 1) {
            canvas.height = image.height * ratio;
          } else {
            canvas.width = image.width * ratio;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width * ratio, image.height * ratio);
        });

        $(canvas).mousemove(function (e) {
          var pixelArray = getPixelArray(e);
          var pixelcolor = 'rgba(' + pixelArray[0] + ', ' + pixelArray[1] + ', ' + pixelArray[2] + ', ' + pixelArray[3] + ')';
          $scope.hoverSwatchStyle = { 'display': 'block', 'background': pixelcolor, 'top': $scope.top, 'left': $scope.left };
          $scope.$apply();

        });

        $(canvas).mouseleave(function (e) {
          $scope.hoverSwatchStyle = { 'display': 'none' };
          $scope.$apply();
        })

        $(canvas).click(function (e) {

          var pixelArray = getPixelArray(e);
          var pixelcolor = 'rgba(' + pixelArray[0] + ', ' + pixelArray[1] + ', ' + pixelArray[2] + ', ' + pixelArray[3] + ')';
          $scope.model.value = pixelcolor;
          $scope.hexColor = '#' + toHex(pixelArray[0]) + toHex(pixelArray[1]) + toHex(pixelArray[2]);
          $scope.swatchStyle = { 'background': pixelcolor };

        });
      }

    });

    var toHex = function (d) {
      return ('0' + (Number(d).toString(16))).slice(-2).toUpperCase()
    }

    var getPixelArray = function (e) {

      var canvasOffset = $(canvas).offset();
      var canvasX = Math.floor(e.pageX - canvasOffset.left);
      var canvasY = Math.floor(e.pageY - canvasOffset.top);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pixels = imageData.data;

      $scope.top = canvasY + 10;
      $scope.left = canvasX + 10;

      //get the index of the red value of the currently selected pixel
      var pixelRedIndex = ((canvasY - 1) * (imageData.width * 4)) + ((canvasX - 1) * 4);
      var pixelArray = [pixels[pixelRedIndex], pixels[pixelRedIndex + 1], pixels[pixelRedIndex + 2], pixels[pixelRedIndex + 3]];
      return pixelArray;

    }



    //decision either mediaPicker on page or propertyeditor configured image
    if (!$scope.model.config.pickedImage) {

      $scope.$watch('imageId', function (n, o) {
        if (n && n !== o) {
          $scope.setImageSrc(n);
        }
      });
      var i = setInterval(function () { $scope.getMediaId($scope.model.config.mediaPickerAlias) }, 200);

    } else {
      $scope.imageSrc = $scope.model.config.pickedImage;
    }

    //if a colour has been picked in the past set the swatch
    if ($scope.model.value) {
      $scope.swatchStyle = { 'background': $scope.model.value };
    }

  }

  $scope.init();


});