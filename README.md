# Image Color Picker

This is an Umbraco package. It allows editors to pick colors from images like the eye dropper tool in most popular image editors. Allows the editor to pick from image picked in other media picker properties on the same document type or, if they prefer, the user can configure the editor to use a media item as the source for the image.  This is useful if you have a predefined palette of colors.

## Installation

### Nuget
[![NuGet](https://buildstats.info/nuget/Our.Umbraco.ImageColorPicker)](https://www.nuget.org/packages/Our.Umbraco.ImageColorPicker/)

Run this form your Package Manager Console in Visual Studio:

    PM> Install-Package Our.Umbraco.ImageColorPicker

### Umbraco Package

https://our.umbraco.com/packages/backoffice-extensions/image-color-picker/

### Manually
Download the code and copy it into you App_Plugin folder.

## Configuration

### Using another media picker property as image source.

Create a new DataType and select 'Image Color Picker' as the Property Editor.

Enter the alias of the other property on the document type that holds the source image you want to pick the color from.  This must be a media picker type.

Set the max width and height (default 300px x 300px) of the display of image you are picking from.

### Using an existing media item

As mentioned this method is useful for selecting colors from a predefined approved range of colors as supplied by the designer.

Create a new DataType and during the configuration of the Property Editor select the 'Media Item' using the media picker instead of supplying the alias.

## Getting the properties values

The property value saves as a string value holding a simple RGBA color value.  EG 
    
    rgba(255,255,255,1) 
    
which can be used in inline CSS applications.



