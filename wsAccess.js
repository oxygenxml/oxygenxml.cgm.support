function applicationStarted(pluginWorkspaceAccess) {
 var imageHandler = {
      editImage: function(editContext){return null;},
      editImage: function(url){return false;},
      canHandleFileType: function(type){return type.equals("cgm")},
      clearCache: function(){},
      getImageLayoutInformation: function(cp, rc){
         image = getCGMImage(pluginWorkspaceAccess, cp, rc);
         return new Packages.ro.sync.exml.workspace.api.images.handlers.ImageLayoutInformation(0, 0, image.getWidth(null), image.getHeight(null));
      },
      getImage: function(cp, rc){
         return getCGMImage(pluginWorkspaceAccess, cp, rc);
      }
 }


  /**
   * This line overrides the oXygen default CGM image handler.
   *
   * Uncomment to activate this feature.
   */
  //pluginWorkspaceAccess.getImageUtilities().addImageHandler(new JavaAdapter(Packages.ro.sync.exml.workspace.api.images.handlers.EditImageHandler, imageHandler));
}

function getCGMImage(pluginWorkspaceAccess, cp, rc){
     var cgmPanel = new Packages.net.sf.jcgm.core.CGMPanel();
     cgmPanel.setSize(800, 600);
     cgmPanel.open(cp.getUrl());
    // Create a new bufferedImage with imagePanel size
    var image = new Packages.java.awt.image.BufferedImage(800, 600, Packages.java.awt.image.BufferedImage.TYPE_INT_RGB);
    // Create a graphics context from the new image
    var graphics = image.createGraphics();
    graphics.setColor(Packages.java.awt.Color.WHITE);
    graphics.fillRect(0, 0, 800, 600);

    var paintComponentMethod = getPaintMethod(cgmPanel.getClass());
    paintComponentMethod.setAccessible(true);
    paintComponentMethod.invoke(cgmPanel, graphics);
     return image;
}

  /**
   * Looks inside the provided class to find the "paint" method.
   *
   * @param clazz The class with public "paint" method.
   * @return The "paint" method.
   */
  function getPaintMethod(clazz) {
    var paint = null;
    while (paint == null && clazz != null) {
      try {
        var declMethods = clazz.getDeclaredMethods();
        for(i=0;i<declMethods.length;i++){
            if(declMethods[i].getName().equals("paint")){
                paint = declMethods[i];
            }
        }
      } catch (e) {
        // No such method.
      }

      clazz = clazz.getSuperclass();
    }

    return paint;
  }

function applicationClosing(pluginWorkspaceAccess) {
}
